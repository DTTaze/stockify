import logging
import os
import json
import time
from datetime import datetime, timedelta
from typing import List

from matplotlib.dates import relativedelta
import pandas as pd

try:
    from vnstock import Quote, Listing
except ImportError:
    Quote = None
    Listing = None

from .constants import FETCH_BUFFER, INDICES, PERIOD_MAPPING, VALID_PERIODS
from .exceptions import IndexNotFoundException, DataFetchException
from . import schemas

logger = logging.getLogger(__name__)

CACHE_FILE_PATH = os.path.join(os.path.dirname(__file__), "grouped_symbols_cache.json")
CACHE_DURATION = 43200  # 12 hours


class StockService:
    """Service for Vietnamese stock & index"""

    def __init__(self):
        if Quote is None:
            logger.warning("vnstock not installed")
            self.client = None
        else:
            self.client = Quote

    def get_index_quote(self, index_code: str, period: str) -> schemas.MarketQuote:
        index_key = index_code.lower()

        if index_key not in INDICES:
            raise IndexNotFoundException(index_code)

        return self._get_quote(INDICES[index_key]["code"], period)

    def get_stock_quote(self, symbol: str, period: str) -> schemas.MarketQuote:
        return self._get_quote(symbol.upper(), period)

    def _prepare_df_by_period(self, df: pd.DataFrame, period: str) -> pd.DataFrame:
        df["time"] = pd.to_datetime(df["time"], errors="coerce")
        df = df.dropna(subset=["time"])
        df = df.sort_values("time").reset_index(drop=True)

        if df.empty:
            return df

        if period == "1d":
            return df.tail(2)

        days = PERIOD_MAPPING.get(period)
        if not days:
            return df

        end_date = df["time"].max()
        start_date = end_date - pd.Timedelta(days=days)

        return df[df["time"] >= start_date]

    def _get_first_and_latest(self, df: pd.DataFrame):
        if df.empty:
            return None, None

        return df.iloc[0], df.iloc[-1]

    def _get_quote(self, symbol: str, period: str):
        if not self.client:
            raise DataFetchException("Vnstock client not initialized")

        if period not in VALID_PERIODS:
            raise DataFetchException(f"Invalid period: {period}")

        try:
            quote = self.client(symbol=symbol, source="VCI")

            end_date = datetime.now()

            buffer_days = FETCH_BUFFER.get(period, 30)
            start_date = end_date - timedelta(days=buffer_days)

            df = quote.history(
                start=start_date.strftime("%Y-%m-%d"),
                end=end_date.strftime("%Y-%m-%d"),
                interval="1D",
            )

            if df is None or df.empty:
                raise DataFetchException(f"No data for {symbol}")

            df = self._prepare_df_by_period(df, period)

            first, latest = self._get_first_and_latest(df)

            if first is None or latest is None:
                raise DataFetchException(f"Not enough data for {symbol}")

            close_price = float(latest.get("close", 0))
            first_close_price = float(first.get("close", 0))

            if first_close_price == 0:
                change = 0
                change_percent = 0
            else:
                change = close_price - first_close_price
                change_percent = (change / first_close_price) * 100

            return {
                "symbol": symbol,
                "price": round(close_price, 2),
                "change_percent": round(change_percent, 2),
                "volume": int(latest.get("volume", 0)),
            }
        except SystemExit as e:
            raise DataFetchException("VNStock rate limit exceeded")
        except Exception as e:
            logger.error(f"Quote error {symbol}: {e}", exc_info=True)
            raise

    def get_index_historical(
        self, index_code: str, period: str
    ) -> schemas.MarketHistoricalResponse:
        index_key = index_code.lower()

        if index_key not in INDICES:
            raise IndexNotFoundException(index_code)

        return self._get_historical(
            INDICES[index_key]["code"], period, schemas.MarketType.INDEX
        )

    def get_stock_historical(
        self, symbol: str, period: str
    ) -> schemas.MarketHistoricalResponse:
        return self._get_historical(symbol.upper(), period, schemas.MarketType.STOCK)

    def _get_historical(
        self,
        symbol: str,
        period: str,
        market_type: schemas.MarketType,
    ) -> schemas.MarketHistoricalResponse:

        if not self.client:
            raise DataFetchException("Vnstock client not initialized")

        if period not in VALID_PERIODS:
            raise DataFetchException(f"Invalid period: {period}")

        try:
            days = PERIOD_MAPPING[period]

            quote = self.client(symbol=symbol, source="VCI")

            end_date = datetime.now()
            start_date = end_date - timedelta(days=days)

            df = quote.history(
                start=start_date.strftime("%Y-%m-%d"),
                end=end_date.strftime("%Y-%m-%d"),
                interval="1D",
            )

            if df is None or len(df) == 0:
                raise DataFetchException(f"No historical data for {symbol}")

            data: List[schemas.HistoricalData] = []

            for _, row in df.iterrows():
                data.append(
                    schemas.HistoricalData(
                        date=row.get("time"),
                        close=float(row.get("close", 0)),
                        volume=int(row.get("volume", 0)),
                    )
                )

            return schemas.MarketHistoricalResponse(
                symbol=symbol,
                name=symbol,
                type=market_type,
                period=period,
                data=data,
            )

        except Exception as e:
            logger.error(f"Historical error {symbol}: {e}", exc_info=True)
            raise DataFetchException(str(e))

    def get_indices(self) -> schemas.MarketListResponse:
        items = [
            schemas.MarketInfo(
                symbol=v["code"],
                name=v["name"],
                description=v.get("description"),
                type=schemas.MarketType.INDEX,
            )
            for v in INDICES.values()
        ]

        return schemas.MarketListResponse(items=items)

    def get_stocks(self) -> schemas.MarketListResponse:
        if Listing is None:
            raise DataFetchException("Listing not available")

        try:
            listing = Listing(source="VCI")
            df = listing.all_symbols()

            items = []

            for _, row in df.iterrows():
                items.append(
                    schemas.MarketInfo(
                        symbol=row.get("symbol"),
                        name=row.get("organ_name"),
                        description=None,
                        type=schemas.MarketType.STOCK,
                    )
                )

            return schemas.MarketListResponse(items=items)

        except Exception as e:
            logger.error(f"Stock list error: {e}", exc_info=True)
            raise DataFetchException(str(e))

    def _normalize_exchange(
        self, raw_exchange: str, fallback_exchange: str = ""
    ) -> str:
        if not raw_exchange:
            return fallback_exchange.upper()

        ex = str(raw_exchange).upper()
        if ex in ["HSX", "HOSE"]:
            return "HOSE"
        if ex == "HNX":
            return "HNX"
        if ex == "UPCOM":
            return "UPCOM"
        if ex == "DELISTED":
            return "DELISTED"
        return ex

    def _parse_row_to_stock_dict(self, row: pd.Series, default_exchange: str) -> dict:
        sym = row.get("symbol")
        if not sym:
            return None

        sym_str = str(sym).upper()
        row_exchange = self._normalize_exchange(
            row.get("exchange"), fallback_exchange=default_exchange
        )
        organ_name = row.get("organ_name") or row.get("organ_short_name")
        stock_type = row.get("type") or "stock"

        return {
            "symbol": sym_str,
            "exchange": row_exchange,
            "name": str(organ_name) if pd.notna(organ_name) else "",
            "type": str(stock_type).lower() if pd.notna(stock_type) else "stock",
        }

    def _fetch_symbols_from_source(
        self, source: str, exchanges_to_fetch: List[str], exchange_upper: str
    ) -> List[dict]:
        listing = Listing(source=source)
        symbols_dict = {}
        for ex in exchanges_to_fetch:
            df = listing.symbols_by_exchange(exchange=ex, to_df=True)
            if df is None or df.empty:
                continue
            for _, row in df.iterrows():
                stock_dict = self._parse_row_to_stock_dict(row, ex)
                if stock_dict:
                    if (
                        exchange_upper != "ALL"
                        and stock_dict["exchange"] != exchange_upper
                    ):
                        continue
                    symbols_dict[stock_dict["symbol"]] = stock_dict
        return list(symbols_dict.values())

    def get_stocks_by_exchange(self, exchange: str) -> List[dict]:
        if Listing is None:
            raise DataFetchException("Listing not available")

        exchange_upper = exchange.upper()
        exchanges_to_fetch = ["HOSE", "HNX", "UPCOM"]
        if exchange_upper in exchanges_to_fetch:
            exchanges_to_fetch = [exchange_upper]
        elif exchange_upper != "ALL":
            raise DataFetchException(
                f"Invalid exchange: {exchange}. Supported: HOSE, HNX, UPCOM, ALL"
            )

        # Try VCI first, fallback to KBS
        try:
            logger.info("Attempting to fetch symbols using VCI source...")
            return self._fetch_symbols_from_source(
                "VCI", exchanges_to_fetch, exchange_upper
            )
        except Exception as e:
            logger.warning(f"VCI source failed: {e}. Falling back to KBS source.")
            try:
                return self._fetch_symbols_from_source(
                    "KBS", exchanges_to_fetch, exchange_upper
                )
            except Exception as e_kbs:
                logger.error(
                    f"Error fetching symbols by exchange: {e_kbs}", exc_info=True
                )
                raise DataFetchException(str(e_kbs))

    def get_stock_details(self, exchange: str) -> List[dict]:
        if Listing is None:
            raise DataFetchException("Listing not available")

        exchange_upper = exchange.upper()
        valid_exchanges = ["HOSE", "HNX", "UPCOM", "DELISTED", "ALL"]
        if exchange_upper not in valid_exchanges:
            raise DataFetchException(
                f"Invalid exchange: {exchange}. Supported: HOSE, HNX, UPCOM, DELISTED, ALL"
            )

        df = None

        # 1. Try VCI Listing first
        try:
            logger.info("Fetching stock details using VCI Listing...")
            listing = Listing(source="VCI")
            df = listing.symbols_by_exchange(to_df=True)
        except Exception as e:
            logger.warning(f"VCI Listing failed: {e}. Trying direct HTTP fallback...")

        # 2. Try Direct HTTP request fallback to Vietcap if VCI Listing failed
        if df is None or df.empty:
            try:
                import requests

                url = "https://trading.vietcap.com.vn/api/price/symbols/getAll"
                headers = {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                }
                r = requests.get(url, headers=headers, timeout=15)
                if r.status_code == 200:
                    json_data = r.json()
                    df_raw = pd.DataFrame(json_data)
                    if not df_raw.empty:
                        # Map raw camelCase fields to match symbols_by_exchange columns
                        df = df_raw.rename(
                            columns={
                                "board": "exchange",
                                "enOrganName": "en_organ_name",
                                "enOrganShortName": "en_organ_short_name",
                                "organShortName": "organ_short_name",
                                "organName": "organ_name",
                                "productGrpID": "product_grp_id",
                                "icbCode2": "icb_code2",
                            }
                        )
                        logger.info(
                            "Successfully fetched stock details via direct HTTP fallback."
                        )
            except Exception as e_direct:
                logger.warning(
                    f"Direct HTTP fallback failed: {e_direct}. Trying KBS fallback..."
                )

        # 3. Try KBS Listing fallback as a last resort (active stocks only)
        if df is None or df.empty:
            try:
                logger.info("Attempting fallback to KBS Listing source...")
                listing = Listing(source="KBS")
                df_kbs = listing.symbols_by_exchange(get_all=True)
                if not df_kbs.empty:
                    df = df_kbs.rename(columns={"id": "sid"})
                    logger.info(
                        "Successfully loaded active stock symbols via KBS fallback."
                    )
            except Exception as e_kbs:
                logger.error(f"All fallback options failed: {e_kbs}", exc_info=True)
                raise DataFetchException(
                    "Failed to fetch symbols from all available sources."
                )

        # Process the dataframe
        results = []
        for _, row in df.iterrows():
            sym = row.get("symbol")
            if not sym:
                continue
            sym_str = str(sym).upper()

            row_exchange = self._normalize_exchange(
                row.get("exchange"), fallback_exchange=""
            )

            # Filter by exchange if not ALL
            if exchange_upper != "ALL" and row_exchange != exchange_upper:
                continue

            stock_type = row.get("type")
            if stock_type:
                stock_type = str(stock_type).lower()

            results.append(
                {
                    "symbol": sym_str,
                    "exchange": row_exchange,
                    "type": stock_type if pd.notna(stock_type) else None,
                    "sid": int(row.get("sid")) if pd.notna(row.get("sid")) else None,
                    "organ_name": (
                        str(row.get("organ_name"))
                        if pd.notna(row.get("organ_name"))
                        else None
                    ),
                    "organ_short_name": (
                        str(row.get("organ_short_name"))
                        if pd.notna(row.get("organ_short_name"))
                        else None
                    ),
                    "en_organ_name": (
                        str(row.get("en_organ_name"))
                        if pd.notna(row.get("en_organ_name"))
                        else None
                    ),
                    "en_organ_short_name": (
                        str(row.get("en_organ_short_name"))
                        if pd.notna(row.get("en_organ_short_name"))
                        else None
                    ),
                    "product_grp_id": (
                        str(row.get("product_grp_id"))
                        if pd.notna(row.get("product_grp_id"))
                        else None
                    ),
                    "icb_code2": (
                        str(row.get("icb_code2"))
                        if pd.notna(row.get("icb_code2"))
                        else None
                    ),
                }
            )
        return results

    def get_symbols_by_group(self, group: str) -> List[str]:
        group_upper = group.upper()
        grouped = self.get_grouped_symbols()
        return grouped.get(group_upper, [])

    def _fetch_grouped_symbols_from_api(self) -> dict:
        if Listing is None:
            raise DataFetchException("Listing not available")

        result = {
            "HOSE": [],
            "VN30": [],
            "HNX": [],
            "UPCOM": [],
            "CW": [],
            "ETF": [],
            "FU_INDEX": [],
            "FU_BOND": [],
            "INDEX": [],
        }

        # Step 1: Fetch general list via exchange API (1 call instead of 5 calls)
        all_symbols_df = None
        for source in ["KBS", "VCI"]:
            try:
                logger.info(f"Fetching exchange symbols from {source}...")
                listing = Listing(source=source)
                df = listing.symbols_by_exchange(exchange="HOSE", to_df=True)
                if df is not None and not df.empty:
                    all_symbols_df = df
                    logger.info(f"Successfully fetched {len(df)} symbols from {source}")
                    break
            except BaseException as e:
                logger.warning(f"Failed to fetch exchange symbols from {source}: {e}")
                time.sleep(1)

        if all_symbols_df is not None:
            # HOSE
            hose_mask = all_symbols_df["exchange"].isin(["HOSE", "HSX"])
            result["HOSE"] = all_symbols_df[hose_mask]["symbol"].dropna().tolist()

            # HNX
            hnx_mask = all_symbols_df["exchange"] == "HNX"
            result["HNX"] = all_symbols_df[hnx_mask]["symbol"].dropna().tolist()

            # UPCOM
            upcom_mask = all_symbols_df["exchange"] == "UPCOM"
            result["UPCOM"] = all_symbols_df[upcom_mask]["symbol"].dropna().tolist()

            # CW
            cw_mask = all_symbols_df["type"].isin(["cw", "warrant"])
            result["CW"] = all_symbols_df[cw_mask]["symbol"].dropna().tolist()

            # ETF
            etf_mask = all_symbols_df["type"].isin(["fund", "etf"])
            result["ETF"] = all_symbols_df[etf_mask]["symbol"].dropna().tolist()

        # Step 2: Fetch group index lists
        for group in ["VN30"]:
            group_symbols = []
            for source in ["KBS", "VCI"]:
                try:
                    logger.info(f"Fetching group {group} symbols from {source}...")
                    listing = Listing(source=source)
                    res = listing.symbols_by_group(group_name=group)
                    if res is not None:
                        if hasattr(res, "tolist"):
                            group_symbols = res.tolist()
                        elif isinstance(res, list):
                            group_symbols = res
                        else:
                            group_symbols = list(res)
                        logger.info(
                            f"Successfully fetched {len(group_symbols)} symbols for {group} from {source}"
                        )
                        break
                except BaseException as e:
                    logger.warning(f"Failed to fetch group {group} from {source}: {e}")
                    time.sleep(1)
            result[group] = group_symbols

        # Step 3: Fetch derivative & debt securities / indices
        result["FU_INDEX"] = self.get_futures()
        result["FU_BOND"] = self.get_government_bonds()
        result["INDEX"] = self.get_all_indices()

        return result

    def get_grouped_symbols(self) -> dict:
        # 1. Try to load from cache
        if os.path.exists(CACHE_FILE_PATH):
            try:
                with open(CACHE_FILE_PATH, "r", encoding="utf-8") as f:
                    cache_data = json.load(f)

                # Check if cache is still fresh
                if time.time() - cache_data.get("timestamp", 0) < CACHE_DURATION:
                    logger.info("Using fresh cached grouped symbols.")
                    return cache_data.get("data", {})
            except Exception as e:
                logger.warning(f"Failed to read cache file: {e}")

        # 2. Cache is missing or expired, fetch it
        logger.info("Cache missed or expired. Fetching fresh grouped symbols.")
        result = {}
        try:
            result = self._fetch_grouped_symbols_from_api()

            # If successful, save to cache
            if result and all(result.values()):
                try:
                    with open(CACHE_FILE_PATH, "w", encoding="utf-8") as f:
                        json.dump(
                            {"timestamp": time.time(), "data": result},
                            f,
                            ensure_ascii=False,
                            indent=2,
                        )
                    logger.info("Grouped symbols cache updated.")
                except Exception as e:
                    logger.warning(f"Failed to write cache file: {e}")
                return result
        except BaseException as e:
            logger.error(f"Critical error during API fetch of grouped symbols: {e}")
            # Do NOT propagate BaseException to prevent FastAPI server from crashing

        # 3. Fallback: if fetch failed, load stale cache if available
        if os.path.exists(CACHE_FILE_PATH):
            try:
                with open(CACHE_FILE_PATH, "r", encoding="utf-8") as f:
                    cache_data = json.load(f)
                logger.info(
                    "Using stale cached grouped symbols after API fetch failure."
                )
                return cache_data.get("data", {})
            except Exception as e:
                logger.warning(f"Failed to read stale cache file: {e}")

        return {
            "HOSE": [],
            "VN30": [],
            "HNX": [],
            "UPCOM": [],
            "CW": [],
            "ETF": [],
            "FU_INDEX": [],
            "FU_BOND": [],
            "INDEX": [],
        }

    def get_icb_industries(self) -> List[dict]:
        if Listing is None:
            raise DataFetchException("Listing not available")
        try:
            listing = Listing(source="VCI")
            df = listing.industries_icb()
            if df is None or df.empty:
                return []
            
            results = []
            for _, row in df.iterrows():
                results.append({
                    "icb_name": str(row.get("icb_name")) if pd.notna(row.get("icb_name")) else "",
                    "en_icb_name": str(row.get("en_icb_name")) if pd.notna(row.get("en_icb_name")) else None,
                    "icb_code": str(row.get("icb_code")) if pd.notna(row.get("icb_code")) else "",
                    "level": int(row.get("level")) if pd.notna(row.get("level")) else 0,
                })
            return results
        except Exception as e:
            logger.error(f"Error fetching ICB industries: {e}", exc_info=True)
            try:
                logger.info("Retrying fetch of ICB industries via KBS source...")
                listing = Listing(source="KBS")
                df = listing.industries_icb()
                if df is None or df.empty:
                    return []
                results = []
                for _, row in df.iterrows():
                    results.append({
                        "icb_name": str(row.get("icb_name")) if pd.notna(row.get("icb_name")) else "",
                        "en_icb_name": str(row.get("en_icb_name")) if pd.notna(row.get("en_icb_name")) else None,
                        "icb_code": str(row.get("icb_code")) if pd.notna(row.get("icb_code")) else "",
                        "level": int(row.get("level")) if pd.notna(row.get("level")) else 0,
                    })
                return results
            except Exception as e_kbs:
                logger.error(f"KBS fallback failed for ICB industries: {e_kbs}", exc_info=True)
                raise DataFetchException(str(e_kbs))

    def get_symbols_by_industries(self) -> List[dict]:
        if Listing is None:
            raise DataFetchException("Listing not available")
        try:
            listing = Listing(source="VCI")
            df = listing.symbols_by_industries()
            if df is None or df.empty:
                return []
            
            results = []
            for _, row in df.iterrows():
                results.append({
                    "symbol": str(row.get("symbol")).upper(),
                    "organ_name": str(row.get("organ_name")) if pd.notna(row.get("organ_name")) else None,
                    "com_type_code": str(row.get("com_type_code")) if pd.notna(row.get("com_type_code")) else None,
                    "icb_level": int(row.get("icb_level")) if pd.notna(row.get("icb_level")) else 0,
                    "icb_code": str(row.get("icb_code")) if pd.notna(row.get("icb_code")) else "",
                    "icb_name": str(row.get("icb_name")) if pd.notna(row.get("icb_name")) else "",
                })
            return results
        except Exception as e:
            logger.error(f"Error fetching symbols by industries: {e}", exc_info=True)
            try:
                logger.info("Retrying fetch of symbols by industries via KBS source...")
                listing = Listing(source="KBS")
                df = listing.symbols_by_industries()
                if df is None or df.empty:
                    return []
                results = []
                for _, row in df.iterrows():
                    results.append({
                        "symbol": str(row.get("symbol")).upper(),
                        "organ_name": str(row.get("organ_name")) if pd.notna(row.get("organ_name")) else None,
                        "com_type_code": str(row.get("com_type_code")) if pd.notna(row.get("com_type_code")) else None,
                        "icb_level": int(row.get("icb_level")) if pd.notna(row.get("icb_level")) else 0,
                        "icb_code": str(row.get("icb_code")) if pd.notna(row.get("icb_code")) else "",
                        "icb_name": str(row.get("icb_name")) if pd.notna(row.get("icb_name")) else "",
                    })
                return results
            except Exception as e_kbs:
                logger.error(f"KBS fallback failed for symbols by industries: {e_kbs}", exc_info=True)
                raise DataFetchException(str(e_kbs))

    def get_futures(self) -> List[str]:
        if Listing is None:
            return []
        for source in ["KBS", "VCI"]:
            try:
                listing = Listing(source=source)
                res = listing.all_future_indices()
                if res is not None:
                    if hasattr(res, "tolist"):
                        return res.tolist()
                    return list(res)
            except Exception as e:
                logger.warning(f"Failed to fetch futures from {source}: {e}")
        return ["VN30F1M", "VN30F2M", "VN30F2306", "VN30F2309"]

    def get_government_bonds(self) -> List[str]:
        if Listing is None:
            return []
        for source in ["VCI", "KBS"]:
            try:
                listing = Listing(source=source)
                res = listing.all_government_bonds()
                if res is not None:
                    if hasattr(res, "tolist"):
                        return res.tolist()
                    return list(res)
            except Exception as e:
                logger.warning(f"Failed to fetch government bonds from {source}: {e}")
        
        for source in ["KBS", "VCI"]:
            try:
                listing = Listing(source=source)
                if hasattr(listing, "all_bonds"):
                    res = listing.all_bonds()
                    if res is not None:
                        if hasattr(res, "tolist"):
                            return res.tolist()
                        return list(res)
            except Exception:
                pass
        return []

    def get_all_indices(self) -> List[str]:
        if Listing is None:
            return ["VNINDEX", "VN30", "HNXINDEX", "HNX30", "UPCOMINDEX"]
        for source in ["KBS", "VCI"]:
            try:
                listing = Listing(source=source)
                if hasattr(listing, "all_indices"):
                    res = getattr(listing, "all_indices")()
                    if res is not None:
                        if hasattr(res, "tolist"):
                            return res.tolist()
                        elif hasattr(res, "symbol"):
                            return res["symbol"].tolist()
                        return list(res)
            except Exception:
                pass
        return ["VNINDEX", "VN30", "HNXINDEX", "HNX30", "UPCOMINDEX"]


stock_service = StockService()


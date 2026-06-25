import logging
import os
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import pandas as pd

from .constants import FETCH_BUFFER, INDICES, PERIOD_MAPPING, VALID_PERIODS
from .exceptions import IndexNotFoundException, DataFetchException
from . import schemas
from .data_source import StockDataSource, FallbackDataSource
from .cache import Cache, FileCacheManager, RedisCacheManager
from .config import vn_stock_config

logger = logging.getLogger(__name__)

CACHE_FILE_PATH = os.path.join(os.path.dirname(__file__), "grouped_symbols_cache.json")
CACHE_DURATION = 43200  # 12 hours


class StockService:
    """Service for Vietnamese stock & index, adhering to SOLID principles."""

    def __init__(
        self,
        data_source: Optional[StockDataSource] = None,
        cache: Optional[Cache] = None,
    ):
        """Injectable dependencies for data fetching and caching (DIP)."""
        self.data_source = data_source or FallbackDataSource()
        self.cache = cache or RedisCacheManager(
            key="stockify:grouped_symbols",
            duration_seconds=CACHE_DURATION,
            host=vn_stock_config.redis_host,
            port=vn_stock_config.redis_port,
            password=vn_stock_config.redis_password,
        )

    def get_index_quote(self, index_code: str, period: str) -> schemas.MarketQuote:
        index_key = index_code.lower().replace("-", "")
        mapping = {
            "vnindex": "vn-index",
            "vn30": "vn30",
            "hnxindex": "hnx-index",
            "upcomindex": "upcom",
            "upcom": "upcom"
        }
        mapped_key = mapping.get(index_key, index_key)
        if mapped_key not in INDICES:
            raise IndexNotFoundException(index_code)
        return self._get_quote(INDICES[mapped_key]["code"], period)

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

    def _get_quote(self, symbol: str, period: str) -> Dict[str, Any]:
        if period not in VALID_PERIODS:
            raise DataFetchException(f"Invalid period: {period}")

        try:
            end_date = datetime.now()
            buffer_days = FETCH_BUFFER.get(period, 30)
            start_date = end_date - timedelta(days=buffer_days)

            df = self.data_source.fetch_history(
                symbol=symbol,
                start_date=start_date.strftime("%Y-%m-%d"),
                end_date=end_date.strftime("%Y-%m-%d"),
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
                change_percent = 0.0
            else:
                change = close_price - first_close_price
                change_percent = (change / first_close_price) * 100

            return {
                "symbol": symbol,
                "price": round(close_price, 2),
                "change_percent": round(change_percent, 2),
                "volume": int(latest.get("volume", 0)),
            }
        except SystemExit:
            raise DataFetchException("VNStock rate limit exceeded")
        except Exception as e:
            logger.error(f"Quote error {symbol}: {e}", exc_info=True)
            raise

    def get_index_historical(
        self, index_code: str, period: str
    ) -> schemas.MarketHistoricalResponse:
        index_key = index_code.lower().replace("-", "")
        mapping = {
            "vnindex": "vn-index",
            "vn30": "vn30",
            "hnxindex": "hnx-index",
            "upcomindex": "upcom",
            "upcom": "upcom"
        }
        mapped_key = mapping.get(index_key, index_key)
        if mapped_key not in INDICES:
            raise IndexNotFoundException(index_code)

        return self._get_historical(
            INDICES[mapped_key]["code"], period, schemas.MarketType.INDEX
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
        if period not in VALID_PERIODS:
            raise DataFetchException(f"Invalid period: {period}")

        try:
            days = PERIOD_MAPPING[period]
            end_date = datetime.now()
            start_date = end_date - timedelta(days=days)

            df = self.data_source.fetch_history(
                symbol=symbol,
                start_date=start_date.strftime("%Y-%m-%d"),
                end_date=end_date.strftime("%Y-%m-%d"),
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
        try:
            df = self.data_source.fetch_all_symbols()
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

    def _parse_row_to_stock_dict(
        self, row: pd.Series, default_exchange: str
    ) -> Optional[dict]:
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

    def get_stocks_by_exchange(self, exchange: str) -> List[dict]:
        exchange_upper = exchange.upper()
        exchanges_to_fetch = ["HOSE", "HNX", "UPCOM"]
        if exchange_upper in exchanges_to_fetch:
            exchanges_to_fetch = [exchange_upper]
        elif exchange_upper != "ALL":
            raise DataFetchException(
                f"Invalid exchange: {exchange}. Supported: HOSE, HNX, UPCOM, ALL"
            )

        try:
            results_dict = {}
            for ex in exchanges_to_fetch:
                df = self.data_source.fetch_symbols_by_exchange(ex)
                if df is None or df.empty:
                    continue
                for _, row in df.iterrows():
                    stock_dict = self._parse_row_to_stock_dict(row, ex)
                    if stock_dict:
                        # If filtering specifically by exchange and it mapped elsewhere, skip
                        if (
                            exchange_upper != "ALL"
                            and stock_dict["exchange"] != exchange_upper
                        ):
                            continue
                        results_dict[stock_dict["symbol"]] = stock_dict
            return list(results_dict.values())
        except Exception as e:
            logger.error(f"Error fetching stocks by exchange: {e}", exc_info=True)
            raise DataFetchException(str(e))

    def get_stock_details(self, exchange: str) -> List[dict]:
        exchange_upper = exchange.upper()
        valid_exchanges = ["HOSE", "HNX", "UPCOM", "DELISTED", "ALL"]
        if exchange_upper not in valid_exchanges:
            raise DataFetchException(
                f"Invalid exchange: {exchange}. Supported: HOSE, HNX, UPCOM, DELISTED, ALL"
            )

        try:
            # For details, fetching all symbols is robust and handles camelCase rename internally if HTTP source
            df = self.data_source.fetch_all_symbols()
            if df.empty:
                raise DataFetchException(
                    "Failed to fetch symbols from all available sources."
                )

            results = []
            for _, row in df.iterrows():
                sym = row.get("symbol")
                if not sym:
                    continue
                sym_str = str(sym).upper()

                row_exchange = self._normalize_exchange(
                    row.get("exchange"), fallback_exchange=""
                )

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
                        "sid": (
                            int(row.get("sid")) if pd.notna(row.get("sid")) else None
                        ),
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
        except Exception as e:
            logger.error(f"Error fetching stock details: {e}", exc_info=True)
            raise DataFetchException(str(e))

    def get_symbols_by_group(self, group: str) -> List[str]:
        group_upper = group.upper()
        grouped = self.get_grouped_symbols()
        return grouped.get(group_upper, [])

    def _fetch_grouped_symbols_from_api(self) -> dict:
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
            "VN100": [],
            "VNMID": [],
            "VNSML": [],
            "VNSI": [],
            "VNX50": [],
            "VNXALL": [],
            "VNALL": [],
            "HNX30": [],
        }

        try:
            # HOSE, HNX, UPCOM and CW/ETF details via single all_symbols call
            df = self.data_source.fetch_all_symbols()
            if not df.empty:
                # HOSE
                hose_mask = df["exchange"].isin(["HOSE", "HSX"])
                result["HOSE"] = df[hose_mask]["symbol"].dropna().tolist()

                # HNX
                hnx_mask = df["exchange"] == "HNX"
                result["HNX"] = df[hnx_mask]["symbol"].dropna().tolist()

                # UPCOM
                upcom_mask = df["exchange"] == "UPCOM"
                result["UPCOM"] = df[upcom_mask]["symbol"].dropna().tolist()

                # CW
                cw_mask = df["type"].isin(["cw", "warrant"])
                result["CW"] = df[cw_mask]["symbol"].dropna().tolist()

                # ETF
                etf_mask = df["type"].isin(["fund", "etf"])
                result["ETF"] = df[etf_mask]["symbol"].dropna().tolist()
        except Exception as e:
            logger.warning(f"Failed to extract exchanges from all symbols: {e}")

        # Fetch index group lists
        index_groups = ["VN30", "VN100", "VNMID", "VNSML", "VNSI", "VNX50", "VNXALL", "VNALL", "HNX30"]
        for idx in index_groups:
            try:
                mapped_idx = idx
                if idx == "VNMID":
                    mapped_idx = "VNMidCap"
                elif idx == "VNSML":
                    mapped_idx = "VNSmallCap"
                
                res = self.data_source.fetch_symbols_by_group(mapped_idx)
                result[idx] = res if res else []
            except Exception as e:
                logger.warning(f"Failed to fetch {idx}: {e}")

        # Fetch derivatives, government bonds, indices
        result["FU_INDEX"] = self.get_futures()
        result["FU_BOND"] = self.get_government_bonds()
        result["INDEX"] = self.get_all_indices()

        return result

    def get_grouped_symbols(self, background_tasks = None) -> dict:
        # 1. Try to load from cache
        cached = self.cache.get()
        if cached is not None:
            return cached

        # 2. Cache expired (or missing), but let's check if we have a stale cache
        stale = self.cache.get_stale()
        if stale is not None:
            logger.info("Cache expired for grouped symbols. Returning stale cache and revalidating in background.")
            if background_tasks is not None:
                background_tasks.add_task(self._revalidate_grouped_symbols_cache)
            else:
                import threading
                threading.Thread(target=self._revalidate_grouped_symbols_cache).start()
            return stale

        # 3. If there is no cache at all (completely fresh install), fetch synchronously
        logger.info("Cache missed (no stale cache). Fetching fresh grouped symbols synchronously.")
        try:
            result = self._fetch_grouped_symbols_from_api()
            if result and any(result.values()):
                self.cache.set(result)
                return result
        except BaseException as e:
            logger.error(f"Critical error during API fetch of grouped symbols: {e}")

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
            "VN100": [],
            "VNMID": [],
            "VNSML": [],
            "VNSI": [],
            "VNX50": [],
            "VNXALL": [],
            "VNALL": [],
            "HNX30": [],
        }

    def _revalidate_grouped_symbols_cache(self) -> None:
        try:
            logger.info("Background revalidation of grouped symbols started.")
            result = self._fetch_grouped_symbols_from_api()
            if result and any(result.values()):
                self.cache.set(result)
                logger.info("Background revalidation of grouped symbols completed successfully.")
        except Exception as e:
            logger.error(f"Error during background revalidation of grouped symbols: {e}")

    def get_icb_industries(self) -> List[dict]:
        try:
            df = self.data_source.fetch_industries_icb()
            if df is None or df.empty:
                return []

            results = []
            for _, row in df.iterrows():
                results.append(
                    {
                        "icb_name": (
                            str(row.get("icb_name"))
                            if pd.notna(row.get("icb_name"))
                            else ""
                        ),
                        "en_icb_name": (
                            str(row.get("en_icb_name"))
                            if pd.notna(row.get("en_icb_name"))
                            else None
                        ),
                        "icb_code": (
                            str(row.get("icb_code"))
                            if pd.notna(row.get("icb_code"))
                            else ""
                        ),
                        "level": (
                            int(row.get("level")) if pd.notna(row.get("level")) else 0
                        ),
                    }
                )
            return results
        except Exception as e:
            logger.error(f"Error fetching ICB industries: {e}", exc_info=True)
            raise DataFetchException(str(e))

    def get_symbols_by_industries(self) -> List[dict]:
        try:
            df = self.data_source.fetch_symbols_by_industries()
            if df is None or df.empty:
                return []

            results = []
            for _, row in df.iterrows():
                results.append(
                    {
                        "symbol": str(row.get("symbol")).upper(),
                        "organ_name": (
                            str(row.get("organ_name"))
                            if pd.notna(row.get("organ_name"))
                            else None
                        ),
                        "com_type_code": (
                            str(row.get("com_type_code"))
                            if pd.notna(row.get("com_type_code"))
                            else None
                        ),
                        "icb_level": (
                            int(row.get("icb_level"))
                            if pd.notna(row.get("icb_level"))
                            else 0
                        ),
                        "icb_code": (
                            str(row.get("icb_code"))
                            if pd.notna(row.get("icb_code"))
                            else ""
                        ),
                        "icb_name": (
                            str(row.get("icb_name"))
                            if pd.notna(row.get("icb_name"))
                            else ""
                        ),
                    }
                )
            return results
        except Exception as e:
            logger.error(f"Error fetching symbols by industries: {e}", exc_info=True)
            raise DataFetchException(str(e))

    def get_futures(self) -> List[str]:
        try:
            return self.data_source.fetch_all_future_indices()
        except Exception as e:
            logger.warning(f"Failed to fetch futures: {e}")
            return ["VN30F1M", "VN30F2M", "VN30F2306", "VN30F2309"]

    def get_government_bonds(self) -> List[str]:
        try:
            return self.data_source.fetch_all_government_bonds()
        except Exception as e:
            logger.warning(f"Failed to fetch government bonds: {e}")
            return []

    def get_all_indices(self) -> List[str]:
        try:
            return self.data_source.fetch_all_indices()
        except Exception as e:
            logger.warning(f"Failed to fetch all indices: {e}")
            return ["VNINDEX", "VN30", "HNXINDEX", "HNX30", "UPCOMINDEX"]


stock_service = StockService()

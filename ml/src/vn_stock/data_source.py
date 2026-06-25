from abc import ABC, abstractmethod
import logging
from typing import List, Dict, Any, Optional
import pandas as pd
import requests
import time

logger = logging.getLogger(__name__)


class StockDataSource(ABC):
    """Abstract interface defining the contract for stock data providers."""

    @abstractmethod
    def fetch_history(
        self, symbol: str, start_date: str, end_date: str
    ) -> pd.DataFrame:
        """Fetch historical daily OHLCV data for a given symbol."""
        pass

    @abstractmethod
    def fetch_symbols_by_exchange(self, exchange: str) -> pd.DataFrame:
        """Fetch symbols filtering by exchange name (e.g., HOSE, HNX, UPCOM)."""
        pass

    @abstractmethod
    def fetch_all_symbols(self) -> pd.DataFrame:
        """Fetch list of all stock symbols."""
        pass

    @abstractmethod
    def fetch_symbols_by_group(self, group_name: str) -> List[str]:
        """Fetch symbols belonging to a specific index group (e.g. VN30)."""
        pass

    @abstractmethod
    def fetch_industries_icb(self) -> pd.DataFrame:
        """Fetch list of ICB industries."""
        pass

    @abstractmethod
    def fetch_symbols_by_industries(self) -> pd.DataFrame:
        """Fetch mapping of symbols to industries."""
        pass

    @abstractmethod
    def fetch_all_future_indices(self) -> List[str]:
        """Fetch list of future/derivative symbols."""
        pass

    @abstractmethod
    def fetch_all_government_bonds(self) -> List[str]:
        """Fetch list of government bond symbols."""
        pass

    @abstractmethod
    def fetch_all_indices(self) -> List[str]:
        """Fetch list of market index codes."""
        pass


class VnstockDataSource(StockDataSource):
    """Concrete implementation of StockDataSource using the vnstock3 library."""

    def __init__(self, source: str = "VCI"):
        self.source = source
        try:
            from vnstock import Quote, Listing

            self._Quote = Quote
            self._Listing = Listing
        except ImportError:
            self._Quote = None
            self._Listing = None

    def _ensure_library(self):
        if self._Quote is None or self._Listing is None:
            raise ImportError("vnstock library is not installed or available.")

    def _execute_with_retry(self, func, action_name: str, *args, **kwargs):
        from .config import vn_stock_config
        retries = vn_stock_config.vnstock_retry_count
        delay = 1.0  # seconds

        for attempt in range(retries):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                if attempt == retries - 1:
                    logger.error(
                        f"All {retries} attempts failed for {action_name} (source: {self.source}): {e}"
                    )
                    raise
                logger.warning(
                    f"Attempt {attempt + 1}/{retries} failed for {action_name} (source: {self.source}): {e}. Retrying in {delay}s..."
                )
                time.sleep(delay)
                delay *= 2.0  # exponential backoff

    def _create_listing(self):
        listing = self._Listing(source=self.source)
        if hasattr(listing, "provider") and hasattr(listing.provider, "base_url"):
            if listing.provider.base_url and listing.provider.base_url.endswith("/"):
                listing.provider.base_url = listing.provider.base_url.rstrip("/")
        return listing

    def _create_quote(self, symbol: str):
        # Keep trailing slash for Quote endpoints as VCI constructs quote endpoints without a leading slash
        return self._Quote(symbol=symbol, source=self.source)

    def fetch_history(
        self, symbol: str, start_date: str, end_date: str
    ) -> pd.DataFrame:
        self._ensure_library()
        def _run():
            quote = self._create_quote(symbol)
            return quote.history(start=start_date, end=end_date, interval="1D")
        return self._execute_with_retry(_run, f"fetch_history for {symbol}")

    def fetch_symbols_by_exchange(self, exchange: str) -> pd.DataFrame:
        self._ensure_library()
        def _run():
            listing = self._create_listing()
            return listing.symbols_by_exchange(exchange=exchange, to_df=True)
        return self._execute_with_retry(_run, f"fetch_symbols_by_exchange for {exchange}")

    def fetch_all_symbols(self) -> pd.DataFrame:
        self._ensure_library()
        def _run():
            listing = self._create_listing()
            return listing.symbols_by_exchange()
        return self._execute_with_retry(_run, "fetch_all_symbols")

    def fetch_symbols_by_group(self, group_name: str) -> List[str]:
        self._ensure_library()
        
        # Explicit list of supported groups to fail fast and avoid slow retries on unsupported groups
        supported_groups = {
            "VCI": {'HOSE', 'VN30', 'VNMidCap', 'VNSmallCap', 'VNAllShare', 'VN100', 'ETF', 'HNX', 'HNX30', 'HNXCon', 'HNXFin', 'HNXLCap', 'HNXMSCap', 'HNXMan', 'UPCOM', 'FU_INDEX', 'FU_BOND', 'BOND', 'CW'},
            "KBS": {'HOSE', 'HNX', 'UPCOM', 'VN30', 'VN100', 'VNMidCap', 'VNSmallCap', 'VNSI', 'VNX50', 'VNXALL', 'VNALL', 'HNX30', 'ETF', 'CW', 'BOND', 'FU_INDEX'}
        }
        
        source_upper = self.source.upper()
        if source_upper in supported_groups:
            mapped_idx = group_name
            if group_name == "VNMID":
                mapped_idx = "VNMidCap"
            elif group_name == "VNSML":
                mapped_idx = "VNSmallCap"
            if mapped_idx not in supported_groups[source_upper]:
                raise ValueError(f"Group {group_name} not supported by source {self.source}")

        listing = self._create_listing()
        def _run():
            res = listing.symbols_by_group(group=group_name)
            if res is not None:
                if hasattr(res, "tolist"):
                    return res.tolist()
                return list(res)
            return []
        return self._execute_with_retry(_run, f"fetch_symbols_by_group for {group_name}")

    def fetch_industries_icb(self) -> pd.DataFrame:
        self._ensure_library()
        def _run():
            listing = self._create_listing()
            return listing.industries_icb()
        return self._execute_with_retry(_run, "fetch_industries_icb")

    def fetch_symbols_by_industries(self) -> pd.DataFrame:
        self._ensure_library()
        def _run():
            listing = self._create_listing()
            return listing.symbols_by_industries()
        return self._execute_with_retry(_run, "fetch_symbols_by_industries")

    def fetch_all_future_indices(self) -> List[str]:
        self._ensure_library()
        def _run():
            listing = self._create_listing()
            res = listing.all_future_indices()
            if res is not None:
                if hasattr(res, "tolist"):
                    return res.tolist()
                return list(res)
            return []
        return self._execute_with_retry(_run, "fetch_all_future_indices")

    def fetch_all_government_bonds(self) -> List[str]:
        self._ensure_library()
        def _run():
            listing = self._create_listing()
            if hasattr(listing, "all_government_bonds"):
                res = listing.all_government_bonds()
                if res is not None:
                    if hasattr(res, "tolist"):
                        return res.tolist()
                    return list(res)
            if hasattr(listing, "all_bonds"):
                res = listing.all_bonds()
                if res is not None:
                    if hasattr(res, "tolist"):
                        return res.tolist()
                    return list(res)
            return []
        return self._execute_with_retry(_run, "fetch_all_government_bonds")

    def fetch_all_indices(self) -> List[str]:
        self._ensure_library()
        def _run():
            listing = self._create_listing()
            if hasattr(listing, "all_indices"):
                res = getattr(listing, "all_indices")()
                if res is not None:
                    if hasattr(res, "tolist"):
                        return res.tolist()
                    elif hasattr(res, "symbol"):
                        return res["symbol"].tolist()
                    return list(res)
            return []
        return self._execute_with_retry(_run, "fetch_all_indices")


class DirectHttpDataSource(StockDataSource):
    """Concrete implementation of StockDataSource bypassing vnstock using raw HTTP calls (fallback option)."""

    def __init__(self, timeout: int = 15):
        self.timeout = timeout
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }

    def fetch_history(
        self, symbol: str, start_date: str, end_date: str
    ) -> pd.DataFrame:
        raise NotImplementedError("Direct HTTP history fetch not implemented yet.")

    def fetch_symbols_by_exchange(self, exchange: str) -> pd.DataFrame:
        # Fallback to fetching all and filtering
        df = self.fetch_all_symbols()
        if df.empty:
            return df
        # Normalize and filter
        df_filtered = df[df["exchange"].str.upper() == exchange.upper()]
        return df_filtered

    def fetch_all_symbols(self) -> pd.DataFrame:
        try:
            url = "https://trading.vietcap.com.vn/api/price/symbols/getAll"
            logger.info("Fetching stock symbols directly via Vietcap HTTP API...")
            r = requests.get(url, headers=self.headers, timeout=self.timeout)
            if r.status_code == 200:
                json_data = r.json()
                df_raw = pd.DataFrame(json_data)
                if not df_raw.empty:
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
                    return df
            return pd.DataFrame()
        except Exception as e:
            logger.warning(f"Direct HTTP fetch failed: {e}")
            return pd.DataFrame()

    def fetch_symbols_by_group(self, group_name: str) -> List[str]:
        return []

    def fetch_industries_icb(self) -> pd.DataFrame:
        return pd.DataFrame()

    def fetch_symbols_by_industries(self) -> pd.DataFrame:
        return pd.DataFrame()

    def fetch_all_future_indices(self) -> List[str]:
        return []

    def fetch_all_government_bonds(self) -> List[str]:
        return []

    def fetch_all_indices(self) -> List[str]:
        return []


_history_cache = {}


class FallbackDataSource(StockDataSource):
    """Orchestrates VCI and KBS Vnstock data sources and direct HTTP call fallback, complying with OCP."""

    def __init__(self, primary_source: str = "VCI", secondary_source: str = "KBS"):
        self.primary = VnstockDataSource(source=primary_source)
        self.secondary = VnstockDataSource(source=secondary_source)
        self.http_fallback = DirectHttpDataSource()

    def fetch_history(
        self, symbol: str, start_date: str, end_date: str
    ) -> pd.DataFrame:
        cache_key = f"{symbol}:{start_date}:{end_date}"
        now = time.time()
        
        # Check cache duration (default 5 minutes)
        try:
            from .config import vn_stock_config
            cache_duration = vn_stock_config.cache_expiration_minutes * 60
        except Exception:
            cache_duration = 300

        if cache_key in _history_cache:
            ts, df = _history_cache[cache_key]
            if now - ts < cache_duration:
                logger.info(f"Memory cache hit for fetch_history: {cache_key}")
                return df

        try:
            df = self.primary.fetch_history(symbol, start_date, end_date)
        except Exception as e:
            logger.warning(
                f"Primary fetch_history failed for {symbol}: {e}. Trying secondary source."
            )
            try:
                df = self.secondary.fetch_history(symbol, start_date, end_date)
            except Exception as e2:
                logger.error(
                    f"Both primary and secondary fetch_history failed for {symbol}: {e2}"
                )
                raise

        if df is not None and not df.empty:
            _history_cache[cache_key] = (now, df)
        return df

    def fetch_symbols_by_exchange(self, exchange: str) -> pd.DataFrame:
        try:
            return self.primary.fetch_symbols_by_exchange(exchange)
        except Exception as e:
            logger.warning(
                f"Primary fetch_symbols_by_exchange failed: {e}. Trying secondary source."
            )
            try:
                return self.secondary.fetch_symbols_by_exchange(exchange)
            except Exception as e2:
                logger.warning(
                    f"Secondary fetch_symbols_by_exchange failed: {e2}. Trying HTTP fallback."
                )
                try:
                    return self.http_fallback.fetch_symbols_by_exchange(exchange)
                except Exception as e3:
                    logger.error(
                        f"All data sources failed for fetch_symbols_by_exchange: {e3}"
                    )
                    raise

    def fetch_all_symbols(self) -> pd.DataFrame:
        try:
            return self.primary.fetch_all_symbols()
        except Exception as e:
            logger.warning(
                f"Primary fetch_all_symbols failed: {e}. Trying secondary source."
            )
            try:
                return self.secondary.fetch_all_symbols()
            except Exception as e2:
                logger.warning(
                    f"Secondary fetch_all_symbols failed: {e2}. Trying HTTP fallback."
                )
                try:
                    return self.http_fallback.fetch_all_symbols()
                except Exception as e3:
                    logger.error(f"All data sources failed for fetch_all_symbols: {e3}")
                    raise

    def fetch_symbols_by_group(self, group_name: str) -> List[str]:
        try:
            return self.primary.fetch_symbols_by_group(group_name)
        except Exception as e:
            logger.warning(
                f"Primary fetch_symbols_by_group failed: {e}. Trying secondary source."
            )
            try:
                return self.secondary.fetch_symbols_by_group(group_name)
            except Exception as e2:
                logger.error(
                    f"All data sources failed for fetch_symbols_by_group ({group_name}): {e2}"
                )
                return []

    def fetch_industries_icb(self) -> pd.DataFrame:
        try:
            return self.primary.fetch_industries_icb()
        except Exception as e:
            logger.warning(
                f"Primary fetch_industries_icb failed: {e}. Trying secondary source."
            )
            try:
                return self.secondary.fetch_industries_icb()
            except Exception as e2:
                logger.error(f"All data sources failed for fetch_industries_icb: {e2}")
                raise

    def fetch_symbols_by_industries(self) -> pd.DataFrame:
        try:
            return self.primary.fetch_symbols_by_industries()
        except Exception as e:
            logger.warning(
                f"Primary fetch_symbols_by_industries failed: {e}. Trying secondary source."
            )
            try:
                return self.secondary.fetch_symbols_by_industries()
            except Exception as e2:
                logger.error(
                    f"All data sources failed for fetch_symbols_by_industries: {e2}"
                )
                raise

    def fetch_all_future_indices(self) -> List[str]:
        try:
            return self.primary.fetch_all_future_indices()
        except Exception as e:
            logger.warning(
                f"Primary fetch_all_future_indices failed: {e}. Trying secondary source."
            )
            try:
                return self.secondary.fetch_all_future_indices()
            except Exception as e2:
                logger.warning(
                    f"All data sources failed for fetch_all_future_indices. Falling back to default list."
                )
                return ["VN30F1M", "VN30F2M", "VN30F2306", "VN30F2309"]

    def fetch_all_government_bonds(self) -> List[str]:
        try:
            return self.primary.fetch_all_government_bonds()
        except Exception as e:
            logger.warning(
                f"Primary fetch_all_government_bonds failed: {e}. Trying secondary source."
            )
            try:
                return self.secondary.fetch_all_government_bonds()
            except Exception as e2:
                logger.warning(
                    f"All data sources failed for fetch_all_government_bonds."
                )
                return []

    def fetch_all_indices(self) -> List[str]:
        try:
            return self.primary.fetch_all_indices()
        except Exception as e:
            logger.warning(
                f"Primary fetch_all_indices failed: {e}. Trying secondary source."
            )
            try:
                return self.secondary.fetch_all_indices()
            except Exception as e2:
                logger.warning(
                    f"All data sources failed for fetch_all_indices. Returning default indices list."
                )
                return ["VNINDEX", "VN30", "HNXINDEX", "HNX30", "UPCOMINDEX"]

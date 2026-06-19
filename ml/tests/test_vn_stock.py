import os
import time
import pytest
import pandas as pd
from unittest.mock import MagicMock

from src.vn_stock.cache import FileCacheManager
from src.vn_stock.data_source import StockDataSource
from src.vn_stock.service import StockService
from src.vn_stock.exceptions import DataFetchException


def test_file_cache_manager(tmp_path):
    cache_file = tmp_path / "test_cache.json"
    cache = FileCacheManager(str(cache_file), duration_seconds=2)

    # Cache should be empty initially
    assert cache.get() is None
    assert cache.get_stale() is None

    # Set cache data
    data = {"symbols": ["VCB", "FPT"]}
    cache.set(data)

    # Cache should be retrieveable and fresh
    assert cache.get() == data
    assert cache.get_stale() == data

    # Wait for expiration
    time.sleep(2.1)
    assert cache.get() is None  # expired
    assert cache.get_stale() == data  # still readable as stale


class DummyDataSource(StockDataSource):
    def fetch_history(self, symbol: str, start_date: str, end_date: str) -> pd.DataFrame:
        # Return mock daily data
        dates = pd.date_range(start="2026-06-01", end="2026-06-10")
        df = pd.DataFrame({
            "time": dates,
            "open": [10.0] * len(dates),
            "high": [11.0] * len(dates),
            "low": [9.0] * len(dates),
            "close": [10.5] * len(dates),
            "volume": [1000] * len(dates),
        })
        return df

    def fetch_symbols_by_exchange(self, exchange: str) -> pd.DataFrame:
        return pd.DataFrame([
            {"symbol": "VCB", "exchange": "HOSE", "organ_name": "Vietcombank", "type": "stock"}
        ])

    def fetch_all_symbols(self) -> pd.DataFrame:
        return pd.DataFrame([
            {"symbol": "VCB", "exchange": "HOSE", "organ_name": "Vietcombank", "type": "stock"},
            {"symbol": "FPT", "exchange": "HOSE", "organ_name": "FPT Group", "type": "stock"}
        ])

    def fetch_symbols_by_group(self, group_name: str) -> list:
        return ["VCB"]

    def fetch_industries_icb(self) -> pd.DataFrame:
        return pd.DataFrame()

    def fetch_symbols_by_industries(self) -> pd.DataFrame:
        return pd.DataFrame()

    def fetch_all_future_indices(self) -> list:
        return ["VN30F1M"]

    def fetch_all_government_bonds(self) -> list:
        return []

    def fetch_all_indices(self) -> list:
        return ["VNINDEX"]


def test_stock_service_quote():
    data_source = DummyDataSource()
    service = StockService(data_source=data_source)

    quote = service.get_stock_quote("VCB", "1mo")
    assert quote["symbol"] == "VCB"
    assert quote["price"] == 10.5
    assert quote["volume"] == 1000


def test_stock_service_stocks_list():
    data_source = DummyDataSource()
    service = StockService(data_source=data_source)

    stocks_response = service.get_stocks()
    assert len(stocks_response.items) == 2
    assert stocks_response.items[0].symbol == "VCB"
    assert stocks_response.items[1].symbol == "FPT"

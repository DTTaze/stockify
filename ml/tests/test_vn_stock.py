import os
import time
import pytest
import pandas as pd
from unittest.mock import MagicMock

from src.vn_stock.cache import FileCacheManager
from src.vn_stock.data_source import StockDataSource
from src.vn_stock.service import StockService
from src.vn_stock.exceptions import DataFetchException


@pytest.fixture
def cache_file_setup(tmp_path):
    return tmp_path / "test_cache.json"


def test_file_cache_manager_get_is_initially_none(cache_file_setup):
    cache = FileCacheManager(str(cache_file_setup), duration_seconds=2)
    assert cache.get() is None


def test_file_cache_manager_get_stale_is_initially_none(cache_file_setup):
    cache = FileCacheManager(str(cache_file_setup), duration_seconds=2)
    assert cache.get_stale() is None


def test_file_cache_manager_get_returns_stored_data(cache_file_setup):
    cache = FileCacheManager(str(cache_file_setup), duration_seconds=2)
    data = {"symbols": ["VCB", "FPT"]}
    cache.set(data)
    assert cache.get() == data


def test_file_cache_manager_get_stale_returns_stored_data(cache_file_setup):
    cache = FileCacheManager(str(cache_file_setup), duration_seconds=2)
    data = {"symbols": ["VCB", "FPT"]}
    cache.set(data)
    assert cache.get_stale() == data


def test_file_cache_manager_get_returns_none_after_expiration(cache_file_setup):
    cache = FileCacheManager(str(cache_file_setup), duration_seconds=1)
    data = {"symbols": ["VCB", "FPT"]}
    cache.set(data)
    time.sleep(1.1)
    assert cache.get() is None


def test_file_cache_manager_get_stale_returns_data_after_expiration(cache_file_setup):
    cache = FileCacheManager(str(cache_file_setup), duration_seconds=1)
    data = {"symbols": ["VCB", "FPT"]}
    cache.set(data)
    time.sleep(1.1)
    assert cache.get_stale() == data


class DummyDataSource(StockDataSource):
    def fetch_history(self, symbol: str, start_date: str, end_date: str) -> pd.DataFrame:
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


@pytest.fixture
def stock_service_setup():
    data_source = DummyDataSource()
    return StockService(data_source=data_source)


def test_stock_service_quote_symbol(stock_service_setup):
    quote = stock_service_setup.get_stock_quote("VCB", "1mo")
    assert quote["symbol"] == "VCB"


def test_stock_service_quote_price(stock_service_setup):
    quote = stock_service_setup.get_stock_quote("VCB", "1mo")
    assert quote["price"] == 10.5


def test_stock_service_quote_volume(stock_service_setup):
    quote = stock_service_setup.get_stock_quote("VCB", "1mo")
    assert quote["volume"] == 1000


def test_stock_service_stocks_list_length(stock_service_setup):
    stocks_response = stock_service_setup.get_stocks()
    assert len(stocks_response.items) == 2


def test_stock_service_stocks_list_first_symbol(stock_service_setup):
    stocks_response = stock_service_setup.get_stocks()
    assert stocks_response.items[0].symbol == "VCB"


def test_stock_service_stocks_list_second_symbol(stock_service_setup):
    stocks_response = stock_service_setup.get_stocks()
    assert stocks_response.items[1].symbol == "FPT"

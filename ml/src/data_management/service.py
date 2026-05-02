import numpy as np
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional

from ..data.preprocessing import (
    load_data,
    load_multi_stock_data,
    process_single_stock,
    save_processed_data,
)
from ..models.predict import get_supported_symbols
from ..vn_stock.exceptions import DataFetchException
from ..utils.paths import PROCESSED_DATA_DIR, RAW_DATA_DIR


class DataManagementService:
    """Service to manage ML processed stock data"""

    def get_supported_symbols(self) -> List[str]:
        return get_supported_symbols()

    def get_stock_items(self) -> List[Dict[str, Optional[str]]]:
        symbols = self.get_supported_symbols()
        stocks = []

        for symbol in symbols:
            total_records = self._get_total_records(symbol)
            last_updated = self._get_last_updated(symbol)
            status = self._get_status(last_updated)

            stocks.append(
                {
                    "symbol": symbol,
                    "last_updated": last_updated.isoformat() if last_updated else None,
                    "total_records": total_records,
                    "status": status,
                }
            )

        return stocks

    def get_summary(self) -> Dict[str, int]:
        stocks = self.get_stock_items()
        total_stocks = len(stocks)
        updated = len([stock for stock in stocks if stock["status"] == "updated"])
        needs_update = len(stocks) - updated
        total_records = sum(stock["total_records"] for stock in stocks)

        return {
            "total_stocks": total_stocks,
            "updated": updated,
            "needs_update": needs_update,
            "total_records": total_records,
        }

    def update_stock(self, symbol: str) -> Dict[str, Optional[str]]:
        normalized = symbol.upper()
        df = self._load_symbol_data(normalized)
        data_splits, scalers = process_single_stock(normalized, df)
        save_processed_data(normalized, data_splits, scalers)

        last_updated = self._get_last_updated(normalized)

        return {
            "symbol": normalized,
            "updated": True,
            "message": f"Data for {normalized} has been updated.",
            "last_updated": last_updated.isoformat() if last_updated else None,
        }

    def update_all(self) -> Dict[str, object]:
        symbols = self.get_supported_symbols()
        updated_symbols: List[str] = []

        for symbol in symbols:
            try:
                self.update_stock(symbol)
                updated_symbols.append(symbol)
            except Exception:
                continue

        return {
            "updated_count": len(updated_symbols),
            "updated_symbols": updated_symbols,
            "message": f"Updated {len(updated_symbols)} symbols.",
        }

    def _get_total_records(self, symbol: str) -> int:
        symbol_dir = PROCESSED_DATA_DIR / symbol
        x_train_path = symbol_dir / "X_train.npy"
        if not x_train_path.exists():
            return 0

        try:
            x_train = np.load(symbol_dir / "X_train.npy")
            x_val = np.load(symbol_dir / "X_val.npy")
            x_test = np.load(symbol_dir / "X_test.npy")
            time_step = x_train.shape[1] if x_train.ndim == 3 else 0
            return int(x_train.shape[0] + x_val.shape[0] + x_test.shape[0] + time_step)
        except Exception:
            return 0

    def _get_last_updated(self, symbol: str) -> Optional[datetime]:
        symbol_dir = PROCESSED_DATA_DIR / symbol
        if not symbol_dir.exists():
            return None

        timestamps = [
            item.stat().st_mtime for item in symbol_dir.iterdir() if item.is_file()
        ]
        if not timestamps:
            return None

        return datetime.fromtimestamp(max(timestamps))

    def _get_status(self, last_updated: Optional[datetime]) -> str:
        if not last_updated:
            return "needs_update"

        age_in_days = (datetime.now() - last_updated).days
        return "updated" if age_in_days <= 1 else "needs_update"

    def _load_symbol_data(self, symbol: str):
        raw_path = RAW_DATA_DIR / f"{symbol}.csv"

        if raw_path.exists():
            return load_data(raw_path)

        data = load_multi_stock_data([symbol])
        if symbol in data and not data[symbol].empty:
            return data[symbol]

        raise DataFetchException(
            f"Unable to fetch raw data for symbol {symbol}. Ensure raw CSV exists or vnstock is configured.",
        )


data_management_service = DataManagementService()

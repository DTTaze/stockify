import logging
import numpy as np
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Any
import pandas as pd
import time

from ..data.preprocessing import (
    load_data,
    process_single_stock,
    save_processed_data,
)
from ..vn_stock.exceptions import DataFetchException
from ..utils.paths import PROCESSED_DATA_DIR, RAW_DATA_DIR
from ..vn_stock.service import StockService, stock_service as default_stock_service
from ..vn_stock.config import vn_stock_config
from .backend_client import BackendClient

logger = logging.getLogger(__name__)


class DataManagementService:
    """Service to manage ML processed stock data, following SOLID principles."""

    def __init__(
        self,
        backend_client: Optional[BackendClient] = None,
        stock_service: Optional[StockService] = None,
    ):
        """Injectable dependencies for backend client and stock service (DIP)."""
        self.backend_client = backend_client or BackendClient(vn_stock_config.backend_url)
        self.stock_service = stock_service or default_stock_service

    def get_supported_symbols(self) -> List[str]:
        return vn_stock_config.supported_symbols

    def get_stock_items(self) -> List[Dict[str, Optional[Any]]]:
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

    def _determine_start_date(self, latest_date_str: Optional[str]) -> str:
        if latest_date_str and isinstance(latest_date_str, str):
            latest_dt = datetime.fromisoformat(latest_date_str.replace("Z", "+00:00"))
            return (latest_dt + timedelta(days=1)).strftime("%Y-%m-%d")
        return "2024-01-01"

    def _fetch_incremental_data(self, symbol: str, start_date: str) -> List[Dict[str, Any]]:
        end_date = datetime.now().strftime("%Y-%m-%d")
        new_data_points = []
        try:
            time.sleep(2)
            df = self.stock_service.data_source.fetch_history(
                symbol=symbol,
                start_date=start_date,
                end_date=end_date,
            )

            if df is not None and not df.empty:
                for _, row in df.iterrows():
                    new_data_points.append(
                        {
                            "date": str(row.get("time")),
                            "open": float(row.get("open", 0)),
                            "high": float(row.get("high", 0)),
                            "low": float(row.get("low", 0)),
                            "close": float(row.get("close", 0)),
                            "volume": int(row.get("volume", 0)),
                        }
                    )
        except Exception as e:
            logger.error(f"Error crawling incremental data for {symbol}: {e}")
            if not (RAW_DATA_DIR / f"{symbol}.csv").exists():
                raise DataFetchException(f"Failed to fetch stock history: {e}")
        return new_data_points

    def _save_history_to_csv(self, symbol: str, history_list: List[Dict[str, Any]]) -> pd.DataFrame:
        records = [
            {
                "Date": item.get("date"),
                "Open": float(item.get("open") or 0),
                "High": float(item.get("high") or 0),
                "Low": float(item.get("low") or 0),
                "Close": float(item.get("close") or 0),
                "Volume": float(item.get("volume") or 0),
            }
            for item in history_list
        ]
        full_df = pd.DataFrame(records)
        full_df["Date"] = pd.to_datetime(full_df["Date"])
        full_df = full_df.sort_values("Date").reset_index(drop=True)

        raw_path = RAW_DATA_DIR / f"{symbol}.csv"
        dummy_row = pd.DataFrame(
            [
                {
                    "Date": "2000-01-01",
                    "Open": 0,
                    "High": 0,
                    "Low": 0,
                    "Close": 0,
                    "Volume": 0,
                }
            ]
        )
        csv_df = pd.concat([dummy_row, full_df], ignore_index=True)
        csv_df.to_csv(raw_path, index=False)

        logger.info(f"Updated raw CSV for {symbol} with {len(full_df)} records.")
        return full_df

    def _trigger_training(self, symbol: str, background_tasks) -> str:
        if background_tasks is not None:
            from ..models.train import train_multi_stock_models
            background_tasks.add_task(train_multi_stock_models, [symbol])
            return f"Data updated. AI training started in background for {symbol}."
        return f"Data for {symbol} has been updated."

    def update_stock(
        self, symbol: str, background_tasks=None
    ) -> Dict[str, Optional[Any]]:
        normalized = symbol.upper()

        latest_date_str = self.backend_client.get_latest_date(normalized)
        start_date = self._determine_start_date(latest_date_str)
        new_data_points = self._fetch_incremental_data(normalized, start_date)

        if new_data_points:
            self.backend_client.post_history(normalized, new_data_points)

        full_df = None
        history_list = self.backend_client.get_history(normalized)
        if history_list:
            try:
                full_df = self._save_history_to_csv(normalized, history_list)
            except Exception as e:
                logger.error(f"Failed to process history from NestJS: {e}")

        if full_df is None:
            raw_path = RAW_DATA_DIR / f"{normalized}.csv"
            if raw_path.exists():
                full_df = load_data(raw_path)
            else:
                raise DataFetchException(f"No history available for symbol {normalized}")

        data_splits, scalers = process_single_stock(normalized, full_df)
        save_processed_data(normalized, data_splits, scalers)

        message = self._trigger_training(normalized, background_tasks)
        last_updated = self._get_last_updated(normalized)

        return {
            "symbol": normalized,
            "updated": True,
            "message": message,
            "last_updated": last_updated.isoformat() if last_updated else None,
        }


    def update_all(self, background_tasks=None) -> Dict[str, object]:
        symbols = self.get_supported_symbols()
        updated_symbols: List[str] = []

        for symbol in symbols:
            try:
                self.update_stock(symbol, background_tasks)
                updated_symbols.append(symbol)
            except Exception as e:
                logger.error(f"Failed to update {symbol} in update_all: {e}")
                continue

        return {
            "updated_count": len(updated_symbols),
            "updated_symbols": updated_symbols,
            "message": f"Updated {len(updated_symbols)} symbols and scheduled AI training.",
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


data_management_service = DataManagementService()

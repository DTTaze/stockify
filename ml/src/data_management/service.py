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
        from ..models.train import DEFAULT_SYMBOLS
        return DEFAULT_SYMBOLS

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

    def update_stock(
        self, symbol: str, background_tasks=None
    ) -> Dict[str, Optional[Any]]:
        normalized = symbol.upper()

        # 1. Fetch latest price date from NestJS via BackendClient
        latest_date_str = self.backend_client.get_latest_date(normalized)

        # 2. Crawl vnstock incrementally using injected StockService
        if latest_date_str and isinstance(latest_date_str, str):
            latest_dt = datetime.fromisoformat(latest_date_str.replace("Z", "+00:00"))
            start_date = (latest_dt + timedelta(days=1)).strftime("%Y-%m-%d")
        else:
            start_date = "2024-01-01"

        end_date = datetime.now().strftime("%Y-%m-%d")

        new_data_points = []
        try:
            # Sleep to prevent hitting rate limits
            time.sleep(2)

            df = self.stock_service.data_source.fetch_history(
                symbol=normalized,
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
            logger.error(f"Error crawling incremental data for {normalized}: {e}")
            if not (RAW_DATA_DIR / f"{normalized}.csv").exists():
                raise DataFetchException(f"Failed to fetch stock history: {e}")

        # 3. Post new data points to NestJS via BackendClient
        if new_data_points:
            self.backend_client.post_history(normalized, new_data_points)

        # 4. Fetch full history from NestJS via BackendClient
        full_df = None
        history_list = self.backend_client.get_history(normalized)
        if history_list:
            try:
                records = []
                for item in history_list:
                    records.append(
                        {
                            "Date": item.get("date"),
                            "Open": float(item.get("open") or 0),
                            "High": float(item.get("high") or 0),
                            "Low": float(item.get("low") or 0),
                            "Close": float(item.get("close") or 0),
                            "Volume": float(item.get("volume") or 0),
                        }
                    )
                full_df = pd.DataFrame(records)
                full_df["Date"] = pd.to_datetime(full_df["Date"])
                full_df = full_df.sort_values("Date").reset_index(drop=True)

                # Write to CSV with dummy row under header due to skiprows=[1] in load_data
                raw_path = RAW_DATA_DIR / f"{normalized}.csv"
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

                logger.info(
                    f"Updated raw CSV for {normalized} with {len(full_df)} records."
                )
            except Exception as e:
                logger.error(f"Failed to process history from NestJS: {e}")

        # Fallback to local file if fetch failed
        if full_df is None:
            raw_path = RAW_DATA_DIR / f"{normalized}.csv"
            if raw_path.exists():
                full_df = load_data(raw_path)
            else:
                raise DataFetchException(
                    f"No history available for symbol {normalized}"
                )

        # 5. Process single stock splits and scale
        data_splits, scalers = process_single_stock(normalized, full_df)
        save_processed_data(normalized, data_splits, scalers)

        # 6. Trigger automated retraining of model in background task
        if background_tasks is not None:
            from ..models.train import train_multi_stock_models

            background_tasks.add_task(train_multi_stock_models, [normalized])
            message = (
                f"Data updated. AI training started in background for {normalized}."
            )
        else:
            message = f"Data for {normalized} has been updated."

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

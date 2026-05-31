import logging
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

logger = logging.getLogger(__name__)


class DataManagementService:
    """Service to manage ML processed stock data"""

    def get_supported_symbols(self) -> List[str]:
        from ..models.train import DEFAULT_SYMBOLS

        return DEFAULT_SYMBOLS

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

    def update_stock(
        self, symbol: str, background_tasks=None
    ) -> Dict[str, Optional[str]]:
        normalized = symbol.upper()

        # 1. Fetch latest price date from NestJS
        from ..vn_stock.config import vn_stock_config
        import requests
        import pandas as pd
        import time
        from datetime import timedelta

        backend_url = vn_stock_config.backend_url
        latest_date_str = None
        try:
            r = requests.get(
                f"{backend_url}/stocks/{normalized}/latest-date", timeout=10
            )
            if r.status_code == 200:
                res_data = r.json()
                if res_data.get("success"):
                    latest_date_val = res_data.get("data")
                    if isinstance(latest_date_val, dict):
                        latest_date_str = latest_date_val.get("data")
                    else:
                        latest_date_str = latest_date_val
        except Exception as e:
            logger.warning(
                f"Failed to get latest date from NestJS for {normalized}: {e}"
            )

        # 2. Crawl vnstock incrementally
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

            from vnstock import Quote

            quote = Quote(symbol=normalized, source="VCI")
            df = quote.history(start=start_date, end=end_date, interval="1D")

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
                raise DataFetchException(f"Failed to fetch vnstock data: {e}")

        # 3. Post new data points to NestJS
        if new_data_points:
            try:
                headers = {"Content-Type": "application/json"}
                r = requests.post(
                    f"{backend_url}/stocks/{normalized}/history",
                    json=new_data_points,
                    headers=headers,
                    timeout=15,
                )
                if r.status_code not in [200, 201]:
                    logger.warning(
                        f"NestJS returned status {r.status_code} while saving history for {normalized}"
                    )
            except Exception as e:
                logger.error(f"Failed to POST historical prices to NestJS: {e}")

        # 4. Fetch full history from NestJS
        full_df = None
        try:
            r = requests.get(f"{backend_url}/stocks/{normalized}/history", timeout=20)
            if r.status_code == 200:
                res_data = r.json()
                if res_data.get("success") and res_data.get("data"):
                    history_list = res_data.get("data")
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
            logger.error(f"Failed to fetch complete history from NestJS: {e}")

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

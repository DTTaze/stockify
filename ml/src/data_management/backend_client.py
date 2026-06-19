import logging
import requests
from typing import Optional, List, Dict, Any

logger = logging.getLogger(__name__)


class BackendClient:
    """Encapsulates HTTP calls to the NestJS backend, complying with SRP."""

    def __init__(self, backend_url: str):
        self.backend_url = backend_url

    def get_latest_date(self, symbol: str) -> Optional[str]:
        """Fetch the latest synced price date for a given symbol from the database."""
        try:
            url = f"{self.backend_url}/stocks/{symbol}/latest-date"
            logger.info(f"GET {url}")
            r = requests.get(url, timeout=10)
            if r.status_code == 200:
                res_data = r.json()
                if res_data.get("success"):
                    latest_date_val = res_data.get("data")
                    if isinstance(latest_date_val, dict):
                        return latest_date_val.get("data")
                    return latest_date_val
            else:
                logger.warning(
                    f"Backend returned status {r.status_code} for latest-date {symbol}"
                )
        except Exception as e:
            logger.warning(f"Failed to get latest date from NestJS for {symbol}: {e}")
        return None

    def post_history(self, symbol: str, data_points: List[Dict[str, Any]]) -> bool:
        """Send newly fetched historical data points to the backend to store."""
        if not data_points:
            return True
        try:
            url = f"{self.backend_url}/stocks/{symbol}/history"
            headers = {"Content-Type": "application/json"}
            logger.info(f"POST {url} with {len(data_points)} points")
            r = requests.post(
                url,
                json=data_points,
                headers=headers,
                timeout=15,
            )
            if r.status_code in [200, 201]:
                return True
            logger.warning(
                f"NestJS returned status {r.status_code} while saving history for {symbol}"
            )
        except Exception as e:
            logger.error(
                f"Failed to POST historical prices to NestJS for {symbol}: {e}"
            )
        return False

    def get_history(self, symbol: str) -> Optional[List[Dict[str, Any]]]:
        """Fetch the complete historical price list for a given symbol from the database."""
        try:
            url = f"{self.backend_url}/stocks/{symbol}/history"
            logger.info(f"GET {url}")
            r = requests.get(url, timeout=20)
            if r.status_code == 200:
                res_data = r.json()
                if res_data.get("success") and res_data.get("data"):
                    return res_data.get("data")
            else:
                logger.warning(
                    f"Backend returned status {r.status_code} for history of {symbol}"
                )
        except Exception as e:
            logger.error(
                f"Failed to fetch complete history from NestJS for {symbol}: {e}"
            )
        return None

import logging
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List

try:
    from vnstock import Quote
except ImportError:
    Quote = None

from .constants import INDICES
from .exceptions import (
    IndexNotFoundException,
    DataFetchException,
)
from . import schemas

logger = logging.getLogger(__name__)


class StockService:
    """Service for handling Vietnamese stock operations"""

    VALID_PERIODS = ["1d", "5d", "1mo", "3mo", "6mo", "1y"]

    def __init__(self):
        """Initialize the service"""
        if Quote is None:
            logger.warning(
                "vnstock3 is not installed. Install it using: pip install vnstock3"
            )
            self.client = None
        else:
            self.client = Quote
            logger.info("vnstock Quote client initialized")

    def get_index_quote(self, index_code: str) -> schemas.IndexQuote:
        """Get current quote for an index

        Args:
            index_code: The index code (e.g., 'vn-index', 'vn30')

        Returns:
            IndexQuote object with current data

        Raises:
            IndexNotFoundException if index is not found
            DataFetchException if data fetching fails
        """
        index_key = index_code.lower()

        if index_key not in INDICES:
            raise IndexNotFoundException(index_code)

        index_info = INDICES[index_key]

        if not self.client:
            raise DataFetchException("Vnstock client is not initialized")

        try:
            data = self._fetch_quote_from_vnstock(index_info["code"])

            if data:
                return data
            raise DataFetchException(f"Failed to fetch quote for {index_code}")
        except Exception as e:
            logger.error(f"Error fetching quote from vnstock: {e}")
            raise DataFetchException(
                f"Failed to fetch quote for {index_code}: {str(e)}"
            )

    def _fetch_quote_from_vnstock(
        self, index_code: str
    ) -> Optional[schemas.IndexQuote]:
        """Fetch current quote from vnstock using Quote API"""
        try:
            logger.info(f"Fetching quote for {index_code} from vnstock")

            quote = self.client(symbol=index_code, source="VCI")

            end_date = datetime.now().strftime("%Y-%m-%d")
            start_date = (datetime.now() - timedelta(days=5)).strftime("%Y-%m-%d")

            history_data = quote.history(start=start_date, end=end_date, interval="1D")

            if history_data is None or len(history_data) == 0:
                logger.warning(f"No history data returned for {index_code}")
                return None

            logger.info(f"History data type: {type(history_data)}")

            if hasattr(history_data, "iloc"):
                latest = history_data.iloc[-1]
                data_dict = (
                    latest.to_dict() if hasattr(latest, "to_dict") else dict(latest)
                )
            else:
                data_dict = (
                    history_data[-1] if isinstance(history_data, list) else history_data
                )

            logger.info(f"Latest data: {data_dict}")

            if data_dict is None:
                logger.warning(f"Empty data for {index_code}")
                return None

            close_price = float(data_dict.get("close", 0))
            open_price = float(data_dict.get("open", close_price))
            high_price = float(data_dict.get("high", close_price))
            low_price = float(data_dict.get("low", close_price))

            change = close_price - open_price
            change_percent = (change / open_price * 100) if open_price != 0 else 0

            return schemas.IndexQuote(
                code=index_code,
                name=data_dict.get("name", index_code),
                price=round(close_price, 2),
                change=round(change, 2),
                change_percent=round(change_percent, 2),
                high=round(high_price, 2),
                low=round(low_price, 2),
                open=round(open_price, 2),
                volume=int(data_dict.get("volume", 0)),
                timestamp=datetime.now(),
            )

        except Exception as e:
            logger.error(f"Error fetching quote for {index_code}: {e}", exc_info=True)
            return None


stock_service = StockService()

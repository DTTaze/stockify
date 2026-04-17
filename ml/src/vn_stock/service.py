import logging
from datetime import datetime, timedelta
from typing import List

from matplotlib.dates import relativedelta
import pandas as pd

try:
    from vnstock import Quote, Listing
except ImportError:
    Quote = None
    Listing = None

from .constants import FETCH_BUFFER, INDICES, PERIOD_MAPPING, VALID_PERIODS
from .exceptions import IndexNotFoundException, DataFetchException
from . import schemas

logger = logging.getLogger(__name__)


class StockService:
    """Service for Vietnamese stock & index"""

    def __init__(self):
        if Quote is None:
            logger.warning("vnstock not installed")
            self.client = None
        else:
            self.client = Quote

    def get_index_quote(self, index_code: str, period: str) -> schemas.MarketQuote:
        index_key = index_code.lower()

        if index_key not in INDICES:
            raise IndexNotFoundException(index_code)

        return self._get_quote(INDICES[index_key]["code"], period)

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

    def _get_quote(self, symbol: str, period: str):
        if not self.client:
            raise DataFetchException("Vnstock client not initialized")

        if period not in VALID_PERIODS:
            raise DataFetchException(f"Invalid period: {period}")

        try:
            quote = self.client(symbol=symbol, source="VCI")

            end_date = datetime.now()

            buffer_days = FETCH_BUFFER.get(period, 30)
            start_date = end_date - timedelta(days=buffer_days)

            df = quote.history(
                start=start_date.strftime("%Y-%m-%d"),
                end=end_date.strftime("%Y-%m-%d"),
                interval="1D",
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
                change = 0
                change_percent = 0
            else:
                change = close_price - first_close_price
                change_percent = (change / first_close_price) * 100

            return {
                "symbol": symbol,
                "price": round(close_price, 2),
                "change_percent": round(change_percent, 2),
                "volume": int(latest.get("volume", 0)),
            }

        except Exception as e:
            logger.error(f"Quote error {symbol}: {e}", exc_info=True)
            raise

    def get_index_historical(
        self, index_code: str, period: str
    ) -> schemas.MarketHistoricalResponse:
        index_key = index_code.lower()

        if index_key not in INDICES:
            raise IndexNotFoundException(index_code)

        return self._get_historical(
            INDICES[index_key]["code"], period, schemas.MarketType.INDEX
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

        if not self.client:
            raise DataFetchException("Vnstock client not initialized")

        if period not in VALID_PERIODS:
            raise DataFetchException(f"Invalid period: {period}")

        try:
            days = PERIOD_MAPPING[period]

            quote = self.client(symbol=symbol, source="VCI")

            end_date = datetime.now()
            start_date = end_date - timedelta(days=days)

            df = quote.history(
                start=start_date.strftime("%Y-%m-%d"),
                end=end_date.strftime("%Y-%m-%d"),
                interval="1D",
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
        if Listing is None:
            raise DataFetchException("Listing not available")

        try:
            listing = Listing(source="VCI")
            df = listing.all_symbols()

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


stock_service = StockService()

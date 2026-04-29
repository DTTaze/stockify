import logging
from typing import Optional

from ..models.predict import predict_future_prices, get_supported_symbols
from .schemas import PredictionResponse, SupportedSymbolsResponse

logger = logging.getLogger(__name__)


class PredictionService:
    """Service for AI stock price predictions"""

    @staticmethod
    def get_prediction(symbol: str) -> Optional[PredictionResponse]:
        """Get prediction for a specific symbol"""
        try:
            prediction_data = predict_future_prices(symbol)
            if prediction_data:
                return PredictionResponse(**prediction_data)
            return None
        except Exception as e:
            logger.error(f"Error getting prediction for {symbol}: {e}")
            return None

    @staticmethod
    def get_supported_symbols() -> SupportedSymbolsResponse:
        """Get list of supported symbols"""
        try:
            symbols = get_supported_symbols()
            return SupportedSymbolsResponse(symbols=symbols)
        except Exception as e:
            logger.error(f"Error getting supported symbols: {e}")
            return SupportedSymbolsResponse(symbols=[])


prediction_service = PredictionService()

"""
Vietnamese Stock Index API Module

This module provides APIs to fetch information about Vietnamese stock indices
including VN-INDEX, VN30, HNX-INDEX, and UPCOM.

Example:
    Using the API endpoints::

        GET /api/v1/indices/ - Get all available indices
        GET /api/v1/indices/vn-index/quote - Get current quote for VN-INDEX
        GET /api/v1/indices/vn-index/historical?period=1mo - Get historical data
"""

from .constants import INDICES, SUPPORTED_INDICES
from .schemas import (
    IndexInfo,
    IndexQuote,
    HistoricalData,
    IndexHistoricalResponse,
    IndexListResponse,
    ErrorResponse,
)
from .service import StockService, stock_service
from .router import router
from .config import vn_stock_config
from .exceptions import (
    IndexNotFoundException,
    InvalidPeriodException,
    DataFetchException,
    VnstockException,
)

__version__ = "1.0.0"
__author__ = "Stockify Team"
__all__ = [
    # Constants
    "INDICES",
    "SUPPORTED_INDICES",
    # Schemas
    "IndexInfo",
    "IndexQuote",
    "HistoricalData",
    "IndexHistoricalResponse",
    "IndexListResponse",
    "ErrorResponse",
    # Service
    "StockService",
    "stock_service",
    # Router
    "router",
    # Config
    "vn_stock_config",
    # Exceptions
    "IndexNotFoundException",
    "InvalidPeriodException",
    "DataFetchException",
    "VnstockException",
]

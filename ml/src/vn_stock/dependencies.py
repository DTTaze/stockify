from typing import Generator
from .service import StockService, stock_service


def get_stock_index_service() -> Generator[StockService, None, None]:
    """
    Dependency provider for StockIndexService.

    This is used with FastAPI's Depends() to inject the service
    into route handlers.

    Yields:
        StockIndexService instance
    """
    yield stock_service

from fastapi import APIRouter, Depends, Query, Path

from .service import StockService, stock_service
from . import schemas

router = APIRouter(
    prefix="/api/v1/indices",
    tags=["Stock Indices"],
    responses={
        404: {"model": schemas.ErrorResponse, "description": "Index not found"},
        400: {"model": schemas.ErrorResponse, "description": "Bad request"},
        503: {"model": schemas.ErrorResponse, "description": "Service unavailable"},
    },
)


def get_service() -> StockService:
    """Dependency to get stock index service"""
    return stock_service


@router.get(
    "/{index_code}/quote",
    response_model=schemas.IndexQuote,
    summary="Get current index quote",
    description="Get current price and statistics for a specific index",
)
async def get_index_quote(
    index_code: str = Path(
        ..., description="Index code (vn-index, vn30, hnx-index, upcom)"
    ),
    service: StockService = Depends(get_service),
) -> schemas.IndexQuote:
    """
    Get current quote for a specific stock index.

    **Parameters:**
    - `index_code`: The index code (e.g., 'vn-index', 'vn30', 'hnx-index', 'upcom')

    **Returns:**
    - Current price, change, change percentage, high, low, open, volume, and timestamp

    **Example Response:**
    ```json
    {
        "code": "VNINDEX",
        "name": "VN-INDEX",
        "price": 1280.50,
        "change": 5.25,
        "change_percent": 0.41,
        "high": 1285.00,
        "low": 1275.50,
        "open": 1275.25,
        "volume": 1000000000,
        "timestamp": "2026-04-03T10:30:00"
    }
    ```
    """
    return service.get_index_quote(index_code)

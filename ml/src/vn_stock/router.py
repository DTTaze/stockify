from fastapi import APIRouter, Depends, Query, Path

from .service import StockService, stock_service
from . import schemas

router = APIRouter(
    prefix="/api/v1/market",
    tags=["Market"],
    responses={
        404: {"model": schemas.ErrorResponse, "description": "Not found"},
        400: {"model": schemas.ErrorResponse, "description": "Bad request"},
        503: {"model": schemas.ErrorResponse, "description": "Service unavailable"},
    },
)


def get_service() -> StockService:
    return stock_service


@router.get(
    "/quote",
    response_model=schemas.MarketQuote,
    summary="Get market quote",
)
async def get_market_quote(
    symbol: str = Query(..., description="Symbol (e.g., VCB, vn-index)"),
    type: schemas.MarketType = Query(..., description="Market type: stock | index"),
    period: schemas.Period = Query("1d", description="Time period"),
    service: StockService = Depends(get_service),
) -> schemas.MarketQuote:
    if type == schemas.MarketType.INDEX:
        return service.get_index_quote(symbol, period)

    return service.get_stock_quote(symbol, period)


@router.get(
    "/historical",
    response_model=schemas.MarketHistoricalResponse,
    summary="Get historical data",
)
async def get_market_historical(
    symbol: str = Query(..., description="Symbol (VCB, vn-index)"),
    type: schemas.MarketType = Query(..., description="stock | index"),
    period: schemas.Period = Query("1mo", description="Time period"),
    service: StockService = Depends(get_service),
) -> schemas.MarketHistoricalResponse:
    if type == schemas.MarketType.INDEX:
        return service.get_index_historical(symbol, period)

    return service.get_stock_historical(symbol, period)


@router.get(
    "/list",
    response_model=schemas.MarketListResponse,
    summary="Get market list",
)
async def get_market_list(
    type: schemas.MarketType = Query(..., description="stock | index"),
    service: StockService = Depends(get_service),
) -> schemas.MarketListResponse:
    if type == schemas.MarketType.INDEX:
        return service.get_indices()

    return service.get_stocks()

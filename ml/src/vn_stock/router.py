from typing import List
from fastapi import APIRouter, Depends, Query, Path, BackgroundTasks

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
def get_market_quote(
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
def get_market_historical(
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
def get_market_list(
    type: schemas.MarketType = Query(..., description="stock | index"),
    service: StockService = Depends(get_service),
) -> schemas.MarketListResponse:
    if type == schemas.MarketType.INDEX:
        return service.get_indices()

    return service.get_stocks()


@router.get(
    "/symbols-by-exchange",
    response_model=List[schemas.StockByExchange],
    summary="Get stock symbols by exchange",
)
def get_stocks_by_exchange(
    exchange: str = Query("ALL", description="Exchange (HOSE, HNX, UPCOM, or ALL)"),
    service: StockService = Depends(get_service),
) -> List[schemas.StockByExchange]:
    return service.get_stocks_by_exchange(exchange)


@router.get(
    "/stock-details",
    response_model=List[schemas.StockDetailResponse],
    summary="Get detailed stock symbols by exchange",
)
def get_stock_details(
    exchange: str = Query(
        "ALL", description="Exchange (HOSE, HNX, UPCOM, DELISTED, or ALL)"
    ),
    service: StockService = Depends(get_service),
) -> List[schemas.StockDetailResponse]:
    return service.get_stock_details(exchange)


@router.get(
    "/grouped-symbols",
    response_model=dict,
    summary="Get symbols grouped by classification",
)
def get_grouped_symbols(
    background_tasks: BackgroundTasks,
    service: StockService = Depends(get_service),
) -> dict:
    return service.get_grouped_symbols(background_tasks)


@router.get(
    "/symbols-by-group/{group}",
    response_model=List[str],
    summary="Get symbols for a specific group",
)
def get_symbols_by_group(
    group: str = Path(..., description="Group name (e.g. VN30, CW, ETF, FU_INDEX)"),
    service: StockService = Depends(get_service),
) -> List[str]:
    return service.get_symbols_by_group(group)


@router.get(
    "/icb-industries",
    response_model=List[schemas.IcbIndustryResponse],
    summary="Get all ICB industries",
)
def get_icb_industries(
    service: StockService = Depends(get_service),
) -> List[schemas.IcbIndustryResponse]:
    return service.get_icb_industries()


@router.get(
    "/symbols-by-industries",
    response_model=List[schemas.SymbolIndustryResponse],
    summary="Get symbols mapped to industries",
)
def get_symbols_by_industries(
    service: StockService = Depends(get_service),
) -> List[schemas.SymbolIndustryResponse]:
    return service.get_symbols_by_industries()


@router.get(
    "/futures",
    response_model=List[str],
    summary="Get all futures contracts symbols",
)
def get_futures(
    service: StockService = Depends(get_service),
) -> List[str]:
    return service.get_futures()


@router.get(
    "/government-bonds",
    response_model=List[str],
    summary="Get all government bonds symbols",
)
def get_government_bonds(
    service: StockService = Depends(get_service),
) -> List[str]:
    return service.get_government_bonds()


@router.get(
    "/indices",
    response_model=List[str],
    summary="Get all indices symbols",
)
def get_indices_list(
    service: StockService = Depends(get_service),
) -> List[str]:
    return service.get_all_indices()

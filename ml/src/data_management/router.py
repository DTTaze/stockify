from fastapi import APIRouter, Depends, Path, BackgroundTasks

from .service import DataManagementService, data_management_service
from .schemas import (
    DataManagementSummaryResponse,
    DataManagementStocksResponse,
    DataUpdateAllResponse,
    DataUpdateResponse,
)

router = APIRouter(
    prefix="/api/v1/data-management",
    tags=["Data Management"],
    responses={
        404: {"description": "Not found"},
        500: {"description": "Internal server error"},
    },
)


def get_service() -> DataManagementService:
    return data_management_service


@router.get(
    "/summary",
    response_model=DataManagementSummaryResponse,
    summary="Get data management summary",
    description="Retrieve dashboard summary information for stock data management",
)
def get_data_management_summary(
    service: DataManagementService = Depends(get_service),
) -> DataManagementSummaryResponse:
    return DataManagementSummaryResponse(**service.get_summary())


@router.get(
    "/stocks",
    response_model=DataManagementStocksResponse,
    summary="Get managed stock data list",
    description="Retrieve a list of stock symbols with processed data status",
)
def get_data_management_stocks(
    service: DataManagementService = Depends(get_service),
) -> DataManagementStocksResponse:
    return DataManagementStocksResponse(
        stocks=[
            {
                "symbol": stock["symbol"],
                "last_updated": stock["last_updated"],
                "total_records": stock["total_records"],
                "status": stock["status"],
            }
            for stock in service.get_stock_items()
        ],
    )


@router.post(
    "/update/{symbol}",
    response_model=DataUpdateResponse,
    summary="Update data for a single symbol",
    description="Fetch raw data and refresh processed data for a specific stock symbol",
)
def update_stock_data(
    symbol: str = Path(..., description="Stock symbol to update"),
    background_tasks: BackgroundTasks = None,
    service: DataManagementService = Depends(get_service),
) -> DataUpdateResponse:
    result = service.update_stock(symbol, background_tasks)
    return DataUpdateResponse(**result)


@router.post(
    "/update-all",
    response_model=DataUpdateAllResponse,
    summary="Update data for all supported symbols",
    description="Refresh processed data for all supported stock symbols",
)
def update_all_stock_data(
    background_tasks: BackgroundTasks = None,
    service: DataManagementService = Depends(get_service),
) -> DataUpdateAllResponse:
    return DataUpdateAllResponse(**service.update_all(background_tasks))

from fastapi import APIRouter, Depends, Path, Query
from .service import PredictionService, prediction_service
from . import schemas

router = APIRouter(
    prefix="/api/v1/prediction",
    tags=["Prediction"],
    responses={
        404: {"model": schemas.PredictionResponse, "description": "Not found"},
        500: {"description": "Internal server error"},
    },
)


def get_service() -> PredictionService:
    return prediction_service


@router.get(
    "/symbols",
    response_model=schemas.SupportedSymbolsResponse,
    summary="Get supported symbols",
    description="Get list of stock symbols with available trained models",
)
def get_supported_symbols(
    service: PredictionService = Depends(get_service),
) -> schemas.SupportedSymbolsResponse:
    return service.get_supported_symbols()


@router.get(
    "/{symbol}",
    response_model=schemas.PredictionResponse,
    summary="Get AI price prediction",
    description="Get AI predicted prices for tomorrow, 3 days, 7 days, and 14 days ahead",
)
def get_prediction(
    symbol: str = Path(..., description="Stock symbol (e.g., VCB, VIC, VNM)"),
    model_type: str = Query("lstm", description="Model type (lstm, gru, linear)"),
    service: PredictionService = Depends(get_service),
) -> schemas.PredictionResponse:
    prediction = service.get_prediction(symbol.upper(), model_type.lower())

    if not prediction:
        return schemas.PredictionResponse(symbol=symbol.upper())

    return prediction

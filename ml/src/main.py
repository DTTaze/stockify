from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from ml.src.data_management import router as data_management
from ml.src.vn_stock import router as vn_stock
from ml.src.prediction import router as prediction
from ml.src.model_management import router as model_management

from ml.src.vn_stock.config import vn_stock_config
from ml.src.vn_stock.utils import setup_logging
from ml.src.vn_stock.exceptions import (
    IndexNotFoundException,
    InvalidPeriodException,
    DataFetchException,
)

logger = setup_logging(__name__, vn_stock_config.log_level)


app = FastAPI(
    title=vn_stock_config.service_name,
    description=vn_stock_config.service_description,
    version=vn_stock_config.service_version,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/api/v1/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(IndexNotFoundException)
async def index_not_found_exception_handler(request, exc):
    """Handle IndexNotFoundException"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "error_code": getattr(exc, "error_code", "INDEX_NOT_FOUND"),
        },
    )


@app.exception_handler(InvalidPeriodException)
async def invalid_period_exception_handler(request, exc):
    """Handle InvalidPeriodException"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "error_code": getattr(exc, "error_code", "INVALID_PERIOD"),
        },
    )


@app.exception_handler(DataFetchException)
async def data_fetch_exception_handler(request, exc):
    """Handle DataFetchException"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "error_code": getattr(exc, "error_code", "DATA_FETCH_FAILED"),
        },
    )


app.include_router(vn_stock.router)
app.include_router(prediction.router)
app.include_router(data_management.router)
app.include_router(model_management.router)

if __name__ == "__main__":
    import uvicorn

    logger.info("Starting FastAPI server...")
    uvicorn.run(
        app, host="0.0.0.0", port=8000, log_level=vn_stock_config.log_level.lower()
    )

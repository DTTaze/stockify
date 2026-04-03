"""
Main FastAPI application for Vietnamese Stock Index API

This module sets up the FastAPI application with all routes and middleware.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from ml.src.vn_stock import router

from ml.src.vn_stock.config import vn_stock_config
from ml.src.vn_stock.utils import setup_logging
from ml.src.vn_stock.exceptions import (
    IndexNotFoundException,
    InvalidPeriodException,
    DataFetchException,
)

logger = setup_logging(__name__, vn_stock_config.log_level)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manage the lifespan of the FastAPI application.

    This runs startup code before the application starts serving requests,
    and shutdown code when the application stops.
    """

    logger.info(
        f"Starting {vn_stock_config.service_name} v{vn_stock_config.service_version}"
    )
    logger.info(f"Cache enabled: {vn_stock_config.cache_enabled}")
    logger.info(f"Vnstock enabled: {vn_stock_config.vnstock_enabled}")

    yield

    logger.info(f"Shutting down {vn_stock_config.service_name}")


app = FastAPI(
    title=vn_stock_config.service_name,
    description=vn_stock_config.service_description,
    version=vn_stock_config.service_version,
    lifespan=lifespan,
    docs_url="/api/v1/docs",
    redoc_url="/api/v1/redoc",
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


app.include_router(router)


@app.get(
    "/",
    tags=["Health"],
    summary="Health check",
    description="Check if the API is running",
)
async def root():
    """
    Health check endpoint.

    Returns information about the API service.
    """
    return {
        "service": vn_stock_config.service_name,
        "version": vn_stock_config.service_version,
        "status": "healthy",
        "docs": "/api/v1/docs",
        "redoc": "/api/v1/redoc",
    }


@app.get(
    "/health",
    tags=["Health"],
    summary="Health status",
    description="Get detailed health status",
)
async def health():
    """
    Get detailed health status of the API.

    Returns information about service availability and configuration.
    """
    return {
        "status": "healthy",
        "service": vn_stock_config.service_name,
        "version": vn_stock_config.service_version,
        "features": {
            "cache": vn_stock_config.cache_enabled,
            "vnstock": vn_stock_config.vnstock_enabled,
        },
    }


if __name__ == "__main__":
    import uvicorn

    logger.info("Starting FastAPI server...")
    uvicorn.run(
        app, host="0.0.0.0", port=8000, log_level=vn_stock_config.log_level.lower()
    )

import os
from typing import Optional
from pydantic_settings import BaseSettings


class VnStockConfig(BaseSettings):
    """Configuration for VN Stock module"""

    service_name: str = "VN Stock Index API"
    service_version: str = "1.0.0"
    service_description: str = "API for fetching Vietnamese stock index data"

    cache_enabled: bool = True
    cache_expiration_minutes: int = 5

    api_prefix: str = "/api/v1/indices"
    api_tags: list = ["Stock Indices"]

    vnstock_enabled: bool = os.getenv("VNSTOCK_ENABLED", "true").lower() == "true"
    vnstock_timeout: int = 30
    vnstock_retry_count: int = 3

    log_level: str = os.getenv("LOG_LEVEL", "INFO")
    backend_url: str = "http://localhost:3060/v1/api"

    supported_symbols: list[str] = [
        "VCB",
        "VIC",
        "VNM",
        "FPT",
        "HPG",
        "SSI",
        "VHM",
        "BID",
        "CTG",
        "TCB",
    ]

    class Config:
        env_file = ".env"
        env_prefix = "VNSTOCK_"
        case_sensitive = False
        extra = "ignore"


vn_stock_config = VnStockConfig()

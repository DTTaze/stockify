from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class IndexInfo(BaseModel):
    """Information about a stock index"""

    code: str = Field(..., description="Index code")
    name: str = Field(..., description="Index name")
    description: str = Field(..., description="Index description")

    class Config:
        json_schema_extra = {
            "example": {
                "code": "VNINDEX",
                "name": "VN-INDEX",
                "description": "Vietnam Stock Index - HoSE",
            }
        }


class IndexQuote(BaseModel):
    """Current quote for an index"""

    code: str = Field(..., description="Index code")
    name: str = Field(..., description="Index name")
    price: float = Field(..., description="Current price")
    change: float = Field(..., description="Price change")
    change_percent: float = Field(..., description="Percentage change")
    high: Optional[float] = Field(None, description="Day high")
    low: Optional[float] = Field(None, description="Day low")
    open: Optional[float] = Field(None, description="Open price")
    volume: Optional[int] = Field(None, description="Trading volume")
    timestamp: datetime = Field(..., description="Data timestamp")

    class Config:
        json_schema_extra = {
            "example": {
                "code": "VNINDEX",
                "name": "VN-INDEX",
                "price": 1280.50,
                "change": 5.25,
                "change_percent": 0.41,
                "high": 1285.00,
                "low": 1275.50,
                "open": 1275.25,
                "volume": 1000000,
                "timestamp": "2026-04-03T10:30:00",
            }
        }


class HistoricalData(BaseModel):
    """Historical data point for an index"""

    date: datetime = Field(..., description="Date")
    open: float = Field(..., description="Open price")
    high: float = Field(..., description="High price")
    low: float = Field(..., description="Low price")
    close: float = Field(..., description="Close price")
    volume: int = Field(..., description="Trading volume")

    class Config:
        json_schema_extra = {
            "example": {
                "date": "2026-04-03T00:00:00",
                "open": 1275.25,
                "high": 1285.00,
                "low": 1275.00,
                "close": 1280.50,
                "volume": 1000000,
            }
        }


class IndexHistoricalResponse(BaseModel):
    """Historical data response for an index"""

    code: str = Field(..., description="Index code")
    name: str = Field(..., description="Index name")
    period: str = Field(..., description="Data period")
    data: List[HistoricalData] = Field(
        ..., description="List of historical data points"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "code": "VNINDEX",
                "name": "VN-INDEX",
                "period": "1mo",
                "data": [
                    {
                        "date": "2026-04-03T00:00:00",
                        "open": 1275.25,
                        "high": 1285.00,
                        "low": 1275.00,
                        "close": 1280.50,
                        "volume": 1000000,
                    }
                ],
            }
        }


class IndexListResponse(BaseModel):
    """Response containing list of available indices"""

    indices: List[IndexInfo] = Field(..., description="List of available indices")

    class Config:
        json_schema_extra = {
            "example": {
                "indices": [
                    {
                        "code": "VNINDEX",
                        "name": "VN-INDEX",
                        "description": "Vietnam Stock Index - HoSE",
                    }
                ]
            }
        }


class ErrorResponse(BaseModel):
    """Error response"""

    detail: str = Field(..., description="Error message")
    error_code: Optional[str] = Field(None, description="Error code")

    class Config:
        json_schema_extra = {
            "example": {"detail": "Index not found", "error_code": "INDEX_NOT_FOUND"}
        }

from datetime import datetime
from typing import Optional, List
from enum import Enum

from pydantic import BaseModel, Field


class MarketType(str, Enum):
    STOCK = "stock"
    INDEX = "index"


class Period(str, Enum):
    D1 = "1d"
    D5 = "1w"
    M1 = "1mo"
    M3 = "3mo"
    M6 = "6mo"
    Y1 = "1y"


class MarketBase(BaseModel):
    """Base model for market entities"""

    symbol: str = Field(..., description="Symbol or index code")


class MarketInfo(MarketBase):
    """Information about a market entity"""

    description: Optional[str] = Field(None, description="Description")
    type: MarketType = Field(..., description="Market type")


class MarketQuote(MarketBase):
    """Current market quote"""

    price: float = Field(..., description="Current price")
    change_percent: float = Field(..., description="Percentage change")
    volume: Optional[int] = Field(None, description="Trading volume")


class HistoricalData(BaseModel):
    """OHLC historical data"""

    date: datetime = Field(..., description="Date")
    close: float = Field(..., description="Close price")
    volume: Optional[int] = Field(None, description="Trading volume")


class MarketHistoricalResponse(MarketBase):
    """Historical data response"""

    period: Period = Field(..., description="Data period")
    type: MarketType = Field(..., description="Market type")

    data: List[HistoricalData] = Field(
        ..., description="List of historical data points"
    )


class MarketListResponse(BaseModel):
    """List of market entities"""

    items: List[MarketInfo] = Field(..., description="List of market items")


class ErrorResponse(BaseModel):
    """Error response"""

    detail: str = Field(..., description="Error message")
    error_code: Optional[str] = Field(None, description="Error code")


class StockByExchange(BaseModel):
    symbol: str = Field(..., description="Stock symbol")
    exchange: str = Field(..., description="Exchange (HOSE, HNX, UPCOM)")
    name: Optional[str] = Field(None, description="Organization name")
    type: Optional[str] = Field(None, description="Type (stock, fund, warrant, etc.)")


class StockDetailResponse(BaseModel):
    symbol: str = Field(..., description="Stock symbol")
    exchange: str = Field(..., description="Exchange (HOSE, HNX, UPCOM, DELISTED)")
    type: Optional[str] = Field(None, description="Type (stock, fund, warrant, etc.)")
    sid: Optional[int] = Field(None, description="Internal exchange ID")
    organ_name: Optional[str] = Field(None, description="Full organization name")
    organ_short_name: Optional[str] = Field(None, description="Short organization name")
    en_organ_name: Optional[str] = Field(None, description="English organization name")
    en_organ_short_name: Optional[str] = Field(
        None, description="English short organization name"
    )
    product_grp_id: Optional[str] = Field(None, description="Product group ID")
    icb_code2: Optional[str] = Field(None, description="ICB Level 2 code")

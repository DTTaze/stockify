from datetime import datetime
from pydantic import BaseModel
from typing import List, Optional


class DataManagementStockItem(BaseModel):
    symbol: str
    last_updated: Optional[str] = None
    total_records: int
    status: str


class DataManagementSummaryResponse(BaseModel):
    total_stocks: int
    updated: int
    needs_update: int
    total_records: int


class DataManagementStocksResponse(BaseModel):
    stocks: List[DataManagementStockItem]


class DataUpdateResponse(BaseModel):
    symbol: str
    updated: bool
    message: Optional[str] = None
    last_updated: Optional[str] = None


class DataUpdateAllResponse(BaseModel):
    updated_count: int
    updated_symbols: List[str]
    message: Optional[str] = None

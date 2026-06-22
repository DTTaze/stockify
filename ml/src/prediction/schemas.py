from pydantic import BaseModel
from typing import Optional


class PredictionResponse(BaseModel):
    symbol: str
    current_price: Optional[float] = None
    tomorrow: Optional[float] = None
    tomorrow_confidence: Optional[int] = None
    day3: Optional[float] = None
    day3_confidence: Optional[int] = None
    day7: Optional[float] = None
    day7_confidence: Optional[int] = None
    day14: Optional[float] = None
    day14_confidence: Optional[int] = None
    metrics: Optional[dict] = None
    history_compare: Optional[list[dict]] = None



class SupportedSymbolsResponse(BaseModel):
    symbols: list[str]

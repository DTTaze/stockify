from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime


class ModelSummary(BaseModel):
    total_models: int
    active_models: int
    inactive_models: int
    total_versions: int
    failed_models: int


class ModelItem(BaseModel):
    id: str
    name: str
    version: str
    type: str
    status: str
    environment: str
    updated_at: str
    metrics: Optional[dict] = None
    training_info: Optional[dict] = None


class ModelDetail(BaseModel):
    id: str
    name: str
    version: str
    type: str
    status: str
    environment: str
    updated_at: str
    metadata: dict
    metrics: dict
    training_info: dict
    deploy_history: List[dict]


class ActionResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None


class ModelVersion(BaseModel):
    id: str
    version: str
    deployed_at: str
    status: str

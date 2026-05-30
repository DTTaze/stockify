from typing import List
from fastapi import APIRouter, BackgroundTasks

from .schemas import ModelSummary, ModelItem, ModelDetail, ActionResponse, ModelVersion
from .service import model_management_service

router = APIRouter(prefix="/api/v1/model-management", tags=["Model Management"])


@router.get("/summary", response_model=ModelSummary)
async def get_summary():
    """Get dashboard statistics for models"""
    return model_management_service.get_summary()


@router.get("/models", response_model=List[ModelItem])
async def get_models():
    """Get list of models"""
    return model_management_service.get_models()


@router.get("/models/{model_id}", response_model=ModelDetail)
async def get_model_detail(model_id: str):
    """Get detail of a specific model"""
    return model_management_service.get_model_detail(model_id)


@router.post("/deploy/{model_id}", response_model=ActionResponse)
async def deploy_model(model_id: str):
    """Deploy a model"""
    return model_management_service.deploy_model(model_id)


@router.post("/rollback/{model_id}", response_model=ActionResponse)
async def rollback_model(model_id: str):
    """Rollback a model to previous version"""
    return model_management_service.rollback_model(model_id)


@router.post("/restart/{model_id}", response_model=ActionResponse)
async def restart_model(model_id: str):
    """Restart a running model"""
    return model_management_service.restart_model(model_id)


@router.delete("/{model_id}", response_model=ActionResponse)
async def delete_model(model_id: str):
    """Delete a model"""
    return model_management_service.delete_model(model_id)


@router.get("/{model_id}/versions", response_model=List[ModelVersion])
async def get_model_versions(model_id: str):
    """Get all versions of a model"""
    return model_management_service.get_model_versions(model_id)


@router.post("/train/{symbol}", response_model=ActionResponse)
async def train_model(symbol: str, background_tasks: BackgroundTasks):
    """Start training a model for a specific symbol"""
    return model_management_service.train_model(symbol, background_tasks)

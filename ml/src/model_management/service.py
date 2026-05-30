import shutil
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any

from fastapi import HTTPException
from .schemas import ModelSummary, ModelItem, ModelDetail, ActionResponse
from ..utils.paths import MODELS_DIR


class ModelManagementService:

    def _get_model_path(self, model_id: str) -> Path:
        return MODELS_DIR / model_id / f"{model_id}_lstm_model.keras"

    def _get_all_model_ids(self) -> List[str]:
        model_ids = []
        if MODELS_DIR.exists():
            for d in MODELS_DIR.iterdir():
                if d.is_dir() and (d / f"{d.name}_lstm_model.keras").exists():
                    model_ids.append(d.name)
        return sorted(model_ids)

    def get_summary(self) -> ModelSummary:
        model_ids = self._get_all_model_ids()
        total = len(model_ids)

        return ModelSummary(
            total_models=total,
            active_models=total,
            inactive_models=0,
            total_versions=total,
            failed_models=0,
        )

    def get_models(self) -> List[ModelItem]:
        models = []
        model_ids = self._get_all_model_ids()

        for model_id in model_ids:
            model_path = self._get_model_path(model_id)
            updated_at = (
                datetime.fromtimestamp(model_path.stat().st_mtime).isoformat() + "Z"
            )

            models.append(
                ModelItem(
                    id=model_id,
                    name=f"{model_id} LSTM Predictor",
                    version="v1.0.0",
                    type="Time Series",
                    status="running",
                    environment="production",
                    updated_at=updated_at,
                )
            )
        return models

    def get_model_detail(self, model_id: str) -> ModelDetail:
        model_path = self._get_model_path(model_id)
        if not model_path.exists():
            raise HTTPException(status_code=404, detail="Model not found")

        stat = model_path.stat()
        updated_at = datetime.fromtimestamp(stat.st_mtime).isoformat() + "Z"
        file_size_mb = round(stat.st_size / (1024 * 1024), 2)

        return ModelDetail(
            id=model_id,
            name=f"{model_id} LSTM Predictor",
            version="v1.0.0",
            type="Time Series",
            status="running",
            environment="production",
            updated_at=updated_at,
            metadata={
                "description": f"LSTM model for {model_id} stock price prediction.",
                "author": "System",
            },
            metrics={},
            training_info={
                "last_trained": updated_at,
                "file_size": f"{file_size_mb}MB",
            },
            deploy_history=[
                {
                    "version": "v1.0.0",
                    "deployed_at": updated_at,
                    "environment": "production",
                    "status": "success",
                }
            ],
        )

    def deploy_model(self, model_id: str) -> ActionResponse:
        model_path = self._get_model_path(model_id)
        if not model_path.exists():
            raise HTTPException(status_code=404, detail="Model not found")

        return ActionResponse(
            success=True, message=f"Model {model_id} deployed successfully"
        )

    def rollback_model(self, model_id: str) -> ActionResponse:
        model_path = self._get_model_path(model_id)
        if not model_path.exists():
            raise HTTPException(status_code=404, detail="Model not found")

        return ActionResponse(success=False, message="Not enough versions to rollback")

    def restart_model(self, model_id: str) -> ActionResponse:
        model_path = self._get_model_path(model_id)
        if not model_path.exists():
            raise HTTPException(status_code=404, detail="Model not found")

        return ActionResponse(success=True, message=f"Model {model_id} restarted")

    def delete_model(self, model_id: str) -> ActionResponse:
        model_path = self._get_model_path(model_id)
        if not model_path.exists():
            raise HTTPException(status_code=404, detail="Model not found")

        # Actually delete the model directory
        model_dir = MODELS_DIR / model_id
        shutil.rmtree(model_dir)

        return ActionResponse(
            success=True, message=f"Model {model_id} deleted successfully"
        )

    def get_model_versions(self, model_id: str) -> List[dict]:
        model_path = self._get_model_path(model_id)
        if not model_path.exists():
            raise HTTPException(status_code=404, detail="Model not found")

        updated_at = (
            datetime.fromtimestamp(model_path.stat().st_mtime).isoformat() + "Z"
        )
        return [
            {
                "id": "v1",
                "version": "v1.0.0",
                "deployed_at": updated_at,
                "status": "active",
            }
        ]

    def train_model(self, symbol: str, background_tasks) -> ActionResponse:
        symbol = symbol.upper()
        from ..models.train import train_multi_stock_models

        background_tasks.add_task(train_multi_stock_models, [symbol])
        return ActionResponse(success=True, message=f"Training started for {symbol}")


model_management_service = ModelManagementService()

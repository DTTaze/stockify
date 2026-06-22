import numpy as np
import xgboost as xgb

def train_xgboost_model(X_train: np.ndarray, y_train: np.ndarray) -> xgb.XGBRegressor:
    """Train an XGBoost Regressor by flattening sequential data"""
    N, time_step, num_features = X_train.shape
    X_train_flat = X_train.reshape(N, -1)

    model = xgb.XGBRegressor(
        n_estimators=100,
        max_depth=6,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42
    )
    model.fit(X_train_flat, y_train.flatten())
    return model

import numpy as np
from sklearn.metrics import mean_squared_error, mean_absolute_error


def evaluate(y_true, y_pred):
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    mae = mean_absolute_error(y_true, y_pred)
    mape = np.mean(np.abs((y_true - y_pred) / y_true)) * 100

    return {"RMSE": rmse, "MAE": mae, "MAPE": mape}

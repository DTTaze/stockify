import numpy as np
import joblib
from tensorflow.keras.models import load_model

from ..utils.metrics import evaluate
from ..utils.visualization import plot_predictions
from ..utils.paths import PROCESSED_DATA_DIR, MODELS_DIR

X_test = np.load(PROCESSED_DATA_DIR / "X_test.npy")
y_test = np.load(PROCESSED_DATA_DIR / "y_test.npy")

scaler_y = joblib.load(PROCESSED_DATA_DIR / "scaler_y.pkl")


def run_prediction(model_path, X_test, y_test, scaler_y):
    model = load_model(model_path)

    predictions = model.predict(X_test)

    predictions = predictions.reshape(-1, 1)
    y_test = y_test.reshape(-1, 1)

    predictions = scaler_y.inverse_transform(predictions)
    y_test_real = scaler_y.inverse_transform(y_test)

    predictions = predictions.flatten()
    y_test_real = y_test_real.flatten()

    metrics = evaluate(y_test_real, predictions)
    print(metrics)

    plot_predictions(y_test_real, predictions)

    return predictions, metrics


run_prediction(MODELS_DIR / "lstm_model.keras", X_test, y_test, scaler_y)

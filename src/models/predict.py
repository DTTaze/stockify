import numpy as np
from tensorflow.keras.models import load_model
import joblib

from src.utils.metrics import evaluate
from src.utils.visualization import plot_predictions

X = np.load("data/processed/X.npy")
y = np.load("data/processed/y.npy")

scaler_y = joblib.load("data/processed/scaler_y.pkl")


train_size = int(len(X) * 0.8)
X_test = X[train_size:]
y_test = y[train_size:]


def run_prediction(model_path, X_test, y_test, scaler_y):
    model = load_model(model_path)

    predictions = model.predict(X_test)

    predictions = scaler_y.inverse_transform(predictions)
    y_test_real = scaler_y.inverse_transform(y_test)

    metrics = evaluate(y_test_real, predictions)
    print(metrics)

    plot_predictions(y_test_real, predictions)

    return predictions, metrics


run_prediction("saved_models/lstm_model.keras", X_test, y_test, scaler_y)

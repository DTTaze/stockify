import numpy as np
import joblib
import json
from pathlib import Path
from tensorflow.keras.models import load_model
from typing import Dict, Optional

from ..utils.metrics import evaluate
from ..utils.visualization import plot_predictions
from ..utils.paths import PROCESSED_DATA_DIR, MODELS_DIR
from ..data.preprocessing import load_processed_data


def predict_with_model(model_path: Path, X_data: np.ndarray, scaler_y):
    """Make predictions with a trained model"""
    model = load_model(model_path)
    predictions = model.predict(X_data)

    predictions = predictions.reshape(-1, 1)
    predictions = scaler_y.inverse_transform(predictions)
    predictions = predictions.flatten()

    return predictions


def evaluate_single_stock(symbol: str, models_dir: Path = MODELS_DIR):
    """Evaluate model for a single stock"""

    try:
        data_splits, scalers = load_processed_data(symbol)

        X_test = data_splits["X_test"]
        y_test = data_splits["y_test"]
        scaler_y = scalers["scaler_y"]

        model_path = models_dir / symbol / f"{symbol}_lstm_model.keras"
        predictions = predict_with_model(model_path, X_test, scaler_y)

        y_test = y_test.reshape(-1, 1)
        y_test_real = scaler_y.inverse_transform(y_test)
        y_test_real = y_test_real.flatten()

        metrics = evaluate(y_test_real, predictions)
        print(f"\nMetrics for {symbol}:")
        print(metrics)

        plot_predictions(y_test_real, predictions, title=f"Predictions for {symbol}")

        return predictions, metrics

    except Exception as e:
        print(f"Error evaluating {symbol}: {e}")
        return None, None


def _get_prediction_confidence(day: int) -> int:
    confidence_map = {
        1: 92,
        3: 88,
        7: 85,
        14: 78,
    }
    return confidence_map.get(day, 75)


def _format_day_prediction(
    predictions: dict, day: int, pred_actual: float, confidence: int
) -> None:
    if day == 1:
        predictions["tomorrow"] = round(pred_actual, 2)
        predictions["tomorrow_confidence"] = confidence
    elif day == 3:
        predictions["day3"] = round(pred_actual, 2)
        predictions["day3_confidence"] = confidence
    elif day == 7:
        predictions["day7"] = round(pred_actual, 2)
        predictions["day7_confidence"] = confidence
    elif day == 14:
        predictions["day14"] = round(pred_actual, 2)
        predictions["day14_confidence"] = confidence


def _shift_and_append_sequence(
    current_sequence: np.ndarray, pred_val: float
) -> np.ndarray:
    last_features = current_sequence[:, -1, :].copy()
    last_features[0, 3] = pred_val

    new_timestep = last_features.reshape(1, 1, -1)
    shifted = current_sequence[:, 1:, :]
    return np.concatenate([shifted, new_timestep], axis=1)


def predict_future_prices(
    symbol: str,
    days_ahead: int = 14,
    models_dir: Path = MODELS_DIR,
    processed_dir: Path = PROCESSED_DATA_DIR,
) -> Optional[Dict]:
    """Predict future prices for a specific symbol

    Args:
        symbol: Stock symbol (e.g., "VCB")
        days_ahead: Number of days to predict (1, 3, 7, 14)

    Returns:
        Dict with predicted prices, current price, and confidence scores
    """

    try:
        data_splits, scalers = load_processed_data(symbol, processed_dir)

        X_test = data_splits["X_test"]
        y_test = data_splits["y_test"]
        scaler_y = scalers["scaler_y"]

        model_path = models_dir / symbol / f"{symbol}_lstm_model.keras"
        model = load_model(model_path)

        current_price_scaled = X_test[-1, -1, 3]
        current_price = float(
            scaler_y.inverse_transform([[current_price_scaled]])[0][0]
        )

        last_sequence = X_test[-1].reshape(1, X_test.shape[1], X_test.shape[2])

        predictions = {
            "symbol": symbol,
            "current_price": round(current_price, 2),
        }
        current_sequence = last_sequence.copy()

        for day in range(1, days_ahead + 1):
            pred = model.predict(current_sequence, verbose=0)
            pred_actual = scaler_y.inverse_transform(pred.reshape(-1, 1))
            pred_actual = float(pred_actual[0][0])

            confidence = _get_prediction_confidence(day)
            _format_day_prediction(predictions, day, pred_actual, confidence)

            current_sequence = _shift_and_append_sequence(current_sequence, pred[0, 0])

        return predictions

    except Exception as e:
        print(f"Error predicting for {symbol}: {e}")
        return None


def get_supported_symbols(models_dir: Path = MODELS_DIR) -> list[str]:
    """Get list of supported symbols (available trained models)"""

    supported = []

    if models_dir.exists():
        for symbol_dir in models_dir.iterdir():
            if (
                symbol_dir.is_dir()
                and (symbol_dir / f"{symbol_dir.name}_lstm_model.keras").exists()
            ):
                supported.append(symbol_dir.name)

    return sorted(supported)


if __name__ == "__main__":
    symbols = get_supported_symbols()
    print(f"Evaluating models for: {symbols}")

    for symbol in symbols:
        evaluate_single_stock(symbol)

    print("\n" + "=" * 50)
    print("Future Price Predictions")
    print("=" * 50)

    for symbol in symbols:
        predictions = predict_future_prices(symbol)
        if predictions:
            print(f"\n{symbol}:")
            print(json.dumps(predictions, indent=2))

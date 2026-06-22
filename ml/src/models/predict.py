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
    if model_path.suffix == ".joblib":
        model = joblib.load(model_path)
        N, time_step, num_features = X_data.shape
        X_data_flat = X_data.reshape(N, -1)
        predictions = model.predict(X_data_flat)
    else:
        model = load_model(model_path)
        predictions = model.predict(X_data)

    predictions = predictions.reshape(-1, 1)
    predictions = scaler_y.inverse_transform(predictions)
    predictions = predictions.flatten()

    return predictions


def evaluate_single_stock(symbol: str, model_type: str = "lstm", models_dir: Path = MODELS_DIR):
    """Evaluate model for a single stock"""

    try:
        data_splits, scalers = load_processed_data(symbol)

        X_test = data_splits["X_test"]
        y_test = data_splits["y_test"]
        scaler_y = scalers["scaler_y"]

        if model_type == "xgboost":
            model_path = models_dir / symbol / f"{symbol}_xgboost_model.joblib"
        elif model_type == "transformer":
            model_path = models_dir / symbol / f"{symbol}_transformer_model.keras"
        else:
            model_path = models_dir / symbol / f"{symbol}_lstm_model.keras"

        predictions = predict_with_model(model_path, X_test, scaler_y)

        y_test = y_test.reshape(-1, 1)
        y_test_real = scaler_y.inverse_transform(y_test)
        y_test_real = y_test_real.flatten()

        metrics = evaluate(y_test_real, predictions)
        print(f"\nMetrics for {symbol} ({model_type}):")
        print(metrics)

        plot_predictions(y_test_real, predictions, title=f"Predictions for {symbol} ({model_type})")

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
    model_type: str = "best",
    models_dir: Path = MODELS_DIR,
    processed_dir: Path = PROCESSED_DATA_DIR,
) -> Optional[Dict]:
    """Predict future prices for a specific symbol

    Args:
        symbol: Stock symbol (e.g., "VCB")
        days_ahead: Number of days to predict (1, 3, 7, 14)
        model_type: Model architecture to use ("best", "lstm", "gru", "linear")

    Returns:
        Dict with predicted prices, current price, and confidence scores
    """

    try:
        data_splits, scalers = load_processed_data(symbol, processed_dir)

        X_test = data_splits["X_test"]
        y_test = data_splits["y_test"]
        scaler_y = scalers["scaler_y"]

        resolved_model_type = model_type
        if model_type == "best":
            lstm_path = models_dir / symbol / f"{symbol}_lstm_model.keras"
            xgboost_path = models_dir / symbol / f"{symbol}_xgboost_model.joblib"
            transformer_path = models_dir / symbol / f"{symbol}_transformer_model.keras"
            
            # Find which models actually exist
            available_models = []
            if lstm_path.exists():
                available_models.append("lstm")
            if xgboost_path.exists():
                available_models.append("xgboost")
            if transformer_path.exists():
                available_models.append("transformer")
                
            if not available_models:
                # Fallback if no models are trained yet
                resolved_model_type = "lstm"
            elif len(available_models) == 1:
                resolved_model_type = available_models[0]
            else:
                meta_path = models_dir / symbol / "metadata.json"
                best_type = available_models[0]
                if meta_path.exists():
                    try:
                        with open(meta_path, "r", encoding="utf-8") as f:
                            meta = json.load(f)
                        metrics = meta.get("metrics", {})
                        
                        best_acc = -1.0
                        for m_name in available_models:
                            acc = metrics.get(m_name, {}).get("accuracy", 0.0)
                            if m_name == "lstm" and acc == 0.0:
                                acc = metrics.get("accuracy", 0.0)
                                
                            if acc > best_acc:
                                best_acc = acc
                                best_type = m_name
                    except Exception as e:
                        print(f"Error reading metadata to determine best model: {e}")
                resolved_model_type = best_type
        
        # Now load the resolved model path
        if resolved_model_type == "xgboost":
            model_path = models_dir / symbol / f"{symbol}_xgboost_model.joblib"
            if not model_path.exists():
                print(f"Warning: {model_path} not found. Falling back to LSTM.")
                resolved_model_type = "lstm"
                model_path = models_dir / symbol / f"{symbol}_lstm_model.keras"
        elif resolved_model_type == "transformer":
            model_path = models_dir / symbol / f"{symbol}_transformer_model.keras"
            if not model_path.exists():
                print(f"Warning: {model_path} not found. Falling back to LSTM.")
                resolved_model_type = "lstm"
                model_path = models_dir / symbol / f"{symbol}_lstm_model.keras"
        else:
            model_path = models_dir / symbol / f"{symbol}_lstm_model.keras"
            resolved_model_type = "lstm"

        if resolved_model_type == "xgboost":
            model = joblib.load(model_path)
        else:
            model = load_model(model_path)

        current_price_scaled = X_test[-1, -1, 3]
        current_price = float(
            scaler_y.inverse_transform([[current_price_scaled]])[0][0]
        )

        # Generate predictions on the test set to show historical performance comparison
        test_predictions = predict_with_model(model_path, X_test, scaler_y)
        y_test_real = scaler_y.inverse_transform(y_test.reshape(-1, 1)).flatten()

        # Load raw data to align dates for test set
        from ..data.preprocessing import load_data, feature_engineering, split_data
        from ..utils.paths import RAW_DATA_DIR
        import pandas as pd
        
        raw_path = RAW_DATA_DIR / f"{symbol}.csv"
        df = None
        if raw_path.exists():
            try:
                df = load_data(raw_path)
            except Exception as e:
                print(f"Error loading raw CSV: {e}")
                
        if df is None:
            # Fallback: load from vnstock
            try:
                from vnstock import Quote
                quote = Quote(symbol=symbol, source="VCI")
                df = quote.history(start="2020-01-01", end=None, interval="1D")
                if df is not None and not df.empty:
                    df["Date"] = pd.to_datetime(df["time"])
                    df = df.rename(
                        columns={
                            "open": "Open",
                            "high": "High",
                            "low": "Low",
                            "close": "Close",
                            "volume": "Volume",
                        }
                    )
                    df = (
                        df[["Date", "Open", "High", "Low", "Close", "Volume"]]
                        .sort_values("Date")
                        .reset_index(drop=True)
                    )
                    
                    # Cache to raw CSV for future usage
                    RAW_DATA_DIR.mkdir(parents=True, exist_ok=True)
                    dummy_row = pd.DataFrame([{"Date": "2000-01-01", "Open": 0, "High": 0, "Low": 0, "Close": 0, "Volume": 0}])
                    df_to_save = df[["Date", "Open", "High", "Low", "Close", "Volume"]].copy()
                    df_to_save["Date"] = df_to_save["Date"].dt.strftime("%Y-%m-%d")
                    csv_df = pd.concat([dummy_row, df_to_save], ignore_index=True)
                    csv_df.to_csv(raw_path, index=False)
                    print(f"Successfully crawled and cached raw data for {symbol} to {raw_path}")
            except Exception as e:
                print(f"Error loading from vnstock fallback: {e}")

        test_dates = []
        if df is not None:
            try:
                df_engineered = feature_engineering(df)
                _, _, test_df = split_data(df_engineered)
                test_dates = test_df.iloc[20:]["Date"].dt.strftime("%Y-%m-%d").tolist()
            except Exception as e:
                print(f"Error processing engineering or split on raw df: {e}")

        if not test_dates:
            test_dates = [f"Day {i}" for i in range(len(test_predictions))]


        # Align lengths in case of any size mismatch
        min_len = min(len(test_dates), len(test_predictions), len(y_test_real))
        compare_dates = test_dates[-min_len:]
        compare_actuals = y_test_real[-min_len:]
        compare_preds = test_predictions[-min_len:]
        
        history_compare = []
        num_compare = min(15, min_len)
        if num_compare > 0:
            for i in range(-num_compare, 0):
                history_compare.append({
                    "date": compare_dates[i],
                    "actual": round(float(compare_actuals[i]), 2),
                    "predicted": round(float(compare_preds[i]), 2)
                })

        # Load model metrics from metadata.json
        metrics_dict = None
        meta_path = models_dir / symbol / "metadata.json"
        if meta_path.exists():
            try:
                with open(meta_path, "r", encoding="utf-8") as f:
                    meta = json.load(f)
                all_metrics = meta.get("metrics", {})
                metrics_dict = all_metrics.get(resolved_model_type)
                # Fallback to general metrics if model-specific metrics not found
                if not metrics_dict and resolved_model_type == "lstm":
                    metrics_dict = {
                        "accuracy": all_metrics.get("accuracy"),
                        "rmse": all_metrics.get("rmse"),
                        "mae": all_metrics.get("mae"),
                        "mape": all_metrics.get("mape"),
                    }
            except Exception as e:
                print(f"Error reading metadata metrics: {e}")

        # Get dynamic confidence from metrics_dict if available
        horizon_conf = {}
        if metrics_dict and isinstance(metrics_dict, dict):
            horizon_conf = metrics_dict.get("horizon_confidence", {})
            
        def _get_dynamic_confidence(day_idx: int) -> int:
            val = horizon_conf.get(str(day_idx))
            if val is not None:
                return int(round(float(val)))
            return _get_prediction_confidence(day_idx)

        last_sequence = X_test[-1].reshape(1, X_test.shape[1], X_test.shape[2])

        predictions = {
            "symbol": symbol,
            "current_price": round(current_price, 2),
            "metrics": metrics_dict,
            "history_compare": history_compare,
        }
        current_sequence = last_sequence.copy()

        for day in range(1, days_ahead + 1):
            if resolved_model_type == "xgboost":
                N, time_step, num_features = current_sequence.shape
                flat_seq = current_sequence.reshape(N, -1)
                pred = model.predict(flat_seq)
                pred = pred.reshape(1, 1)
            else:
                pred = model.predict(current_sequence, verbose=0)
                
            pred_val = float(pred[0][0])
            pred_actual = scaler_y.inverse_transform(pred.reshape(-1, 1))
            pred_actual = float(pred_actual[0][0])

            confidence = _get_dynamic_confidence(day)
            _format_day_prediction(predictions, day, pred_actual, confidence)

            current_sequence = _shift_and_append_sequence(current_sequence, pred_val)

        return predictions


    except Exception as e:
        print(f"Error predicting for {symbol} ({model_type}): {e}")
        return None


def get_supported_symbols(models_dir: Path = MODELS_DIR) -> list[str]:
    """Get list of supported symbols (available trained models)"""

    supported = []

    if models_dir.exists():
        for symbol_dir in models_dir.iterdir():
            if symbol_dir.is_dir() and (
                (symbol_dir / f"{symbol_dir.name}_lstm_model.keras").exists() or
                (symbol_dir / f"{symbol_dir.name}_transformer_model.keras").exists() or
                (symbol_dir / f"{symbol_dir.name}_xgboost_model.joblib").exists()
            ):
                supported.append(symbol_dir.name)

    return sorted(supported)


if __name__ == "__main__":
    symbols = get_supported_symbols()
    print(f"Evaluating models for: {symbols}")

    for symbol in symbols:
        evaluate_single_stock(symbol, "lstm")
        evaluate_single_stock(symbol, "gru")
        evaluate_single_stock(symbol, "linear")

    print("\n" + "=" * 50)
    print("Future Price Predictions")
    print("=" * 50)

    for symbol in symbols:
        for model_type in ["lstm", "xgboost", "transformer"]:
            predictions = predict_future_prices(symbol, model_type=model_type)
            if predictions:
                print(f"\n{symbol} ({model_type}):")
                print(json.dumps(predictions, indent=2))

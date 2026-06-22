import numpy as np
import joblib
from tensorflow.keras.callbacks import EarlyStopping
from pathlib import Path
from .lstm_model import build_lstm_model
from .transformer_model import build_transformer_model
from .xgboost_model import train_xgboost_model
from ..utils.paths import PROCESSED_DATA_DIR, MODELS_DIR
from ..data.preprocessing import (
    load_multi_stock_data,
    process_single_stock,
    save_processed_data,
    load_processed_data,
)
from ..vn_stock.config import vn_stock_config

DEFAULT_SYMBOLS = vn_stock_config.supported_symbols


def train_single_stock_model(
    symbol: str, data_splits: dict, model_dir: Path = MODELS_DIR, epochs: int = 40
):
    """Train LSTM, Transformer, and XGBoost models for a single stock"""

    X_train = data_splits["X_train"]
    X_val = data_splits["X_val"]
    y_train = data_splits["y_train"]
    y_val = data_splits["y_val"]

    print(f"\nTraining models for {symbol}")
    print(f"X_train shape: {X_train.shape}")
    print(f"y_train shape: {y_train.shape}")

    symbol_model_dir = model_dir / symbol
    symbol_model_dir.mkdir(exist_ok=True, parents=True)

    # 1. Train & Save LSTM
    print(f"--- Training LSTM Model for {symbol} ---")
    lstm_model = build_lstm_model(input_shape=(X_train.shape[1], X_train.shape[2]))
    lstm_model.summary()

    early_stop = EarlyStopping(
        monitor="val_loss", patience=5, restore_best_weights=True
    )

    history = lstm_model.fit(
        X_train,
        y_train,
        epochs=epochs,
        batch_size=32,
        validation_data=(X_val, y_val),
        callbacks=[early_stop],
    )

    lstm_model_path = symbol_model_dir / f"{symbol}_lstm_model.keras"
    lstm_model.save(lstm_model_path)
    print(f"LSTM model saved to {lstm_model_path}")

    # 2. Train & Save Transformer
    print(f"--- Training Transformer Model for {symbol} ---")
    transformer_model = build_transformer_model(input_shape=(X_train.shape[1], X_train.shape[2]))
    transformer_model.fit(
        X_train,
        y_train,
        epochs=epochs,
        batch_size=32,
        validation_data=(X_val, y_val),
        callbacks=[early_stop],
    )

    transformer_model_path = symbol_model_dir / f"{symbol}_transformer_model.keras"
    transformer_model.save(transformer_model_path)
    print(f"Transformer model saved to {transformer_model_path}")

    # 3. Train & Save XGBoost
    print(f"--- Training XGBoost Model for {symbol} ---")
    xgboost_model = train_xgboost_model(X_train, y_train)
    xgboost_model_path = symbol_model_dir / f"{symbol}_xgboost_model.joblib"
    joblib.dump(xgboost_model, xgboost_model_path)
    print(f"XGBoost model saved to {xgboost_model_path}")

    return lstm_model, history


def train_multi_stock_models(symbols: list[str] = None, epochs: int = 40):
    """Train models for multiple stocks"""

    if symbols is None:
        symbols = DEFAULT_SYMBOLS

    print(f"Starting multi-stock training for: {symbols}")

    stock_data = load_multi_stock_data(symbols)

    if not stock_data:
        print("No data loaded from vnstock, using local files if available")
        return

    models = {}
    histories = {}

    for symbol in stock_data.keys():
        try:
            print(f"\n{'='*50}")
            print(f"Processing {symbol}")
            print(f"{'='*50}")

            df = stock_data[symbol]

            data_splits, scalers = process_single_stock(symbol, df)

            save_processed_data(symbol, data_splits, scalers)

            model, history = train_single_stock_model(symbol, data_splits, epochs=epochs)
            models[symbol] = model
            histories[symbol] = history

        except Exception as e:
            print(f"Error processing {symbol}: {e}")
            continue

    print("\nTraining completed!")
    return models, histories


def train_with_local_data(csv_path: str, symbol: str):
    """Train a model using local CSV data (backward compatibility)"""
    from ..data.preprocessing import load_data

    df = load_data(csv_path)
    data_splits, scalers = process_single_stock(symbol, df)
    save_processed_data(symbol, data_splits, scalers)
    model, history = train_single_stock_model(symbol, data_splits)

    return model, history


if __name__ == "__main__":
    train_multi_stock_models()

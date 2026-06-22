import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import joblib
from pathlib import Path
from typing import Dict, Tuple, Optional, List
from ..utils.paths import RAW_DATA_DIR, PROCESSED_DATA_DIR

FEATURE_COLS: List[str] = [
    "Open",
    "High",
    "Low",
    "Close",
    "Volume",
    "MA10",
    "MA20",
    "MA50",
    "Volatility",
    "Volume_Change",
    "RSI",
    "MACD",
    "MACD_Signal",
    "BB_Upper",
    "BB_Lower",
    "BB_Pct",
    "ATR",
    "Close_to_MA10",
    "Close_to_MA20",
    "Close_to_MA50",
    "Volume_to_MA10",
]

TARGET_COL: List[str] = ["Close"]


def load_data(path: Path) -> pd.DataFrame:
    df = pd.read_csv(path, skiprows=[1])
    df["Date"] = pd.to_datetime(df["Date"])
    df = df.sort_values("Date")
    return df


def load_multi_stock_data(symbols: List[str]) -> Dict[str, pd.DataFrame]:
    """Load data for multiple stocks from vnstock API or local files"""
    data: Dict[str, pd.DataFrame] = {}

    try:
        from vnstock import Quote

        for symbol in symbols:
            try:
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

                    data[symbol] = df

            except Exception as e:
                print(f"Error loading {symbol}: {e}")
                continue

    except ImportError:
        print("vnstock not installed, trying local CSV files")

    return data


def feature_engineering(df: pd.DataFrame) -> pd.DataFrame:
    if len(df) < 50:
        raise ValueError(
            f"Input DataFrame is too small ({len(df)} rows). "
            "At least 50 rows are required to calculate technical indicators such as MA50."
        )

    df = df.copy()

    # Moving Averages
    df["MA10"] = df["Close"].rolling(10).mean()
    df["MA20"] = df["Close"].rolling(20).mean()
    df["MA50"] = df["Close"].rolling(50).mean()

    # Volatility & Returns
    df["Return"] = df["Close"].pct_change()
    df["Volatility"] = df["Close"].rolling(10).std()
    df["Volume_Change"] = df["Volume"].pct_change()

    # 1. RSI (Relative Strength Index, 14-day window)
    delta = df["Close"].diff()
    gain = delta.clip(lower=0)
    loss = -delta.clip(upper=0)
    avg_gain = gain.ewm(com=13, adjust=False).mean()
    avg_loss = loss.ewm(com=13, adjust=False).mean()
    rs = avg_gain / (avg_loss + 1e-9)
    df["RSI"] = 100 - (100 / (1 + rs))

    # 2. MACD & Signal Line (12, 26, 9 span)
    exp1 = df["Close"].ewm(span=12, adjust=False).mean()
    exp2 = df["Close"].ewm(span=26, adjust=False).mean()
    df["MACD"] = exp1 - exp2
    df["MACD_Signal"] = df["MACD"].ewm(span=9, adjust=False).mean()

    # 3. Bollinger Bands (20-day window, 2 standard deviations)
    bb_std = df["Close"].rolling(20).std()
    df["BB_Upper"] = df["MA20"] + (2.0 * bb_std)
    df["BB_Lower"] = df["MA20"] - (2.0 * bb_std)
    df["BB_Pct"] = (df["Close"] - df["BB_Lower"]) / (df["BB_Upper"] - df["BB_Lower"] + 1e-9)

    # 4. ATR (Average True Range, 14-day window)
    high_low = df["High"] - df["Low"]
    high_cp = (df["High"] - df["Close"].shift()).abs()
    low_cp = (df["Low"] - df["Close"].shift()).abs()
    tr = pd.concat([high_low, high_cp, low_cp], axis=1).max(axis=1)
    df["ATR"] = tr.ewm(alpha=1/14, adjust=False).mean()

    # 5. Price to MA ratios
    df["Close_to_MA10"] = df["Close"] / (df["MA10"] + 1e-9)
    df["Close_to_MA20"] = df["Close"] / (df["MA20"] + 1e-9)
    df["Close_to_MA50"] = df["Close"] / (df["MA50"] + 1e-9)

    # 6. Volume to MA ratio
    volume_ma10 = df["Volume"].rolling(10).mean()
    df["Volume_to_MA10"] = df["Volume"] / (volume_ma10 + 1e-9)

    df = df.replace([np.inf, -np.inf], np.nan)
    df = df.dropna()
    return df


def split_data(
    df: pd.DataFrame,
    train_ratio: float = 0.9,
    val_ratio: float = 0.05,
) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:

    total_len: int = len(df)

    train_end: int = int(total_len * train_ratio)
    val_end: int = int(total_len * (train_ratio + val_ratio))

    train_df = df.iloc[:train_end].reset_index(drop=True)
    val_df = df.iloc[train_end:val_end].reset_index(drop=True)
    test_df = df.iloc[val_end:].reset_index(drop=True)

    return train_df, val_df, test_df


def scale_data(
    train_df: pd.DataFrame,
    val_df: pd.DataFrame,
    test_df: pd.DataFrame,
) -> Tuple[
    np.ndarray,
    np.ndarray,
    np.ndarray,
    np.ndarray,
    np.ndarray,
    np.ndarray,
    MinMaxScaler,
    MinMaxScaler,
]:

    scaler_X = MinMaxScaler()
    scaler_y = MinMaxScaler()

    X_train = scaler_X.fit_transform(train_df[FEATURE_COLS])
    X_val = scaler_X.transform(val_df[FEATURE_COLS])
    X_test = scaler_X.transform(test_df[FEATURE_COLS])

    y_train = scaler_y.fit_transform(train_df[TARGET_COL])
    y_val = scaler_y.transform(val_df[TARGET_COL])
    y_test = scaler_y.transform(test_df[TARGET_COL])

    return X_train, X_val, X_test, y_train, y_val, y_test, scaler_X, scaler_y


def create_dataset(
    X: np.ndarray,
    y: np.ndarray,
    time_step: int = 20,
) -> Tuple[np.ndarray, np.ndarray]:

    Xs, ys = [], []

    for i in range(len(X) - time_step):
        Xs.append(X[i : i + time_step])
        ys.append(y[i + time_step])

    return np.array(Xs), np.array(ys)


def process_single_stock(
    symbol: str,
    df: pd.DataFrame,
    time_step: int = 20,
) -> Tuple[Dict[str, np.ndarray], Dict[str, MinMaxScaler]]:
    """Process single stock data"""

    df = feature_engineering(df)

    train_df, val_df, test_df = split_data(df)

    X_train, X_val, X_test, y_train, y_val, y_test, scaler_X, scaler_y = scale_data(
        train_df, val_df, test_df
    )

    X_train_seq, y_train_seq = create_dataset(X_train, y_train, time_step)
    X_val_seq, y_val_seq = create_dataset(X_val, y_val, time_step)
    X_test_seq, y_test_seq = create_dataset(X_test, y_test, time_step)

    data_splits: Dict[str, np.ndarray] = {
        "X_train": X_train_seq,
        "X_val": X_val_seq,
        "X_test": X_test_seq,
        "y_train": y_train_seq,
        "y_val": y_val_seq,
        "y_test": y_test_seq,
    }

    scalers: Dict[str, MinMaxScaler] = {
        "scaler_X": scaler_X,
        "scaler_y": scaler_y,
    }

    return data_splits, scalers


def save_processed_data(
    symbol: str,
    data_splits: Dict[str, np.ndarray],
    scalers: Dict[str, MinMaxScaler],
    output_dir: Path = PROCESSED_DATA_DIR,
) -> None:
    """Save processed data"""

    symbol_dir = output_dir / symbol
    symbol_dir.mkdir(exist_ok=True, parents=True)

    for key, array in data_splits.items():
        np.save(symbol_dir / f"{key}.npy", array)

    for key, scaler in scalers.items():
        joblib.dump(scaler, symbol_dir / f"{key}.pkl")


def load_processed_data(
    symbol: str,
    input_dir: Path = PROCESSED_DATA_DIR,
) -> Tuple[Dict[str, np.ndarray], Dict[str, MinMaxScaler]]:
    """Load processed data"""

    symbol_dir = input_dir / symbol

    data_splits: Dict[str, np.ndarray] = {}
    for key in ["X_train", "X_val", "X_test", "y_train", "y_val", "y_test"]:
        data_splits[key] = np.load(symbol_dir / f"{key}.npy")

    scalers: Dict[str, MinMaxScaler] = {}
    for key in ["scaler_X", "scaler_y"]:
        scalers[key] = joblib.load(symbol_dir / f"{key}.pkl")

    return data_splits, scalers

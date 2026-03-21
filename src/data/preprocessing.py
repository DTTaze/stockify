import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import joblib


def load_data(path):
    df = pd.read_csv(path, skiprows=[1])
    df["Date"] = pd.to_datetime(df["Date"])
    df = df.sort_values("Date")
    return df


def feature_engineering(df):
    df["MA10"] = df["Close"].rolling(10).mean()
    df["MA20"] = df["Close"].rolling(20).mean()
    df["MA50"] = df["Close"].rolling(50).mean()

    df["Return"] = df["Close"].pct_change()
    df["Volatility"] = df["Close"].rolling(10).std()
    df["Volume_Change"] = df["Volume"].pct_change()

    df = df.dropna()
    return df


def split_data(df, train_ratio=0.7, val_ratio=0.1):
    total_len = len(df)

    train_end = int(total_len * train_ratio)
    val_end = int(total_len * (train_ratio + val_ratio))

    train_df = df.iloc[:train_end]
    val_df = df.iloc[train_end:val_end]
    test_df = df.iloc[val_end:]

    return train_df, val_df, test_df


def scale_data(train_df, val_df, test_df):
    feature_cols = [
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
    ]

    target_col = ["Close"]  

    scaler_X = MinMaxScaler()
    scaler_y = MinMaxScaler()

    X_train = scaler_X.fit_transform(train_df[feature_cols])
    X_val = scaler_X.transform(val_df[feature_cols])
    X_test = scaler_X.transform(test_df[feature_cols])

    y_train = scaler_y.fit_transform(train_df[target_col])
    y_val = scaler_y.transform(val_df[target_col])
    y_test = scaler_y.transform(test_df[target_col])

    return X_train, X_val, X_test, y_train, y_val, y_test, scaler_X, scaler_y


def create_dataset(X, y, time_step=20): 
    Xs, ys = [], []

    for i in range(len(X) - time_step):
        Xs.append(X[i : i + time_step])
        ys.append(y[i + time_step])

    return np.array(Xs), np.array(ys)


if __name__ == "__main__":
    df = load_data("data/raw/stock_data.csv")
    df = feature_engineering(df)

    train_df, val_df, test_df = split_data(df)

    X_train, X_val, X_test, y_train, y_val, y_test, scaler_X, scaler_y = scale_data(
        train_df, val_df, test_df
    )

    X_train, y_train = create_dataset(X_train, y_train)
    X_val, y_val = create_dataset(X_val, y_val)
    X_test, y_test = create_dataset(X_test, y_test)

    np.save("data/processed/X_train.npy", X_train)
    np.save("data/processed/X_val.npy", X_val)
    np.save("data/processed/X_test.npy", X_test)

    np.save("data/processed/y_train.npy", y_train)
    np.save("data/processed/y_val.npy", y_val)
    np.save("data/processed/y_test.npy", y_test)

    joblib.dump(scaler_X, "data/processed/scaler_X.pkl")
    joblib.dump(scaler_y, "data/processed/scaler_y.pkl")
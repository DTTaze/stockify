import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import joblib


def load_data(path):
    return pd.read_csv(path)


def preprocess_data(df):
    df = df.dropna()
    df = df.sort_values("Date")
    df["Date"] = pd.to_datetime(df["Date"])

    features = df[["Open", "High", "Low", "Close", "Volume"]].values
    target = df[["Close"]].values

    scaler_X = MinMaxScaler(feature_range=(0, 1))
    scaler_y = MinMaxScaler(feature_range=(0, 1))

    X_scaled = scaler_X.fit_transform(features)
    y_scaled = scaler_y.fit_transform(target)

    return X_scaled, y_scaled, scaler_X, scaler_y


def create_dataset(X, y, time_step=30):
    Xs, ys = [], []

    for i in range(len(X) - time_step):
        Xs.append(X[i : i + time_step])
        ys.append(y[i + time_step])

    return np.array(Xs), np.array(ys)


if __name__ == "__main__":
    df = load_data("data/raw/stock_data.csv")

    X_scaled, y_scaled, scaler_X, scaler_y = preprocess_data(df)

    X, y = create_dataset(X_scaled, y_scaled, time_step=30)

    np.save("data/processed/X.npy", X)
    np.save("data/processed/y.npy", y)

    joblib.dump(scaler_X, "data/processed/scaler_X.pkl")
    joblib.dump(scaler_y, "data/processed/scaler_y.pkl")

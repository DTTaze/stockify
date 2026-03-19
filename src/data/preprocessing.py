import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler


def load_data(path):
    return pd.read_csv(path)


def preprocess_data(df):

    df = df.dropna()

    df = df.sort_values("Date")

    df["Date"] = pd.to_datetime(df["Date"])

    df = df[["Open", "High", "Low", "Close", "Volume"]]

    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(df)

    return scaled_data, scaler


if __name__ == "__main__":

    df = load_data("data/raw/stock_data.csv")

    scaled_data, scaler = preprocess_data(df)

    np.save("data/processed/scaled_data.npy", scaled_data)

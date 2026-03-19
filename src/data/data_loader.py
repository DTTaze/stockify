import yfinance as yf
import pandas as pd


def download_stock_data(symbol, start, end):

    data = yf.download(symbol, start=start, end=end)

    data.reset_index(inplace=True)

    data = data[["Date", "Open", "High", "Low", "Close", "Volume"]]

    return data


def save_data(data, path):
    data.to_csv(path, index=False)


if __name__ == "__main__":

    symbol = "AAPL"

    data = download_stock_data(symbol, "2020-01-01", "2026-3-19")

    save_data(data, "data/raw/stock_data.csv")

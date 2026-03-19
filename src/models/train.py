import numpy as np
from src.models.lstm_model import build_lstm_model
from src.models.predict import run_prediction
import joblib

X = np.load("data/processed/X.npy")
y = np.load("data/processed/y.npy")

scaler_y = joblib.load("data/processed/scaler_y.pkl")


train_size = int(len(X) * 0.8)

X_train = X[:train_size]
X_test = X[train_size:]

y_train = y[:train_size]
y_test = y[train_size:]


model = build_lstm_model(input_shape=(X.shape[1], X.shape[2]))
model.summary()


history = model.fit(
    X_train, y_train, epochs=20, batch_size=32, validation_data=(X_test, y_test)
)


model.save("saved_models/lstm_model.keras")


run_prediction("saved_models/lstm_model.keras", X_test, y_test, scaler_y)

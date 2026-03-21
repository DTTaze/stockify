import numpy as np
from tensorflow.keras.callbacks import EarlyStopping
from src.models.lstm_model import build_lstm_model


X_train = np.load("data/processed/X_train.npy")
X_val = np.load("data/processed/X_val.npy")

y_train = np.load("data/processed/y_train.npy")
y_val = np.load("data/processed/y_val.npy")


model = build_lstm_model(input_shape=(X_train.shape[1], X_train.shape[2]))
model.summary()

early_stop = EarlyStopping(
    monitor="val_loss",
    patience=10,
    restore_best_weights=True
)

history = model.fit(
    X_train,
    y_train,
    epochs=100,
    batch_size=32,
    validation_data=(X_val, y_val),
    callbacks=[early_stop],
)

model.save("saved_models/lstm_model.keras")
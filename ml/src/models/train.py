import numpy as np
from tensorflow.keras.callbacks import EarlyStopping
from .lstm_model import build_lstm_model
from ..utils.paths import PROCESSED_DATA_DIR, MODELS_DIR

X_train = np.load(PROCESSED_DATA_DIR / "X_train.npy")
X_val = np.load(PROCESSED_DATA_DIR / "X_val.npy")

y_train = np.load(PROCESSED_DATA_DIR / "y_train.npy")
y_val = np.load(PROCESSED_DATA_DIR / "y_val.npy")


model = build_lstm_model(input_shape=(X_train.shape[1], X_train.shape[2]))
model.summary()

early_stop = EarlyStopping(monitor="val_loss", patience=10, restore_best_weights=True)

history = model.fit(
    X_train,
    y_train,
    epochs=100,
    batch_size=32,
    validation_data=(X_val, y_val),
    callbacks=[early_stop],
)

model.save(MODELS_DIR / "lstm_model.keras")

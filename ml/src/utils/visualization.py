import matplotlib.pyplot as plt
import numpy as np


def plot_predictions(y_true, y_pred):
    plt.figure(figsize=(12, 6))
    plt.plot(y_true, label="Real Price")
    plt.plot(y_pred, label="Predicted Price")
    plt.legend()
    plt.title("Stock Price Prediction")
    plt.show()


def plot_full_data(scaled_data, model, X_train, X_test, scaler):
    train_plot = np.empty_like(scaled_data)
    train_plot[:] = np.nan
    train_plot[30 : len(X_train) + 30] = scaler.inverse_transform(
        model.predict(X_train)
    )

    test_plot = np.empty_like(scaled_data)
    test_plot[:] = np.nan
    test_plot[len(X_train) + 30 :] = scaler.inverse_transform(model.predict(X_test))

    plt.figure(figsize=(14, 7))
    plt.plot(scaler.inverse_transform(scaled_data), label="Original")
    plt.plot(train_plot, label="Train")
    plt.plot(test_plot, label="Test")
    plt.legend()
    plt.show()

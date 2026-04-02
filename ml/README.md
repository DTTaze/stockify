# Machine Learning Module

Chứa tất cả code, data, và models liên quan đến AI/ML của dự án Stockify.

## Cấu trúc thư mục

```
ml/
├── src/                    # Python source code
│   ├── data/              # Data loading & preprocessing
│   │   ├── data_loader.py
│   │   └── preprocessing.py
│   ├── features/          # Feature engineering
│   │   └── technical_indicators.py
│   ├── models/            # Model definitions & training
│   │   ├── lstm_model.py
│   │   ├── train.py
│   │   └── predict.py
│   └── utils/             # Utilities
│       ├── config.py
│       ├── metrics.py
│       ├── paths.py       # Path configuration
│       └── visualization.py
├── data/                  # Data files
│   ├── raw/              # Original data
│   │   └── stock_data.csv
│   └── processed/        # Preprocessed data & scalers
│       ├── X_train.npy
│       ├── X_val.npy
│       ├── X_test.npy
│       ├── y_train.npy
│       ├── y_val.npy
│       ├── y_test.npy
│       └── scaler_y.pkl
├── notebooks/            # Jupyter notebooks
│   ├── exploration.ipynb
│   └── training.ipynb
├── saved_models/         # Trained models
│   ├── lstm_model.h5
│   └── lstm_model.keras
├── requirements.txt      # Python dependencies
└── README.md            # This file
```

## Setup

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Prepare Data
```bash
python -m src.data.preprocessing
```

### 3. Train Model
```bash
python -m src.models.train
```

### 4. Make Predictions
```bash
python -m src.models.predict
```

## Requirements

- Python 3.8+
- TensorFlow/Keras
- NumPy, Pandas
- scikit-learn
- joblib

## Notes

- All paths are configured in `src/utils/paths.py`
- Scripts can be run from the root directory using Python module syntax
- Data paths automatically resolve relative to the `ml/` directory

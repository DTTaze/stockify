import shutil
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent
SAVED_MODELS_DIR = BASE_DIR / "src" / "saved_models"
PROCESSED_DIR = BASE_DIR / "src" / "data" / "processed"

# Source
SRC_SYMBOL = "VCB"
SRC_MODEL_DIR = SAVED_MODELS_DIR / SRC_SYMBOL
SRC_PROCESSED_DIR = PROCESSED_DIR / SRC_SYMBOL

# 21 missing symbols in VN30
MISSING_SYMBOLS = [
    "ACB",
    "BCM",
    "BVH",
    "GAS",
    "GVR",
    "HDB",
    "LPB",
    "MBB",
    "MSN",
    "MWG",
    "PLX",
    "POW",
    "SAB",
    "SHB",
    "SSB",
    "STB",
    "TPB",
    "VIB",
    "VJC",
    "VPB",
    "VRE",
]


def copy_mock_data():
    print("Starting VN30 mock data generation...")

    if not SRC_MODEL_DIR.exists():
        print(f"Error: Source model directory {SRC_MODEL_DIR} does not exist.")
        return

    if not SRC_PROCESSED_DIR.exists():
        print(f"Error: Source processed directory {SRC_PROCESSED_DIR} does not exist.")
        return

    for symbol in MISSING_SYMBOLS:
        print(f"Replicating data for {symbol}...")

        # 1. saved_models
        dest_model_dir = SAVED_MODELS_DIR / symbol
        dest_model_dir.mkdir(exist_ok=True, parents=True)

        # Copy metadata
        shutil.copy(SRC_MODEL_DIR / "metadata.json", dest_model_dir / "metadata.json")

        # Copy and rename LSTM model
        src_lstm = SRC_MODEL_DIR / f"{SRC_SYMBOL}_lstm_model.keras"
        dest_lstm = dest_model_dir / f"{symbol}_lstm_model.keras"
        if src_lstm.exists():
            shutil.copy(src_lstm, dest_lstm)

        # Also copy other model types if they exist (just in case)
        for mt in ["gru", "linear"]:
            ext = ".joblib" if mt == "linear" else ".keras"
            src_other = SRC_MODEL_DIR / f"{SRC_SYMBOL}_{mt}_model{ext}"
            if src_other.exists():
                shutil.copy(src_other, dest_model_dir / f"{symbol}_{mt}_model{ext}")

        # 2. processed data
        dest_processed_dir = PROCESSED_DIR / symbol
        dest_processed_dir.mkdir(exist_ok=True, parents=True)

        for item in SRC_PROCESSED_DIR.iterdir():
            if item.is_file():
                shutil.copy(item, dest_processed_dir / item.name)

    print("Successfully completed VN30 mock data generation!")


if __name__ == "__main__":
    copy_mock_data()

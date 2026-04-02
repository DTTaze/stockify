"""
Path configuration for ML project
"""

from pathlib import Path

# Get the ML directory (parent of src)
ML_DIR = Path(__file__).parent.parent  # From src/utils -> src -> ml

# Data directories
DATA_DIR = ML_DIR / "data"
RAW_DATA_DIR = DATA_DIR / "raw"
PROCESSED_DATA_DIR = DATA_DIR / "processed"

# Models directory
MODELS_DIR = ML_DIR / "saved_models"

# Ensure directories exist
PROCESSED_DATA_DIR.mkdir(parents=True, exist_ok=True)
MODELS_DIR.mkdir(parents=True, exist_ok=True)

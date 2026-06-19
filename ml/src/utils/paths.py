"""
Path configuration for ML project
"""

from pathlib import Path

# Get the src directory
SRC_DIR = Path(__file__).resolve().parent.parent  # From src/utils -> src

# Data directories
DATA_DIR = SRC_DIR / "data"
RAW_DATA_DIR = DATA_DIR / "raw"
PROCESSED_DATA_DIR = DATA_DIR / "processed"

# Models directory
MODELS_DIR = SRC_DIR / "saved_models"


# Ensure directories exist
PROCESSED_DATA_DIR.mkdir(parents=True, exist_ok=True)
MODELS_DIR.mkdir(parents=True, exist_ok=True)

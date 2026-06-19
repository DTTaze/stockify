INDICES = {
    "vn-index": {
        "code": "VNINDEX",
        "name": "VN-INDEX",
        "description": "Vietnam Stock Index - HoSE",
    },
    "vn30": {
        "code": "VN30",
        "name": "VN30",
        "description": "Vietnam 30 Index - Top 30 stocks",
    },
    "hnx-index": {
        "code": "HNXINDEX",
        "name": "HNX-INDEX",
        "description": "Hanoi Stock Exchange Index",
    },
    "upcom": {
        "code": "UPCOMINDEX",
        "name": "UPCOM",
        "description": "Unlisted Public Companies Index",
    },
}

PERIOD_MAPPING = {
    "1d": 1,
    "1w": 7,
    "1mo": 30,
    "3mo": 90,
    "6mo": 180,
    "1y": 365,
}

FETCH_BUFFER = {
    "1d": 5,
    "1w": 10,
    "1mo": 40,
    "3mo": 120,
    "6mo": 240,
    "1y": 400,
}

VALID_PERIODS = list(PERIOD_MAPPING.keys())

SUPPORTED_INDICES = list(INDICES.keys())

DEFAULT_PERIOD = "1mo"

CACHE_EXPIRATION_MINUTES = 5

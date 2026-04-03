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

SUPPORTED_INDICES = list(INDICES.keys())

DEFAULT_PERIOD = "1mo"

CACHE_EXPIRATION_MINUTES = 5

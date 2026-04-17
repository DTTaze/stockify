import logging
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import json

logger = logging.getLogger(__name__)


def setup_logging(name: str, level: str = "INFO") -> logging.Logger:
    """
    Setup logging configuration for VN Stock module.

    Args:
        name: Logger name
        level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)

    Returns:
        Configured logger instance
    """
    logger = logging.getLogger(name)
    logger.setLevel(getattr(logging, level.upper()))

    # Create console handler with formatting
    handler = logging.StreamHandler()
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    handler.setFormatter(formatter)

    if not logger.handlers:
        logger.addHandler(handler)

    return logger


def validate_index_code(code: str) -> bool:
    """
    Validate if the index code is supported.

    Args:
        code: Index code to validate

    Returns:
        True if code is valid, False otherwise
    """
    from .constants import SUPPORTED_INDICES

    return code.lower() in SUPPORTED_INDICES


def validate_period(period: str) -> bool:
    """
    Validate if the period is supported.

    Args:
        period: Period string to validate

    Returns:
        True if period is valid, False otherwise
    """
    valid_periods = ["1d", "5d", "1mo", "3mo", "6mo", "1y"]
    return period in valid_periods


def get_period_description(period: str) -> str:
    """
    Get human-readable description of a period.

    Args:
        period: Period string

    Returns:
        Description of the period
    """
    descriptions = {
        "1d": "1 Day",
        "5d": "5 Days",
        "1mo": "1 Month",
        "3mo": "3 Months",
        "6mo": "6 Months",
        "1y": "1 Year",
    }
    return descriptions.get(period, "Unknown")


def format_currency(value: float, decimal_places: int = 2) -> str:
    """
    Format a number as currency.

    Args:
        value: The value to format
        decimal_places: Number of decimal places

    Returns:
        Formatted currency string
    """
    return f"{value:,.{decimal_places}f}"


def round_to_two_decimals(value: float) -> float:
    """
    Round a value to two decimal places.

    Args:
        value: The value to round

    Returns:
        Rounded value
    """
    return round(value, 2)


def safe_json_dumps(obj: Any, default_return: str = "{}") -> str:
    """
    Safely convert an object to JSON string.

    Args:
        obj: Object to convert
        default_return: Default return value if conversion fails

    Returns:
        JSON string or default_return if conversion fails
    """
    try:
        return json.dumps(obj, default=str)
    except Exception as e:
        logger.error(f"Error converting object to JSON: {e}")
        return default_return


def is_market_open() -> bool:
    """
    Check if Vietnamese stock market is open.

    Returns:
        True if market is open, False otherwise
    """
    from datetime import datetime, time, timezone
    import pytz

    vn_tz = pytz.timezone("Asia/Ho_Chi_Minh")
    now = datetime.now(vn_tz)

    if now.weekday() >= 5:
        return False

    market_open = time(9, 0)
    market_close = time(15, 0)

    return market_open <= now.time() <= market_close

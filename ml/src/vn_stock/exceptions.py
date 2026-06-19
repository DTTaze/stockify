from fastapi import HTTPException, status


class IndexNotFoundException(HTTPException):
    """Exception raised when an index is not found"""

    def __init__(self, index_code: str):
        self.detail = f"Index '{index_code}' not found"
        self.error_code = "INDEX_NOT_FOUND"
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=self.detail)


class InvalidPeriodException(HTTPException):
    """Exception raised when an invalid period is provided"""

    def __init__(self, period: str):
        from .constants import VALID_PERIODS
        supported_str = ", ".join(VALID_PERIODS)
        self.detail = (
            f"Invalid period '{period}'. Supported periods: {supported_str}"
        )
        self.error_code = "INVALID_PERIOD"
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=self.detail)



class DataFetchException(HTTPException):
    """Exception raised when data fetching fails"""

    def __init__(self, message: str = "Failed to fetch index data"):
        self.detail = message
        self.error_code = "DATA_FETCH_FAILED"
        super().__init__(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=self.detail
        )


class VnstockException(Exception):
    """Base exception for vnstock operations"""

    pass

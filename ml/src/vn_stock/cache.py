from abc import ABC, abstractmethod
import json
import logging
import os
import time
from typing import Any, Optional

logger = logging.getLogger(__name__)

class Cache(ABC):
    """Abstract interface defining standard cache operations."""

    @abstractmethod
    def get(self) -> Optional[Any]:
        """Retrieve fresh data from cache. Returns None if cache is expired or missing."""
        pass

    @abstractmethod
    def get_stale(self) -> Optional[Any]:
        """Retrieve data from cache even if it is expired."""
        pass

    @abstractmethod
    def set(self, data: Any) -> None:
        """Store data in cache."""
        pass


class FileCacheManager(Cache):
    """Concrete cache implementation storing data in a local JSON file."""

    def __init__(self, file_path: str, duration_seconds: int):
        self.file_path = file_path
        self.duration = duration_seconds

    def get(self) -> Optional[Any]:
        if not os.path.exists(self.file_path):
            return None

        try:
            with open(self.file_path, "r", encoding="utf-8") as f:
                cache_data = json.load(f)
            
            # Verify cache age
            if time.time() - cache_data.get("timestamp", 0) < self.duration:
                logger.info(f"Cache hit (fresh) for {os.path.basename(self.file_path)}")
                return cache_data.get("data")
        except Exception as e:
            logger.warning(f"Failed to read cache file {self.file_path}: {e}")
            
        return None

    def get_stale(self) -> Optional[Any]:
        if not os.path.exists(self.file_path):
            return None

        try:
            with open(self.file_path, "r", encoding="utf-8") as f:
                cache_data = json.load(f)
            logger.info(f"Cache hit (stale) for {os.path.basename(self.file_path)}")
            return cache_data.get("data")
        except Exception as e:
            logger.warning(f"Failed to read stale cache file {self.file_path}: {e}")
            
        return None

    def set(self, data: Any) -> None:
        try:
            temp_path = self.file_path + ".tmp"
            with open(temp_path, "w", encoding="utf-8") as f:
                json.dump(
                    {"timestamp": time.time(), "data": data},
                    f,
                    ensure_ascii=False,
                    indent=2,
                )
            
            # Atomic swap on POSIX/Windows (if destination doesn't exist, rename. Otherwise use replace)
            if hasattr(os, "replace"):
                os.replace(temp_path, self.file_path)
            else:
                if os.path.exists(self.file_path):
                    os.remove(self.file_path)
                os.rename(temp_path, self.file_path)
            
            logger.info(f"Cache successfully written to {os.path.basename(self.file_path)}")
        except Exception as e:
            logger.warning(f"Failed to write cache file {self.file_path}: {e}")
            if os.path.exists(temp_path):
                try:
                    os.remove(temp_path)
                except Exception:
                    pass

"""
Redis caching utilities for ML service
"""
import redis
import json
import os
from typing import Any, Optional, Callable, TypeVar
from functools import wraps
import time

T = TypeVar('T')

class RedisCache:
    def __init__(self):
        self.redis_url = os.getenv('REDIS_URL', 'redis://localhost:6379')
        self.client = None
        self.is_connected = False

    def connect(self):
        """Connect to Redis with error handling"""
        try:
            self.client = redis.from_url(self.redis_url, decode_responses=True)
            self.client.ping()  # Test connection
            self.is_connected = True
            print("Connected to Redis")
        except redis.ConnectionError as e:
            print(f"Failed to connect to Redis: {e}")
            self.is_connected = False
        except Exception as e:
            print(f"Redis connection error: {e}")
            self.is_connected = False

    def disconnect(self):
        """Disconnect from Redis"""
        if self.client and self.is_connected:
            self.client.close()
            self.is_connected = False

    def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        if not self.is_connected or not self.client:
            return None

        try:
            data = self.client.get(key)
            return json.loads(data) if data else None
        except Exception as e:
            print(f"Redis get error: {e}")
            return None

    def set(self, key: str, value: Any, ttl_seconds: int = 300) -> None:
        """Set value in cache with TTL"""
        if not self.is_connected or not self.client:
            return

        try:
            serialized_value = json.dumps(value)
            self.client.setex(key, ttl_seconds, serialized_value)
        except Exception as e:
            print(f"Redis set error: {e}")

    def delete(self, key: str) -> None:
        """Delete key from cache"""
        if not self.is_connected or not self.client:
            return

        try:
            self.client.delete(key)
        except Exception as e:
            print(f"Redis delete error: {e}")

    def delete_pattern(self, pattern: str) -> None:
        """Delete keys matching pattern"""
        if not self.is_connected or not self.client:
            return

        try:
            keys = self.client.keys(pattern)
            if keys:
                self.client.delete(*keys)
        except Exception as e:
            print(f"Redis delete pattern error: {e}")

    def exists(self, key: str) -> bool:
        """Check if key exists"""
        if not self.is_connected or not self.client:
            return False

        try:
            return bool(self.client.exists(key))
        except Exception as e:
            print(f"Redis exists error: {e}")
            return False

    def cached(self, ttl_seconds: int = 300, key_prefix: str = ""):
        """Decorator for caching function results"""
        def decorator(func: Callable[..., T]) -> Callable[..., T]:
            @wraps(func)
            def wrapper(*args, **kwargs) -> T:
                # Create cache key from function name and arguments
                key_parts = [key_prefix or func.__name__]
                key_parts.extend([str(arg) for arg in args if arg is not None])
                key_parts.extend([f"{k}:{v}" for k, v in kwargs.items() if v is not None])
                key = ":".join(key_parts)

                # Try to get from cache first
                cached_result = self.get(key)
                if cached_result is not None:
                    return cached_result

                # Execute function and cache result
                result = func(*args, **kwargs)
                self.set(key, result, ttl_seconds)
                return result

            return wrapper
        return decorator

    def invalidate_user_cache(self, user_id: str) -> None:
        """Invalidate all cache entries for a user"""
        self.delete_pattern(f"user:{user_id}:*")

    def invalidate_prediction_cache(self, user_id: str) -> None:
        """Invalidate prediction cache for a user"""
        self.delete_pattern(f"prediction:{user_id}:*")

    def invalidate_model_cache(self, model_name: str) -> None:
        """Invalidate cache for a specific model"""
        self.delete_pattern(f"model:{model_name}:*")


# Global cache instance
redis_cache = RedisCache()
import { createClient, RedisClientType } from 'redis';

class RedisCache {
  private client: RedisClientType | null = null;
  private isConnected: boolean = false;
  private clientCreated: boolean = false;

  constructor() {
    // Don't create Redis client in constructor - do it lazily
    console.log('Redis cache initialized (lazy loading)');
  }

  private async ensureClient(): Promise<void> {
    if (this.clientCreated) return;

    this.clientCreated = true;

    // Only create Redis client if Redis is available and not in test environment
    if (!process.env.REDIS_URL || process.env.NODE_ENV === 'test') {
      console.log('Redis not configured, running without cache');
      return;
    }

    try {
      this.client = createClient({
        url: process.env.REDIS_URL,
        socket: {
          connectTimeout: 5000, // Reduced timeout
        },
      });

      this.client.on('error', (err) => {
        console.warn('Redis connection error:', err.message);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        console.log('Connected to Redis');
        this.isConnected = true;
      });

      this.client.on('ready', () => {
        this.isConnected = true;
      });

      this.client.on('end', () => {
        this.isConnected = false;
      });
    } catch (error) {
      console.warn('Failed to create Redis client:', error);
      this.client = null;
    }
  }

  async connect(): Promise<void> {
    await this.ensureClient();
    if (!this.client || this.isConnected) return;

    try {
      await this.client.connect();
    } catch (error) {
      console.warn('Failed to connect to Redis, continuing without cache:', error);
    }
  }

  async disconnect(): Promise<void> {
    if (!this.client || !this.isConnected) return;

    try {
      await this.client.disconnect();
    } catch (error) {
      console.warn('Error disconnecting from Redis:', error);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.client || !this.isConnected) return null;

    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn('Redis get error:', error);
      return null;
    }
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    if (!this.client || !this.isConnected) return;

    try {
      const serializedValue = JSON.stringify(value);
      if (ttlSeconds) {
        await this.client.setEx(key, ttlSeconds, serializedValue);
      } else {
        await this.client.set(key, serializedValue);
      }
    } catch (error) {
      console.warn('Redis set error:', error);
    }
  }

  async delete(key: string): Promise<void> {
    if (!this.client || !this.isConnected) return;

    try {
      await this.client.del(key);
    } catch (error) {
      console.warn('Redis delete error:', error);
    }
  }

  async deletePattern(pattern: string): Promise<void> {
    if (!this.client || !this.isConnected) return;

    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
    } catch (error) {
      console.warn('Redis delete pattern error:', error);
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.client || !this.isConnected) return false;

    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.warn('Redis exists error:', error);
      return false;
    }
  }

  async clear(): Promise<void> {
    if (!this.client || !this.isConnected) return;

    try {
      await this.client.flushAll();
    } catch (error) {
      console.warn('Redis clear error:', error);
    }
  }

  // Cache wrapper for functions
  async cached<T>(
    key: string,
    fn: () => Promise<T>,
    ttlSeconds: number = 300
  ): Promise<T> {
    // Try to get from cache first
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Execute function and cache result
    const result = await fn();
    await this.set(key, result, ttlSeconds);
    return result;
  }

  // Invalidate cache by pattern
  async invalidateUserCache(userId: string): Promise<void> {
    await this.deletePattern(`user:${userId}:*`);
  }

  async invalidateCurriculumCache(): Promise<void> {
    await this.deletePattern('curriculum:*');
  }

  async invalidateProgressCache(userId: string): Promise<void> {
    await this.deletePattern(`progress:${userId}:*`);
  }
}

// Export singleton instance
export const redisCache = new RedisCache();
export default redisCache;
import { redis } from "../config/redis";

export async function getCache<T>(
  key: string,
): Promise<T | null> {
  try {
    if (!redis.isOpen) {
      return null;
    }

    const value = await redis.get(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export async function setCache(
  key: string,
  value: unknown,
  ttlSeconds = 60,
) {
  try {
    if (!redis.isOpen) {
      return;
    }

    await redis.set(key, JSON.stringify(value), {
      EX: ttlSeconds,
    });
  } catch {
    // Cache failures must never break the API.
  }
}

export async function deleteCache(key: string) {
  try {
    if (!redis.isOpen) {
      return;
    }

    await redis.del(key);
  } catch {
    // Cache failures must never break the API.
  }
}

export async function deleteCacheByPattern(
  pattern: string,
) {
  try {
    if (!redis.isOpen) {
      return;
    }

    const keys: string[] = [];

    for await (const keyBatch of redis.scanIterator({
      MATCH: pattern,
      COUNT: 100,
    })) {
      keys.push(...keyBatch);
    }

    if (keys.length > 0) {
      await redis.del(keys);
    }
  } catch {
    // Cache failures must never break the API.
  }
}

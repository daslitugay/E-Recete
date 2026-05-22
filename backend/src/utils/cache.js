const { getRedisClient, isRedisReady } = require('../config/redis');

const DEFAULT_TTL_SECONDS = 60;

const getCache = async (key) => {
  if (!isRedisReady()) {
    return null;
  }

  try {
    const client = getRedisClient();
    const cachedValue = await client.get(key);

    if (!cachedValue) {
      return null;
    }

    return JSON.parse(cachedValue);
  } catch (error) {
    console.error(`Redis get cache error for ${key}: ${error.message}`);
    return null;
  }
};

const setCache = async (key, value, ttlSeconds = DEFAULT_TTL_SECONDS) => {
  if (!isRedisReady()) {
    return false;
  }

  try {
    const client = getRedisClient();

    await client.set(key, JSON.stringify(value), {
      EX: ttlSeconds,
    });

    return true;
  } catch (error) {
    console.error(`Redis set cache error for ${key}: ${error.message}`);
    return false;
  }
};

const deleteCache = async (key) => {
  if (!isRedisReady()) {
    return false;
  }

  try {
    const client = getRedisClient();
    await client.del(key);

    return true;
  } catch (error) {
    console.error(`Redis delete cache error for ${key}: ${error.message}`);
    return false;
  }
};

const deleteCacheByPattern = async (pattern) => {
  if (!isRedisReady()) {
    return false;
  }

  try {
    const client = getRedisClient();
    const keys = [];

    for await (const key of client.scanIterator({
      MATCH: pattern,
      COUNT: 100,
    })) {
      keys.push(key);
    }

    if (keys.length > 0) {
      await client.del(keys);
    }

    return true;
  } catch (error) {
    console.error(
      `Redis delete cache pattern error for ${pattern}: ${error.message}`
    );
    return false;
  }
};

module.exports = {
  getCache,
  setCache,
  deleteCache,
  deleteCacheByPattern,
};
const { createClient } = require('redis');

let redisClient;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const connectRedis = async () => {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    console.log('Redis disabled: REDIS_URL is not defined');
    return null;
  }

  if (redisClient?.isOpen) {
    return redisClient;
  }

  const maxRetries = Number(process.env.REDIS_RETRY_COUNT) || 10;
  const retryDelayMs = Number(process.env.REDIS_RETRY_DELAY_MS) || 3000;

  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    redisClient = createClient({
      url: redisUrl,
    });

    redisClient.on('error', (error) => {
      console.error(`Redis error: ${error.message}`);
    });

    redisClient.on('connect', () => {
      console.log('Redis connecting...');
    });

    redisClient.on('ready', () => {
      console.log('Redis connected');
    });

    redisClient.on('end', () => {
      console.log('Redis connection closed');
    });

    try {
      await redisClient.connect();
      return redisClient;
    } catch (error) {
      console.error(
        `Redis connection failed. Attempt ${attempt}/${maxRetries}: ${error.message}`
      );

      try {
        await redisClient.disconnect();
      } catch (disconnectError) {
        // Ignore disconnect errors during retry.
      }

      redisClient = null;

      if (attempt < maxRetries) {
        await sleep(retryDelayMs);
      }
    }
  }

  console.error('Redis connection could not be established');
  return null;
};

const getRedisClient = () => {
  return redisClient;
};

const isRedisReady = () => {
  return Boolean(redisClient?.isReady);
};

module.exports = {
  connectRedis,
  getRedisClient,
  isRedisReady,
};
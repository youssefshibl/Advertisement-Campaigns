const redis = require('redis');

let redisClient = null;

async function getRedisClient() {
  if (redisClient) {
    return redisClient;
  }
  redisClient = await createClient();
  return redisClient;
}

async function createClient() {
  return new Promise((resolve, reject) => {
    const client = redis.createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
    });

    client.connect().then(() => {
      console.log('Redis client connected');
      resolve(client);
    }).catch((error) => {
      console.error(error);
      reject(error);
    });
  });
}

module.exports = { getRedisClient };

import redisCache from './src/utils/cache.js';

async function testRedis() {
  console.log('🧪 Testing Redis caching functionality...');

  try {
    // Connect to Redis
    await redisCache.connect();
    console.log('✅ Connected to Redis');

    // Test basic operations
    const testKey = 'test:key';
    const testData = { message: 'Hello Redis!', timestamp: Date.now() };

    // Set data
    await redisCache.set(testKey, testData, 60);
    console.log('✅ Set operation successful');

    // Get data
    const retrieved = await redisCache.get(testKey);
    console.log('✅ Get operation successful:', retrieved);

    // Test cache invalidation
    await redisCache.invalidateUserCache('test-user');
    console.log('✅ Cache invalidation successful');

    console.log('🎉 All Redis tests passed!');

  } catch (error) {
    console.error('❌ Redis test failed:', error.message);
  }
}

testRedis();
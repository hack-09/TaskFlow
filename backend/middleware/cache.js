// utils/cache.js
import NodeCache from "node-cache";

// Global cache instance (30 min TTL, 1-hour check interval)
const cache = new NodeCache({ stdTTL: 1800, checkperiod: 3600 });

// Helper: Create user-specific keys
export function userCacheKey(userId, key) {
  return `${userId || "guest"}:${key}`;
}

// Helper: Store value
export function setCache(userId, key, value) {
  const cacheKey = userCacheKey(userId, key);
  cache.set(cacheKey, value);
}

// Helper: Retrieve value
export function getCache(userId, key) {
  const cacheKey = userCacheKey(userId, key);
  return cache.get(cacheKey);
}

// Helper: Purge all cache entries for a user
export function clearUserCache(userId) {
  const keys = cache.keys();
  for (const k of keys) {
    if (k.startsWith(`${userId}:`)) cache.del(k);
  }
  // console.log(`🧹 Cleared cache for user: ${userId}`);
}

export default cache;

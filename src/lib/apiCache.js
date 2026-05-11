/**
 * apiCache.js — Global rate-limit guard & caching layer for AI generation calls.
 *
 * Strategy:
 *  1. Cache key = stable hash of userData (name + role + prompt).
 *  2. TTL: cached results expire after CACHE_TTL_MS (default 10 min).
 *  3. In-flight deduplication: if the same key is already being fetched,
 *     queue the second caller so it waits and reuses the first result
 *     instead of firing a duplicate API call.
 *  4. Min-interval guard: enforces a minimum gap between *any* two API
 *     calls so a rapid re-render loop can't exhaust quota instantly.
 */

const CACHE_KEY_PREFIX = 'aipf_cache_';
const CACHE_TTL_MS = 10 * 60 * 1000;   // 10 minutes
const MIN_CALL_INTERVAL_MS = 3000;      // 3-second hard floor between calls

// In-memory tracking (resets on page refresh — intentional for dev ergonomics)
const inFlightMap = new Map();   // cacheKey → Promise<data>
let lastCallTime = 0;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildCacheKey(userData) {
  const raw = `${userData.name?.trim()}|${userData.role?.trim()}|${userData.prompt?.trim()}`;
  // Simple djb2 hash — good enough for a localStorage key
  let hash = 5381;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) + hash) ^ raw.charCodeAt(i);
  }
  return CACHE_KEY_PREFIX + (hash >>> 0).toString(36);
}

function readCache(key) {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    const { data, expiresAt } = JSON.parse(item);
    if (Date.now() > expiresAt) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function writeCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, expiresAt: Date.now() + CACHE_TTL_MS }));
  } catch {
    // Quota exceeded — clear old AIPF entries and retry once
    clearOldCacheEntries();
    try { localStorage.setItem(key, JSON.stringify({ data, expiresAt: Date.now() + CACHE_TTL_MS })); } catch { /* give up */ }
  }
}

function clearOldCacheEntries() {
  Object.keys(localStorage)
    .filter((k) => k.startsWith(CACHE_KEY_PREFIX))
    .forEach((k) => localStorage.removeItem(k));
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * cachedGenerate — wraps any async generator function with:
 *  - localStorage result caching (TTL-based)
 *  - in-flight deduplication
 *  - minimum call-interval throttling
 *
 * @param {object} userData  - { name, role, prompt }
 * @param {function} fetchFn - async () => data  (the actual API call)
 * @returns {Promise<object>} - the portfolio data
 */
export async function cachedGenerate(userData, fetchFn) {
  const key = buildCacheKey(userData);

  // 1. Serve from cache if fresh
  const cached = readCache(key);
  if (cached) {
    console.log('[Cache] HIT — skipping API call for:', key);
    return cached;
  }

  // 2. Deduplicate in-flight requests for identical inputs
  if (inFlightMap.has(key)) {
    console.log('[Cache] IN-FLIGHT dedup — awaiting existing request for:', key);
    return inFlightMap.get(key);
  }

  // 3. Enforce minimum interval between any API calls
  const elapsed = Date.now() - lastCallTime;
  if (elapsed < MIN_CALL_INTERVAL_MS) {
    const delay = MIN_CALL_INTERVAL_MS - elapsed;
    console.log(`[Cache] Rate-limit guard — waiting ${delay}ms before API call`);
    await wait(delay);
  }

  // 4. Fire the real API call and track it
  lastCallTime = Date.now();
  const promise = fetchFn()
    .then((data) => {
      writeCache(key, data);
      return data;
    })
    .finally(() => {
      inFlightMap.delete(key);
    });

  inFlightMap.set(key, promise);
  return promise;
}

/**
 * invalidateCache — force-clears one or all cached entries.
 * Useful for the "Regenerate" action.
 *
 * @param {object|null} userData - pass userData to clear one entry, or null to clear all.
 */
export function invalidateCache(userData = null) {
  if (userData) {
    const key = buildCacheKey(userData);
    localStorage.removeItem(key);
    inFlightMap.delete(key);
  } else {
    clearOldCacheEntries();
    inFlightMap.clear();
  }
}

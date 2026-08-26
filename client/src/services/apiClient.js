import axios from 'axios';

export const API_URL = import.meta.env.MODE === 'development'
  ? 'http://localhost:5000/api'
  : '/plus-api/api';
export const API_BASE_URL = API_URL;

export const getApiUrl = (path = '') => {
  if (!path) return API_BASE_URL;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};

// In-memory cache store & inflight request tracker for request deduplication
const cacheStore = new Map();
const pendingRequests = new Map();

/**
 * Deduplicated & cached GET fetcher built on Axios.
 * Prevents double-fetching during React 18/19 Strict Mode mounts or simultaneous component mounts.
 * 
 * @param {string} url - API Endpoint URL or path
 * @param {object} options - Axios config & options
 * @param {number} options.ttl - Time To Live in milliseconds (default: 5 minutes)
 * @param {boolean} options.forceFetch - Bypass cache and force fresh request
 */
export const fetchApiData = async (url, options = {}) => {
  const { ttl = 5 * 60 * 1000, forceFetch = false, ...axiosConfig } = options;
  const fullUrl = getApiUrl(url);
  const now = Date.now();

  // 1. Check valid cache
  if (!forceFetch && cacheStore.has(fullUrl)) {
    const cached = cacheStore.get(fullUrl);
    if (now - cached.timestamp < ttl) {
      return cached.data;
    }
    cacheStore.delete(fullUrl);
  }

  // 2. Check if identical request is already pending (in-flight deduplication)
  if (pendingRequests.has(fullUrl)) {
    return pendingRequests.get(fullUrl);
  }

  // 3. Initiate request and track promise
  const requestPromise = axios.get(fullUrl, axiosConfig)
    .then((res) => {
      cacheStore.set(fullUrl, { data: res.data, timestamp: Date.now() });
      pendingRequests.delete(fullUrl);
      return res.data;
    })
    .catch((err) => {
      pendingRequests.delete(fullUrl);
      throw err;
    });

  pendingRequests.set(fullUrl, requestPromise);
  return requestPromise;
};

/**
 * Utility to clear specific cache or entire cache store.
 */
export const clearApiCache = (url) => {
  if (url) {
    const fullUrl = getApiUrl(url);
    cacheStore.delete(fullUrl);
  } else {
    cacheStore.clear();
  }
};

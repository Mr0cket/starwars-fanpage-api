const NodeCache = require("node-cache");

// objective: minimise number of requests to external API (only have 10,000/day)
// Wrap node-cache with to create
class Cache {
  constructor(ttlinHours = 0) {
    this.cache = new NodeCache({ stdTTL: ttlinHours * 3600 });
  }

  // get/create a cache entry
  get(key, fetchValue) {
    const value = this.cache.get(key);
    if (value) {
      return Promise.resolve(value);
    }
    return fetchValue(key).then((result) => {
      this.cache.set(key, result);
      return result;
    });
  }
  del(keys) {
    this.cache.del(keys);
  }

  flush() {
    this.cache.flushAll();
  }
  stats() {
    return this.cache.getStats();
  }
}
const cache = new Cache();

module.exports = cache;

const NodeCache = require("node-cache");

// objective: minimise number of requests to external API (only have 10,000/day)
// Wrap node-cache with a class to create reusable logic
module.exports = class Cache {
  constructor(ttlinHours) {
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
};

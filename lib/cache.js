const NodeCache = require("node-cache");

// Wrap node-cache with a class to create reusable logic
module.exports = class Cache {
  constructor(ttl) {
    this.cache = new NodeCache({ stdTTL: ttl });
  }

  // create a cache
  get(key, fetchValue) {
    const value = this.cache.get(key);
    if (value) {
      return Promise.resolve(value);
    }
    const test = fetchValue(key).then((result) => {
      console.log("result", result);
      this.cache.set(key, result);
      return result;
    });
    return test;
  }
  del(keys) {
    this.cache.del(keys);
  }

  flush() {
    this.cache.flushAll();
  }
};

// objective: minimise number of requests to external API (only have 10,000.)

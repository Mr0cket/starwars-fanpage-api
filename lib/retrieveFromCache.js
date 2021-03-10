const Cache = require("./cache");
const fetchCharacter = require("./fetchCharacter");

// helper function to retrieve data from a urlString
function retrieveFromCache(array) {
  return Promise.all(
    array.map((urlString) => {
      // parse character Ids from string
      const characterId = urlString.match(/[0-9]+/)[0];

      // use the cache method to check if value is already stored.
      // otherwise fetch the data and store it by characterId in cache.
      return Cache.get(characterId, fetchCharacter);
    })
  );
}

module.exports = retrieveFromCache;

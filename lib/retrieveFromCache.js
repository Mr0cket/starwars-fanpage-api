const Cache = require("./cache");
const fetchCharacter = require("./fetchCharacter");

// helper function to retrieve data from a urlString
function retrieveFromCache(array) {
  return Promise.all(
    array.map((urlString) => {
      // parse character Ids from string
      const characterId = urlString.match(/[0-9]+/)[0];

      return Cache.get(characterId, fetchCharacter);
    })
  );
}

module.exports = retrieveFromCache;

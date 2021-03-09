const { default: axios } = require("axios");
const { apiUrl } = require("../config/constants");
const router = require("express").Router();
const Cache = require("../lib/cache");
const fetchCharacter = require("../lib/fetchCharacter");
const { sortByAge, sortByHeight } = require("../lib/sortBy");
const charCache = new Cache(0);
// assume api should return all characters from all movies that match the search term used. ()
// assume if multiple movies match a search term, characters from all movies should be combined (duplicates removed).
// since every character includes a list of the films they were in,
// Can use this information in FE to re-categorise characters by their movie.

/* schema:
    {
      page: number
      count: number
      matchedMovies: title[]
      characters: character[] limit 30 results
    }
  */

router.get("/", async (req, res, next) => {
  const { page = 0, title, gender, sortby, order = "descending" } = req.query;

  //Validation
  if (gender && (gender !== "male" || gender !== "female"))
    return res.status(400).json({ message: "invalid gender" });
  if (!title) return res.status(400).json({ message: "missing title queryString" });
  if (isNaN(Number(page)) || Number(page) < 0)
    return res.status(400).json({ message: "invalid page querystring. require number > 0" });

  try {
    const {
      data: { results },
    } = await axios.get(`${apiUrl}/films/?search=${title}`);

    // check if there are search matches
    if (!results || results.length < 1)
      return res.status(200).send({ message: "No movies Match the search term" });

    // combine characters from all movies matched into single array
    let combinedCharacters = [];
    results.forEach((movie) => (combinedCharacters = combinedCharacters.concat(movie.characters)));

    // remove duplacate characters from the character list
    const uniqueCharactersUrls = Array.from(new Set(combinedCharacters));
    // retrieve all people from api (w/ 9 requests via pagination & cache results)
    // OR retrieve characters individually as required (& cache the results)

    // create a list of promises and resolve them.
    let uniqueCharactersList = await Promise.all(
      uniqueCharactersUrls.map((urlString) => {
        // get the character Ids from the url string
        const characterId = urlString.match(/[0-9]+/)[0];

        // use the cache to check if value is already stored otherwise, make a request
        return charCache.get(characterId, fetchCharacter);
      })
    );

    // check & filter by gender
    if (gender)
      uniqueCharactersList = uniqueCharactersList.filter(
        (character) => character.gender === gender
      );

    // check for a sort term
    if (sortby) {
      if (sortby === "age") {
        uniqueCharactersList = uniqueCharactersList.sort(sortByAge(order));
      } else if (sortby === "height") {
        uniqueCharactersList = uniqueCharactersList.sort(sortByHeight(order));
      }
    }
    // paginate the results
    const count = uniqueCharactersList.length;
    const startingIndex = Number(page) * 30;
    const matchedMovies = results.map((movie) => movie.title);
    const paginatedResults = uniqueCharactersList.slice(
      startingIndex,
      Math.min(startingIndex + 30, count)
    );

    // send the results back
    res.json({ page, count, matchedMovies, characters: paginatedResults });
  } catch (e) {
    console.log(e.message);
    next(e);
  }
});
module.exports = router;

const { default: axios } = require("axios");
const { apiUrl } = require("../config/constants");
const router = require("express").Router();
const Cache = require("../lib/cache");
const fetchCharacter = require("../lib/fetchCharacter");
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
  const { page = 0, title, gender = 0 } = req.query;
  // enumerate gender (0 = none, 1 = female, 2 = male)

  //Validation
  if (isNaN(Number(gender) || Number(gender) > 2 || Number(gender) < 0))
    return res.status(400).json({ message: "invalid gender format." });
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
    // retrieve all people from api (w/ 9 requests) [& cache temporarily in DB]
    // use a cache to store the values of the requests.
    let uniqueCharactersUrls = Array.from(new Set(combinedCharacters));
    const uniqueCharactersList = uniqueCharactersUrls.map((urlString) => {
      const charId = urlString.match(/[0-9]/);
      return charCache.get(charId, fetchCharacter);
    });
    axios.get();
    // check & filter by gender
    if (gender) uniqueCharactersList.filter();

    // paginate the results
    const count = uniqueCharactersList.length;
    const startingIndex = Number(page) * 30;
    const matchedMovies = results.map((movie) => movie.title);
    const paginatedResults = uniqueCharactersList.slice(
      startingIndex,
      Math.min(startingIndex + 30, count)
    );

    // send the results back
    res.json({ page, matchedMovies, characters: paginatedResults, count });
  } catch (e) {
    console.log(e.message);
    next(e);
  }

  res.send();
});
module.exports = router;

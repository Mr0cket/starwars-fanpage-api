const { default: axios } = require("axios");
const { apiUrl } = require("../config/constants");
const router = require("express").Router();
const retrieveFromCache = require("../lib/retrieveFromCache");
const { sortByAge, sortByHeight } = require("../lib/sortBy");
// assume api should return all characters from all movies that match the search term used.
// assume if multiple movies match a search term, characters from all movies should be combined (duplicates removed).
// since every character includes a list of the films they were in,
// Can use this information in FE to re-categorise characters by their movie.

/* schema:
    {
      page: number
      count: number
      matchedMovies: title[] // use this & character.films to re-match characters to films in FE
      characters: character[] // limit 30 results
    }
*/

router.get("/", async (req, res, next) => {
  const { page = 0, title, gender, sortby, order = "descending" } = req.query;

  // Validation
  if (gender && (gender !== "male" || gender !== "female"))
    return res.status(400).json({ message: "invalid gender" });
  if (!title) return res.status(400).json({ message: "missing title queryString" });
  if (isNaN(Number(page)) || Number(page) < 0)
    return res.status(400).json({ message: "invalid page querystring. require number > 0" });

  try {
    const {
      data: { results },
    } = await axios.get(`${apiUrl}/films/?search=${title}`);

    // check if any film matches the search term
    if (!results || results.length < 1)
      return res.status(200).send({ message: "No movies match the search term" });

    // combine all characters
    let combinedCharacters = [];
    results.forEach((movie) => (combinedCharacters = combinedCharacters.concat(movie.characters)));

    // remove duplicate characters
    const uniqueCharactersUrls = Array.from(new Set(combinedCharacters));

    // create and resolve list of promises
    let uniqueCharactersList = await retrieveFromCache(uniqueCharactersUrls, "people");

    // check for & filter by gender
    if (gender)
      uniqueCharactersList = uniqueCharactersList.filter(
        (character) => character.gender === gender
      );

    // check for a sort term
    if (sortby) {
      if (sortby === "age") {
        uniqueCharactersList.sort(sortByAge(order));
      } else if (sortby === "height") {
        uniqueCharactersList.sort(sortByHeight(order));
      }
    }

    // paginate results
    const count = uniqueCharactersList.length;
    const startingIndex = Number(page) * 30;
    const matchedMovies = results.map((movie) => movie.title);
    const paginatedResults = uniqueCharactersList.slice(
      startingIndex,
      Math.min(startingIndex + 30, count)
    );

    res.json({ page, count, matchedMovies, characters: paginatedResults });
  } catch (e) {
    console.log(e.message);
    next(e);
  }
});
module.exports = router;

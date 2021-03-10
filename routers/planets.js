const { default: axios } = require("axios");
const { apiUrl } = require("../config/constants");
const router = require("express").Router();
const Cache = require("../lib/cache");
const fetchAll = require("../lib/fetchAllPages");
const retrieveFromCache = require("../lib/retrieveFromCache");
// endpoint that return an *object* of all the planets that have this climate-type.
// this planet object includes a collection of all dark-haired characters that live on the planet.
// assume dark-hair is either brown or black hair.
const hair_colour = ["black", "brown"];

/* Schema 
  {
    ...
    "planetName": dark-haired-character[]
    ...
  }
*/

router.get("/climate/:climateType", async (req, res, next) => {
  const { climateType = "" } = req.params;
  console.log("climate type:", climateType);
  try {
    // fetch all of the planets from cache or req
    // planets stored in cache under a single key
    // (not best approach, but fits requirements)
    const allPLanets = await Cache.get("planets", fetchAll);

    // filter planets by climate type
    const filteredPlanetsList = allPLanets.filter((planet) => planet.climate.includes(climateType));

    const planets = {};
    // use Promise.all to suspend fn execution
    // until promises are resolved
    await Promise.all(
      filteredPlanetsList.map(async (planet) => {
        // retrieve character data from cache/request
        const residents = await retrieveFromCache(planet.residents);

        // filter residents by hair type
        const darkHairedResidents = residents.filter((character) =>
          hair_colour.reduce(
            (prevResult, currentHair) => prevResult || character.hair_color.includes(currentHair),
            false
          )
        );
        // add all planets to the planets object
        planets[planet.name] = { ...planet, residents, darkHairedResidents };
        return;
      })
    );
    // validate climate type
    if (Object.keys(planets) < 1) return res.json({ message: "invalid climate type" });
    res.json(planets);
  } catch (e) {
    next(e);
  }
});

module.exports = router;

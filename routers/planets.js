const { default: axios } = require("axios");
const { apiUrl } = require("../config/constants");
const router = require("express").Router();

// endpoint that return an object of all the planets that have this climate-type.
// object includes a collection of all dark-haired characters that live on the planet.

/* schema 
  {
    "planetName": dark-haired-character[]
  }
*/

router.get("/:climateType", async (req, res, next) => {
  const { climateType } = req.params;
  const { hair_type = "black" } = req.query;

  // fetch all planets
  // then: filter planets by climate type
  // then: fetch all residents
  // then: filter residents by hair_type
  console.log("climateType:", climateType);

  res.json();
});

module.exports = router;

const { default: axios } = require("axios");
const { apiUrl } = require("../config/constants");

async function fetchAllPages(category) {
  const start = Date.now();
  // use 1st req to get the count (how many request to fetch the entire character list)
  const {
    data: { count, results: page1results },
  } = await axios.get(`${apiUrl}/${category}`);

  const requestsToMake = Math.ceil((count - page1results.length) / page1results.length);

  // get all results as an array of unresolved promises
  const results = Array.from({ length: requestsToMake })
    .map((_, i) =>
      axios.get(`${apiUrl}/${category}?page=${i + 2}`).then((res) => {
        return res.data.results;
      })
    )
    .flat();

  return await Promise.all(results); // character[]
}
module.exports = fetchAllPages;

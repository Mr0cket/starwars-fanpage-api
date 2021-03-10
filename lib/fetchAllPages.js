const { default: axios } = require("axios");
const { apiUrl } = require("../config/constants");

async function fetchAllPages(category) {
  // use 1st req to get item count & list length.
  const {
    data: { count, results: page1results },
  } = await axios.get(`${apiUrl}/${category}`);

  // calculate # of additional requests
  const requestsToMake = Math.ceil((count - page1results.length) / page1results.length);

  // get all results (unresolved-promises[])
  const results = Array.from({ length: requestsToMake }).map((_, i) =>
    axios.get(`${apiUrl}/${category}?page=${i + 2}`).then((res) => res.data.results)
  );
  return (await Promise.all(results)).flat(); // resolve promises => category[]
}
module.exports = fetchAllPages;

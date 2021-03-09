const { default: axios } = require("axios");
const { apiUrl } = require("../config/constants");

async function fetchAllCharacters() {
  const start = Date.now();
  // use 1st req to get the count (how many request to fetch the entire character list)
  const {
    data: { count, results: page1results },
  } = await axios.get(`${apiUrl}/people`);

  const requestsToMake = Math.ceil((count - page1results.length) / page1results.length);

  // get all results as an array of unresolved promises
  const results = Array.from(new Array(requestsToMake)).map((_, i) =>
    axios.get(`${apiUrl}/people?page=${i + 2}`).then((res) => {
      return res.data.results;
    })
  );
  return (await Promise.all(results)).flat(); // character[]
}

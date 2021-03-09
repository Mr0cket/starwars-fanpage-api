const axios = require("axios");
let films = [1, 2, 3, 4, 5, 6];

// for (let i = 0; i < 8; i++) {
// films = films.map((id) => axios.get(`https://swapi.dev/api/films/${id}`));

async function getCharLengths() {
  try {
    filmLists = films.map((id) =>
      axios.get(`https://swapi.dev/api/films/${id}`).then((res) => res.data.characters.length)
    );
    const results = await Promise.all(filmLists);
    console.log(results);
  } catch (e) {
    console.log("req error:");
  }
}
// getCharLengths();

const test = axios
  .get("https://swapi.dev/api/films/")
  .then((res) => console.log(res.data.results.length));

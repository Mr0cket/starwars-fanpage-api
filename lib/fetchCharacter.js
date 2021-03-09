const { default: axios } = require("axios");
const { apiUrl } = require("../config/constants");

module.exports = function fetchCharacter(characterId) {
  console.log("url:", `${apiUrl}/people/${characterId}`);
  return axios.get(`${apiUrl}/people/${characterId}`).then((res) => res.data);
};

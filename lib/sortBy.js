const sortByAge = (order) => (character1, character2) => {
  const ascending = order === "ascending";
  console.log("loop");
  // test if either birthyear is unknown
  if (character1.birth_year === "unknown") {
    if (character2.birth_year === "unknown") return 0;
    else return ascending ? -1 : 1;
  }
  if (character2.birth_year === "unknown") return ascending ? 1 : -1;

  const { year: birthYear1, epoch: epoch1 } = parseYear(character1.birth_year);
  const { year: birthYear2, epoch: epoch2 } = parseYear(character2.birth_year);

  // check if either/both strings is BBY
  if (epoch1 === "BBY") {
    if (epoch2 === "BBY") {
      // can compare numbers
      const diff = birthYear1 - birthYear2;
      return ascending ? diff : diff * -1;
    } else return ascending ? 1 : -1;
  }
  if (epoch2 === "BBY") {
    return ascending ? -1 : 1;
  } else {
    // compare numbers
    const diff = birthYear2 - birthYear1;
    return ascending ? diff : diff * -1;
  }
};

const parseYear = (yearString) => ({
  year: Number(yearString.match(/[0-9.]+/)[0]),
  epoch: yearString.match(/[a-zA-Z]+/)[0],
});

const sortByHeight = (order) => (character1, character2) => {
  const diff = Number(character1.height) - Number(character2.height);
  return order === "ascending" ? diff : diff * -1;
};

module.exports = { sortByAge, sortByHeight };

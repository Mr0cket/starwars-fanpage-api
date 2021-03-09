const sortByAge = (order) => {
  return (character1, character2) => {
    const ascending = order === "ascending";
    const birthYear1 = character1.birth_year;
    const birthYear2 = character2.birth_year;
    // check if either birthyear is unknown
    if (birthYear1 === "unknown") {
      if (birthYear2 === "unknown") return 0;
      else return ascending ? 1 : 0;
    }
    // check if string includes BBY (otherwise, will include ABY)
    if (birthYear1.match(/BBY/)) {
      if (birthYear2.match(/BBY/)) {
        // can finally compare numbers
        const age1 = getYear(birthYear1);
        const age2 = getYear(birthYear2);
        const diff = age1 - age2;
        return ascending ? diff : diff * -1;
      } else return ascending ? 1 : -1;
    }
    if (birthYear2.match(/BBY/)) {
      return ascending ? -1 : 1;
    } else {
      // can finally compare numbers
      const age1 = getYear(birthYear1);
      const age2 = getYear(birthYear2);
      const diff = age2 - age1;
      return ascending ? diff : diff * -1;
    }
  };
};

const sortByHeight = (order) => (character1, character2) => {
  const diff = Number(character1.height) - Number(character2.height);
  return order === "ascending" ? diff : diff * -1;
};

const getYear = (yearString) => yearString.match(/[0-9]+/)[0];

module.exports = { sortByAge, sortByHeight };

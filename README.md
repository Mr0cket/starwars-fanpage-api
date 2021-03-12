# StarWars Fan API - Technical Assignment

### A Backend Service which uses [SWAPI](https://swapi.dev/) to provide a powerful insight into the characters, climates and planets of the star wars universe.

### Pre-Reqs:

- `node`

## Installation

1. `git clone` this repo into a local directory
2. install dependencies `npm install`
3. start the server `npm start`.

Server will start locally on port `:4000`

## Endpoints

#### `GET /characters` - Returns all characters of a movie that matches the movie search string

### Query String

- `title` string - Required
- `page` number - optional
- `gender` string - optional `['male', 'female']`
- `sortby` string - optional `['age', 'height']`
- `order` string - optional `['descending', 'ascending']` DEFAULT: 'descending'

### Schema

```js
  {
    page: number
    count: number
    matchedMovies: movieTitle[]
    characters: character[] // max 30 results per page
  }
```

#### `GET /planets/climate/:climateType` - Returns an object of planets (keyed by planet name) with the specified climate type

### parameters

- `climateType` - required `['arid','tropical', 'temperate', 'windy', 'murky', "polluted", "moist", "hot", "unknown" ...???]`

### Query String

#### Schema

```js
  {
    ...
    "planetName": darkHairedCharacter[]
    ...
  }
```

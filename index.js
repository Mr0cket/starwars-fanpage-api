const express = require("express");
const app = express();
const cors = require("cors");
const corsInstance = cors();
const logMiddleware = require("morgan");
const jsonParser = express.json();
const cache = require("./lib/cache");

// Middleware
app.use(corsInstance);
app.use(jsonParser);
app.use(logMiddleware("dev")); // level of verboseness

// Import Routers
const charactersRouter = require("./routers/characters");
const planetsRouter = require("./routers/planets");

// Routes
app.use("/characters", charactersRouter);
app.use("/planets", planetsRouter);

// test routes
app.all("/testytest", (_, res) => res.send("hello"));
app.all("/cache-stats", (_, res) => res.send(cache.stats()));

// start server process
const internalIp = require("internal-ip").v4.sync();
const port = process.env.PORT || 4000;
const httpServer = app.listen(port, () =>
  console.log(`listening on
local:  localhost:${port}
lan:    ${internalIp}:${port}
`)
);

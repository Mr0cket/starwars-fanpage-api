const express = require("express");
const app = express();
const cors = require("cors");
const corsInstance = cors();
const logMiddleware = require("morgan");
const jsonParser = express.json();

// Middleware
app.use(corsInstance);
app.use(jsonParser);
app.use(logMiddleware("dev")); // level of verboseness

// Import Routers
const charactersRouter = require("./routers/characters");

// Routes
app.use("/characters", charactersRouter);

// test route
app.all("/testytest", (_, res) => res.send("hello"));

// start server process
const internalIp = require("internal-ip").v4.sync();
const port = process.env.PORT || 4000;
const httpServer = app.listen(port, () =>
  console.log(`listening on
local:  localhost:${port}
lan:    ${internalIp}:${port}
`)
);

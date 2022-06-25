const express = require("express")
const {
  httpGetAllLaunches,
  httpAddLaunch,
  httpAbortLaunch,
} = require("./launches.controller")

const launchesRouter = express.Router()

launchesRouter.get("/", httpGetAllLaunches)
launchesRouter.post("/", httpAddLaunch)
launchesRouter.delete("/:id", httpAbortLaunch)

module.exports = launchesRouter

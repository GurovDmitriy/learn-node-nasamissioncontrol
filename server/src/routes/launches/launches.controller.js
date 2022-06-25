const {
  getAllLaunches,
  addLaunch,
  abortLaunch,
  getIsExistLaunchWithId,
} = require("../../models/launches.model")

function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches())
}

function httpAddLaunch(req, res) {
  const launch = req.body

  if (!getIsValidLaunch(launch)) {
    return res.status(400).json({ error: "Missing required launch property" })
  }

  launch.launchDate = new Date(launch.launchDate)

  if (!getIsValidDate(launch.launchDate)) {
    return res.status(400).json({ error: "Invalid date format" })
  }

  addLaunch(launch)
  return res.status(201).json(launch)
}

function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id)

  if (!getIsExistLaunchWithId(launchId)) {
    return res.status(404).json({ error: "Launch not found" })
  }

  const aborted = abortLaunch(launchId)
  return res.status(200).json(aborted)
}

function getIsValidLaunch(launch) {
  return launch.mission && launch.rocket && launch.launchDate && launch.target
}

function getIsValidDate(value) {
  return value.toString() !== "Invalid Date"
}

module.exports = {
  httpGetAllLaunches,
  httpAddLaunch,
  httpAbortLaunch,
}

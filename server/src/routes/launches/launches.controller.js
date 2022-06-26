const {
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunch,
  getIsExistLaunchWithId,
} = require("../../models/launches.model")

async function httpGetAllLaunches(req, res) {
  return res.status(200).json(await getAllLaunches())
}

async function httpAddLaunch(req, res) {
  const launch = req.body

  if (!getIsValidLaunch(launch)) {
    return res.status(400).json({ error: "Missing required launch property" })
  }

  launch.launchDate = new Date(launch.launchDate)

  if (!getIsValidDate(launch.launchDate)) {
    return res.status(400).json({ error: "Invalid date format" })
  }

  await scheduleNewLaunch(launch)
  console.log(launch)
  return res.status(201).json(launch)
}

async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id)

  const existsLaunch = await getIsExistLaunchWithId(launchId)

  if (!existsLaunch) {
    return res.status(404).json({ error: "Launch not found" })
  }

  const aborted = await abortLaunch(launchId)

  if (!aborted) {
    return res.status(400).json({ error: "Launch not aborted" })
  }
  return res.status(200).json({ ok: true })
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

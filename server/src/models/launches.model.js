const launchesDB = require("./launches.mongo")
const planets = require("./planets.mongo")

const DEFAULT_FLIGHT_NUMBER = 100

const launches = new Map()

const launch = {
  flightNumber: 100,
  mission: "Keppler Expoloration",
  rocket: "Explorer IS!",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customers: ["NASA", "ZTM"],
  upcoming: true,
  success: true,
}

saveLaunch(launch)

function getIsExistLaunchWithId(launchId) {
  return launches.has(launchId)
}

async function getLatestFlightNumber() {
  const latestLaunches = await launchesDB.findOne().sort("-flightNumber")

  if (!latestLaunches) return DEFAULT_FLIGHT_NUMBER

  return latestLaunches.flightNumber
}

async function getAllLaunches() {
  return await launchesDB.find({}, { _id: 0, __v: 0 })
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  })

  if (!planet) {
    throw new Error("No matching planet found")
  }

  await launchesDB.updateOne(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    { upsert: true }
  )
}

async function scheduleNewLaunch(launch) {
  const newFlightNumber = (await getLatestFlightNumber()) + 1

  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["Zero To Mastery", "NASA"],
    flightNumber: newFlightNumber,
  })

  await saveLaunch(newLaunch)
}

function abortLaunch(launchId) {
  const aborted = launches.get(launchId)
  aborted.upcoming = false
  aborted.success = false
  return aborted
}

module.exports = {
  getAllLaunches,
  // addLaunch,
  scheduleNewLaunch,
  abortLaunch,
  getIsExistLaunchWithId,
}

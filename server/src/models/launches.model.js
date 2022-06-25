// const launches = require("./launches.mongo")

const launches = new Map()

let lastLaunchNum = 100

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

launches.set(launch.flightNumber, launch)

function getIsExistLaunchWithId(launchId) {
  return launches.has(launchId)
}

function getAllLaunches() {
  return Array.from(launches.values())
}

function addLaunch(launch) {
  lastLaunchNum += 1

  launches.set(
    lastLaunchNum,
    Object.assign(launch, {
      upcoming: true,
      success: true,
      flightNumber: lastLaunchNum,
      customer: ["Zero To Mastery", "NASA"],
    })
  )
}

function abortLaunch(launchId) {
  const aborted = launches.get(launchId)
  aborted.upcoming = false
  aborted.success = false
  return aborted
}

module.exports = {
  getAllLaunches,
  addLaunch,
  abortLaunch,
  getIsExistLaunchWithId,
}

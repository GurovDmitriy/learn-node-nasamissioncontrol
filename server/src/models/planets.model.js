const fs = require("fs")
const path = require("path")
const { parse } = require("csv-parse")
const planets = require("./planets.mongo")

function getIsValidDisposition(planet) {
  return planet["koi_disposition"] === "CONFIRMED"
}

function getIsValidInsolationFlux(planet) {
  return planet["koi_insol"] > 0.36 && planet["koi_insol"] < 1.11
}

function getIsValidPlanetRadius(planet) {
  return planet["koi_prad"] < 1.6
}

function getIsHabitablePlanet(planet) {
  return (
    getIsValidDisposition(planet) &&
    getIsValidInsolationFlux(planet) &&
    getIsValidPlanetRadius(planet)
  )
}

function getPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", (data) => {
        if (getIsHabitablePlanet(data)) {
          savePlanet(data)
        }
      })
      .on("error", (err) => {
        console.log(err)
        reject(err)
      })
      .on("end", async () => {
        const countPlanetsFound = (await getAllPlanets()).length
        console.log(`${countPlanetsFound} habitable planets found!`)
        resolve()
      })
  })
}

async function getAllPlanets() {
  return await planets.find({})
}

async function savePlanet(planet) {
  try {
    await planets.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      {
        keplerName: planet.kepler_name,
      },
      { upsert: true }
    )
  } catch (err) {
    console.error(`Could not save planet ${err}`)
  }
}

module.exports = {
  getPlanetsData,
  getAllPlanets,
}

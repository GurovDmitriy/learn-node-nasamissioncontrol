const http = require("http")
const app = require("./app")
const { getPlanetsData } = require("./models/planets.model")
const { mongoConnect } = require("./services/mongo")

const PORT = process.env.PORT || 8000

const server = http.createServer(app)

async function startServer() {
  await mongoConnect()
  await getPlanetsData()

  server.listen(PORT, () => {
    console.log(`listen port ${PORT}`)
  })
}

startServer()

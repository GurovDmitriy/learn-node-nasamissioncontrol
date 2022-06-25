const http = require("http")
const app = require("./app")
const mongoose = require("mongoose")
const { getPlanetsData } = require("./models/planets.model")

const PORT = process.env.PORT || 8000

const MONGO_URL = `mongodb+srv://nasa-api:7sFrNsCYJodH76ob@nasacluster.bsl9h.mongodb.net/nasa?retryWrites=true&w=majority`

const MONGO_CONFIG = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!")
})

mongoose.connection.on("error", (err) => {
  console.error(err)
})

const server = http.createServer(app)

async function startServer() {
  await mongoose.connect(MONGO_URL, MONGO_CONFIG)
  await getPlanetsData()

  server.listen(PORT, () => {
    console.log(`listen port ${PORT}`)
  })
}

startServer()

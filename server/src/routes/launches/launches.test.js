/* eslint-disable no-undef */
const request = require("supertest")
const app = require("../../app.js")

describe("Test GET /launches", () => {
  test("It should respond with 200 success", async () => {
    await request(app)
      .get("/launches")
      .expect("Content-Type", /json/)
      .expect(200)
  })
})

describe("Test POST /launches", () => {
  const completeLaunchData = {
    mission: "USS Enterprise",
    rocket: "NCC 12-39r1",
    target: "Kepler-12345",
    launchDate: "January 4, 2028",
  }

  const completeLaunchWithoutData = {
    mission: "USS Enterprise",
    rocket: "NCC 12-39r1",
    target: "Kepler-12345",
  }

  const completeLaunchWithInvalidDate = {
    mission: "USS Enterprise",
    rocket: "NCC 12-39r1",
    target: "Kepler-12345",
    launchDate: "zoot",
  }

  test("It should respond with 201 success", async () => {
    const response = await request(app)
      .post("/launches")
      .send(completeLaunchData)
      .expect("Content-Type", /json/)
      .expect(201)

    const requestDate = new Date(completeLaunchData.launchDate).valueOf()
    const responseDate = new Date(response.body.launchDate).valueOf()
    expect(responseDate).toBe(requestDate)

    expect(response.body).toMatchObject(completeLaunchWithoutData)
  })

  test("It should catch missing required properties", async () => {
    const response = await request(app)
      .post("/launches")
      .send(completeLaunchWithoutData)
      .expect("Content-Type", /json/)
      .expect(400)

    expect(response.body).toStrictEqual({
      error: "Missing required launch property",
    })
  })

  test("It should catch invalid dates", async () => {
    const response = await request(app)
      .post("/launches")
      .send(completeLaunchWithInvalidDate)
      .expect("Content-Type", /json/)
      .expect(400)

    expect(response.body).toStrictEqual({
      error: "Invalid date format",
    })
  })
})

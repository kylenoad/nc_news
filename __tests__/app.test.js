const endpointsJson = require("../endpoints.json");
const app = require("../app")
const seed = require("../db/seeds/seed")
const request = require("supertest")
const testData = require("../db/data/test-data/index")
const db = require("../db/connection")


beforeEach(() =>{
  return seed(testData)
})

afterAll(() =>{
  return db.end()
})


describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", ()=>{
  test("Should respond with an array of topic objects", ()=>{
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then(({body}) =>{
      const topics = body.topics
      expect(topics.length).toBe(3)
      expect(Array.isArray(topics)).toBe(true)
      topics.forEach((topic)=>{
        expect(topic).toMatchObject({
          description: expect.any(String),
          slug: expect.any(String)
        })
      })
    })
  })
  test("Should respond with a 404 when endpoint is incorrect", ()=>{
    return request(app)
    .get("/api/topicsspeltincorrectly")
    .expect(404)
    .then((response)=>{
      expect(response.body.error).toBe("invalid API endpoint")
    })
  })
})

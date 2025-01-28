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
})

describe("Testing invalid endpoints", ()=>{
  test("Should respond with a 404 when endpoint is incorrect", ()=>{
    return request(app)
    .get("/api/topicsspeltincorrectly")
    .expect(404)
    .then((response)=>{
      expect(response.body.error).toBe("invalid API endpoint")
    })
  })
})

describe("GET /api/articles/:article_id", ()=>{
  test("Should respond with 200 and with an object with the correct properties when given a valid ID", ()=>{
    return request(app)
    .get("/api/articles/1")
    .expect(200)
    .then(({body})=>{
      const article = body.article
      expect(article).toMatchObject({
        author: expect.any(String),
        title: expect.any(String),
        article_id: expect.any(Number),
        body: expect.any(String),
        topic: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String)
      })
    })
  })
  //errors to test
  // - not a number - bad request 400
  // - valid id but not matching article in db
  test("Should respond with 404 when given article id that is correct but the article doesnt exist", ()=>{
    return request(app)
    .get("/api/articles/99999")
    .expect(404)
    .then((response)=>{
      expect(response.body.error).toBe("Article not found")
    })
  })
  test("Should respond with 400 bad request when given a query which is not a number", ()=>{
    return request(app)
    .get("/api/articles/a")
    .expect(400)
    .then((response)=>{
      expect(response.body.error).toBe("Bad request")
    })
  })
})
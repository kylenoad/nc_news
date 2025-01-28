const endpointsJson = require("../endpoints.json");
const app = require("../app")
const seed = require("../db/seeds/seed")
const request = require("supertest")
const testData = require("../db/data/test-data/index")
const db = require("../db/connection")
require("jest-sorted")

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
      expect(response.body.error).toBe("Not found")
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

describe("GET /api/articles", ()=>{
  test("Should respond with a 200 code with an array of all articles",()=>{
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body})=>{
      expect(body.articles.length).toBe(13)
    })
  })
  test("Should respond with 200 status with all articles with added comment_count property", ()=>{
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body})=>{
      body.articles.forEach((article)=>{
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number)
        })
      })
    })
  })
  test("articles should be sorted by date in descending order", ()=>{
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body}) =>{
      expect(body.articles).toBeSorted("created_at", { descending: true })
    })
  })
})
describe("GET /api/articles/:article_id/comments", ()=>{
  test("Should respond with 200 and an object containing the correct properties", () =>{
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(({body})=>{
      expect(body.comments.length).toBe(11)

      body.comments.forEach((comment)=>{
      expect(comment).toMatchObject({
        comment_id: expect.any(Number),
        votes: expect.any(Number),
        created_at: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
        article_id: expect.any(Number)
      })
    })
  })
})
  test("expect 200 and Comments should be served with the most recent comments first", ()=>{
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(({body})=>{
      expect(body.comments).toBeSorted("created_at", {descending: true})
    })
  })
  test("Should return 404 with an article id which is out of range", ()=>{
    return request(app)
    .get("/api/articles/9999/comments")
    .expect(404)
    .then((response)=>{
      expect(response.body.error).toBe("Not found")
  })
})
  test("Should give a 400 when given an article id which is not a number", ()=>{
    return request(app)
    .get("/api/articles/abc/comments")
    .expect(400)
    .then((response)=>{
      expect(response.body.error).toBe("Bad request")
    })
  })

})
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

  test("Should respond with 404 when given article id that is correct but the article doesnt exist", ()=>{
    return request(app)
    .get("/api/articles/99999")
    .expect(404)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Article not found")
    })
  })
  test("Should respond with 400 bad request when given a query which is not a number", ()=>{
    return request(app)
    .get("/api/articles/a")
    .expect(400)
    .then((response)=>{
      expect(response.body.msg).toBe("Bad request")
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
        article_id: 1
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
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Article not found");
  })
})
  test("Should give a 400 when given an article id which is not a number", ()=>{
    return request(app)
    .get("/api/articles/abc/comments")
    .expect(400)
    .then((response)=>{
      expect(response.body.msg).toBe("Bad request")
    })
  })
  test("Should return an empty array if the article exists but has no comments", ()=>{
    return request(app)
    .get("/api/articles/13/comments")
    .expect(200)
    .then((response)=>{
      expect(response.body.comments).toEqual([])
    })
  })
})

describe("POST /api/articles/:article_id/comments", ()=>{
  test("Should respond with 201 status and and object containing the posted comment", ()=>{
    const newComment = {
      username: 'butter_bridge',
      body: "This is a test"
    }
    return request(app)
    .post("/api/articles/1/comments")
    .send(newComment)
    .expect(201)
    .then(({ body })=>{
      expect(body.comment).toMatchObject({
        comment_id: expect.any(Number),
        body: "This is a test",
        article_id: 1,
        author: 'butter_bridge',
        votes: 0,
        created_at: expect.any(String)
      })
    })
  })

  test("Should respond with 400 when article_id is not valid", ()=>{
    const newComment = {
      username: 'butter_bridge',
      body: "This is a test"
    }
    return request(app)
    .post("/api/articles/abc/comments")
    .send(newComment)
    .expect(400)
    .then((response)=>{
      expect(response.body.msg).toBe("Bad request")
    })
  })
  test("Should respond with 404 when article id is valid but is out of range", ()=>{
    const newComment = {
      username: 'butter_bridge',
      body: "This is a test"
    }
    return request(app)
    .post("/api/articles/9999/comments")
    .send(newComment)
    .expect(404)
    .then((response)=>{
      expect(response.body.msg).toBe("Article not found")
    })
  })
  //==================FIX THIS TEST======================
  // test("should respond with 400 when posted object is missing keys", ()=>{
  //   const newComment = {
  //     body: "This is a test"
  //   }
  //   return request(app)
  //   .post("/api/articles/1/comments")
  //   .send(newComment)
  //   .expect(400)
  //   .then((response)=>{
  //     expect(response.body.error).toBe("Bad request")
  //   })
  // })
  test("should respond with 400 when posted object values are the wrong type", ()=>{
    const newComment = {
      username: 1,
      body: 1
    }
    return request(app)
    .post("/api/articles/1/comments")
    .send(newComment)
    .expect(400)
    .then((response)=>{
      expect(response.body.msg).toBe("Bad request")
    })
  })
})

describe("PATCH /api/articles/:article_id", ()=>{
  test("Should respond with 200 and the updated article with amended votes when given a positive number", ()=>{
    return request(app)
    .patch("/api/articles/1")
    .send({ inc_votes : 1 })
    .expect(200)
    .then(({body})=>{
      const article = body.article
      expect(article).toMatchObject({
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: expect.any(String),
        votes: 101,
        article_img_url:
      "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      })
    })
  })
  test("Should update the votes when given a  negative number", ()=>{
    return request(app)
    .patch("/api/articles/1")
    .send({ inc_votes : -1 })
    .expect(200)
    .then(({body})=>{
      const article = body.article
      expect(article).toMatchObject({
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: expect.any(String),
        votes: 99,
        article_img_url:
      "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      })
    })
  })
  test("Should give a 404 when given article which doesnt exist", ()=>{
    return request(app)
    .patch("/api/articles/9999")
    .expect(404)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Article not found")
    })
  })
  test("Should give a 400 when given article_id which isnt a number", ()=>{
    return request(app)
    .patch("/api/articles/abc")
    .send({ inc_votes : 1 })
    .expect(400)
    .then((response)=>{
      expect(response.body.msg).toBe("Bad request")
    })
  })
  test("Should respond with 400 when no votes are sent", ()=>{
    return request(app)
    .patch("/api/articles/1")
    .send({})
    .expect(400)
    .then((response)=>{
      expect(response.body.msg).toBe("Bad request")
    })
  })
  test("Should respond with 400 when inc_votes is not a valid type", ()=>{
    return request(app)
    .patch("/api/articles/1")
    .send({ inc_votes : "one" })
    .expect(400)
    .then((response)=>{
      expect(response.body.msg).toBe("Bad request")
    })
  })
})

describe("DELETE /api/comments/:comment_id", ()=>{
  test("Should respond with a 204 and no content", ()=>{
    return request(app)
    .delete("/api/comments/1")
    .expect(204)
    .then((response)=>{
      expect(response.body).toEqual({})
    })
  })
  test("Should return 404 if comment id is valid but does not exist", ()=>{
    return request(app)
    .delete("/api/comments/9999")
    .expect(404)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Comment not found")
    })
  })
  test("Should return 400 if the comment_id is not valid", ()=>{
    return request(app)
    .delete("/api/comments/one")
    .expect(400)
    .then((response)=>{
      expect(response.body.msg).toBe("Bad request")
    })
  })
})

describe("GET /api/users",()=>{
  test("Should respond with 200 and an array of all users with the correct properties",()=>{
    return request(app)
    .get("/api/users")
    .expect(200)
    .then(({body})=>{
        const users = body.users
        expect(users.length).toBe(4)
        expect(Array.isArray(users)).toBe(true)
        users.forEach((user)=>{
        expect(user).toMatchObject({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String)
        })
      })
    })
  })
})

describe("GET /api/articles (sorting queries)", ()=>{
  test("Should respond with 200 and an array of articles sorted by created_at date decending by default", ()=>{
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body})=>{
      const articles = body.articles
      expect(Array.isArray(articles)).toBe(true)
      expect(articles).toBeSorted({ key: "created_at", descending: true })
    })
  })
  test("Should sort_by selected column in default order of decending", ()=>{
    return request(app)
    .get("/api/articles?sort_by=votes")
    .expect(200)
    .then(({body})=>{
      const articles = body.articles
      expect(articles).toBeSorted(({ key: "votes", descending: true }))
    })
  })
  test("Should sort_by selected column by asending", ()=>{
    return request(app)
    .get("/api/articles?sort_by=votes&order=asc")
    .expect(200)
    .then(({body})=>{
      const articles = body.articles
      expect(articles).toBeSorted(({ key: "votes", ascending: true }))
    })
  })
  test("Should sort_by selected column by decending", ()=>{
    return request(app)
    .get("/api/articles?sort_by=votes&order=desc")
    .expect(200)
    .then(({body})=>{
      const articles = body.articles
      expect(articles).toBeSorted(({ key: "votes", descending: true }))
    })
  })
  test("Should return a 400 error for invalid sort_by column", ()=>{
    return request(app)
    .get("/api/articles?sort_by=invalid_column")
    .expect(400)
    .then(({body})=>{
      expect(body.msg).toBe("Bad request")
    })
  })
  test("Should return a 400 error for invalid order", ()=>{
    return request(app)
    .get("/api/articles?sort_by=votes&order=lowtohigh")
    .expect(400)
    .then(({body})=>{
      expect(body.msg).toBe("Bad request")
    })
  })
})

// describe("GET /api/articles (topic query)", ()=>{
//   test("Should respond with 200 and and return articles filterd by topic", ()=>{
//     return request(app)
//     .get("/api/articles?topic=mitch")
//     .expect(200)
//     .then(({body})=>{
//       const articles = body.articles
//       articles.forEach((article)=>{
//         expect(article.topic).toBe("mitch")
//       })
//     })
//   })
// })

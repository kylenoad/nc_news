const express = require("express")

const { getApiEndpoints } = require("./controllers/endPointcontrollers")
const { getTopics } = require("./controllers/topicsControllers")
const { getArticleById, getArticles, patchArticleById } = require("./controllers/articlesControllers")
const { getCommentsByArticleId, postComment, deleteCommentById } = require("./controllers/commentsControllers")
const { getUsers } = require("./controllers/usersControllers")

const app = express()
app.use(express.json())

app.get("/api", getApiEndpoints)

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.post("/api/articles/:article_id/comments", postComment)

app.patch("/api/articles/:article_id", patchArticleById)

app.delete("/api/comments/:comment_id", deleteCommentById)

app.get("/api/users", getUsers)


//error handling middleware

//invalid endpoints catch-all
app.all("*", (req, res)=>{
    res.status(404).send( { error: "invalid API endpoint" })
})

//404 ERRORS
app.use((err, req, res, next) => {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg })
    } else {
      next(err)
    }
  })


//400 ERRORS
app.use((err, req, res, next)=>{
    //console.log(err)
    if(err.code === "22P02" || err.code === "23502"){
        res.status(400).send({msg: "Bad request"})
    }
    else{
    next(err)
    }
})

//500 ERRORS
app.use((err, req, res, next)=>{
    res.status(500).send({ msg: "Internal Server Error" })
})

module.exports = app
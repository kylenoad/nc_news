const express = require("express")
const app = express()


const { getApiEndpoints } = require("./controllers/endPointcontrollers")
const { getTopics } = require("./controllers/topicsControllers")
const { getArticleById, getArticles } = require("./controllers/articlesControllers")


app.get("/api", getApiEndpoints)

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles", getArticles)


//error handling middleware

//invalid endpoints catch-all
app.all("*", (req, res)=>{
    res.status(404).send( { error: "invalid API endpoint" })
})
//404 ERRORS - custom error - number is valid, but it is out of range
app.use((err, req, res, next)=>{
    if(err.msg === "Article not found"){
        res.status(404).send({error: "Article not found"})
    }
    else{
        next(err)
    }
})

//400 ERRORS
app.use((err, req, res, next)=>{
    //console.log(err)
    if(err.code === "22P02"){
        res.status(400).send({error: "Bad request"})
    }
})


//500 ERRORS
app.use((err, req, res, next)=>{
    res.status(500).send({ msg: "Internal Server Error" })
})

module.exports = app
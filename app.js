const express = require("express")
const app = express()

const { getApiEndpoints } = require("./controllers/endPointcontrollers")
const { getTopics } = require("./controllers/topicsControllers")

app.get("/api", getApiEndpoints)
app.get("/api/topics", getTopics)


//error handling middleware

//404 ERRORS
app.all("*", (req, res)=>{
    res.status(404).send( { error: "invalid API endpoint" })
})

//400 ERRORS

//500 ERRORS
app.use((err, req, res, next)=>{
    res.status(500).send({ msg: "Internal Server Error" })
})

module.exports = app
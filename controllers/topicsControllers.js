const {fetchTopics} = require("../models/topicsModels")

const getTopics = (request, response, next) =>{
    fetchTopics()
    .then((topics)=>{
        response.status(200).send({topics})
    })
    .catch((err)=>{
        next(err)
    })
}


module.exports = { getTopics }
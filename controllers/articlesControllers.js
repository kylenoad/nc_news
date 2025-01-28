const {fetcharticlesById} = require("../models/articlesModels")


const getArticleById = (request, response, next) =>{
    const {article_id} = request.params
    fetcharticlesById(article_id)
    .then((article)=>{
        response.status(200).send({article})
    })
    .catch((err)=>{
        next(err)
    })
}

module.exports = { getArticleById }
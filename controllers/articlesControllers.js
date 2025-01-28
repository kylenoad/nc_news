const {fetcharticlesById, fetchArticles} = require("../models/articlesModels")


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

const getArticles = (request, response, next) =>{
    fetchArticles()
    .then((articles)=>{
        response.status(200).send({articles})
    })
    .catch((err)=>{
        next(err)
    })
}



module.exports = { getArticleById, getArticles }
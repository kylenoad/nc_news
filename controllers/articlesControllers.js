const { fetcharticlesById, fetchArticles, updateVotes } = require("../models/articlesModels")


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
    const {sort_by, order} = request.query
    fetchArticles(sort_by, order)
    .then((articles)=>{
        response.status(200).send({articles})
    })
    .catch((err)=>{
        next(err)
    })
}

const patchArticleById = (request, response, next) =>{
    const { article_id } = request.params
    const newVotes = request.body.inc_votes
    updateVotes(article_id, newVotes)
    .then((article) =>{
        response.status(200).send({article})
    })
    .catch((err)=>{
        next(err)
    })
}

module.exports = { getArticleById, getArticles, patchArticleById }
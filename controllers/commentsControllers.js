const { fetchCommentsByArticleID } = require("../models/commentsModels")

const getCommentsByArticleId = (request, response, next) =>{
    const {article_id} = request.params
    fetchCommentsByArticleID(article_id)
    .then((comments)=>{
        response.status(200).send({comments})
    })
    .catch((err)=>{
        next(err)
    })
}

module.exports = { getCommentsByArticleId }
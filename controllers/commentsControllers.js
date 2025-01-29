const { fetchCommentsByArticleID, insertComment, deleteComment } = require("../models/commentsModels")

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

const postComment = (request, response, next) =>{
    const { username, body } = request.body
    const { article_id } = request.params
    insertComment(username, body, article_id)
    .then((comment)=>{
        response.status(201).send({ comment })
    })
    .catch((err)=>{
        next(err)
    })
}

const deleteCommentById = (request, response, next) =>{
    const { comment_id } = request.params
    deleteComment(comment_id)
    .then(()=>{
        response.status(204).send({})
    })
    .catch((err)=>{
        next(err)
    })
}

module.exports = { getCommentsByArticleId, postComment, deleteCommentById }
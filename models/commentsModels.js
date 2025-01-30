const db = require("../db/connection")

const fetchCommentsByArticleID = (article_id) => {
    return db
    .query('SELECT * FROM articles WHERE article_id=$1', [article_id]) //check if article exists. If not reject
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Article not found" })
        }

        else{ //if article exists return the comments or empty array if no comment son article
            return db
        .query('SELECT * FROM comments WHERE article_id=$1 ORDER BY created_at DESC', [article_id])
        .then(({ rows }) => {
            return rows
        })
    }
    })
}

const insertComment = (username, body, article_id) => {

    if (!username || !body || typeof username !== "string" || typeof body !== "string" ) {
        return Promise.reject({ status: 400, msg: "Bad request" })
    }

    return db.query(
        'SELECT * FROM articles WHERE article_id = $1',
        [article_id]
    )
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: "Article not found"
                })
            }
            else {
                return db.query(
                    `INSERT INTO comments (author, body, article_id) 
                 VALUES ($1, $2, $3) 
                 RETURNING *;`,
                    [username, body, article_id]
                )}
            })
        .then(({ rows }) => {
            return rows[0]
        })
}

const deleteComment = (comment_id) =>{
    return db.query(`
        DELETE FROM comments
        WHERE comment_id = $1
        RETURNING *
        `, [comment_id])
    .then(({rows})=>{
        if(rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: "Comment not found"
            })
        }
        else{
            return rows[0]
        }
    })
}

module.exports = { fetchCommentsByArticleID, insertComment, deleteComment }
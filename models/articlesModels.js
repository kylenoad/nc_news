const db = require("../db/connection")

const fetcharticlesById = (article_id) =>{
    return db
    .query("SELECT * FROM articles WHERE article_id=$1",
        [article_id]
    )
    .then(({rows})=>{
        if(rows.length === 0){
            return Promise.reject({ status: 404, msg: "Article not found" })
        }
        else{
        return rows[0]
        }
    })
}

const fetchArticles = () => {
    return db
    .query(`
        SELECT 
          articles.author, 
          articles.title, 
          articles.article_id, 
          articles.topic, 
          articles.created_at, 
          articles.votes, 
          articles.article_img_url, 
          COUNT(comments.comment_id) :: INT AS comment_count
        FROM articles
        LEFT JOIN comments ON comments.article_id = articles.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC
      `)
    .then((result) => {
        return result.rows
    })
}

const updateVotes = (article_id, newVotes) =>{
    return db.query(
        `
        UPDATE articles
        SET votes = votes +$2
        WHERE article_id = $1
        RETURNING *
        `, 
        [article_id, newVotes]
    )
    .then(({rows})=>{
        if(rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: "Article not found"
            })
        }
        return rows[0]
    })
}

module.exports = { fetcharticlesById, fetchArticles, updateVotes}

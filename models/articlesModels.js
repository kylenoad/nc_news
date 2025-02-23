const db = require("../db/connection");

const fetcharticlesById = (article_id) => {
  return db
    .query(
      `
        SELECT
          articles.author, 
          articles.title, 
          articles.article_id, 
          articles.body,
          articles.topic, 
          articles.created_at, 
          articles.votes, 
          articles.article_img_url, 
          COUNT(comments.comment_id) :: INT AS comment_count
        FROM articles
        LEFT JOIN comments ON comments.article_id = articles.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        //=============>make this a reusable function when refactoring<==================
        return Promise.reject({ status: 404, msg: "Article not found" });
      } else {
        return rows[0];
      }
    });
};

const fetchArticles = (sort_by = "created_at", order = "DESC", topic) => {
  const validSortbyQueries = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "comment_count",
  ];
  const validOrders = ["ASC", "DESC"];

  if (sort_by && !validSortbyQueries.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      msg: "Bad request",
    });
  }

  if (order && !validOrders.includes(order.toUpperCase())) {
    return Promise.reject({
      status: 400,
      msg: "Bad request",
    });
  }

  let sqlQuery = `
        SELECT 
          articles.author, 
          articles.title, 
          articles.article_id, 
          articles.body,
          articles.topic, 
          articles.created_at, 
          articles.votes, 
          articles.article_img_url, 
          COUNT(comments.comment_id) :: INT AS comment_count
        FROM articles
        LEFT JOIN comments ON comments.article_id = articles.article_id
      `;
  let queryParams = [];

  if (topic) {
    sqlQuery += ` WHERE articles.topic = $1`;
    queryParams.push(topic);
  }
  sqlQuery += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;

  return db.query(sqlQuery, queryParams).then((result) => {
    if (result.rows.length === 0) {
      //=============>make this a reusable function when refactoring<==================
      return Promise.reject({
        status: 404,
        msg: "Article not found",
      });
    }
    return result.rows;
  });
};

const updateVotes = (article_id, newVotes) => {
  return db
    .query(
      `
        UPDATE articles
        SET votes = votes +$2
        WHERE article_id = $1
        RETURNING *
        `,
      [article_id, newVotes]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article not found",
        });
      }
      return rows[0];
    });
};

const insertArticle = (title, body, topic, author, article_img_url) => {
  return db
    .query(
      `
      INSERT INTO articles (title, body, topic, author, article_img_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
      `,
      [title, body, topic, author, article_img_url]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

module.exports = {
  fetcharticlesById,
  fetchArticles,
  updateVotes,
  insertArticle,
};

const {
  fetcharticlesById,
  fetchArticles,
  updateVotes,
  insertArticle,
  deleteArticleById,
} = require("../models/articlesModels");

const getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  fetcharticlesById(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticles = (request, response, next) => {
  const { sort_by, order, topic } = request.query;
  fetchArticles(sort_by, order, topic)
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

const patchArticleById = (request, response, next) => {
  const { article_id } = request.params;
  const newVotes = request.body.inc_votes;
  updateVotes(article_id, newVotes)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

const postArticle = (request, response, next) => {
  const { title, body, topic, author, article_img_url } = request.body;
  insertArticle(title, body, topic, author, article_img_url)
    .then((article) => {
      response.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

const deleteArticle = (request, response, next) => {
  const { article_id } = request.params;

  if (isNaN(article_id)) {
    return response.status(400).send({ msg: "Bad request" });
  }

  deleteArticleById(article_id)
    .then((deletedArticle) => {
      if (!deletedArticle) {
        return response.status(404).send({ msg: "Article not found" });
      }
      response.status(200).send({ deletedArticle });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getArticleById,
  getArticles,
  patchArticleById,
  postArticle,
  deleteArticle,
};

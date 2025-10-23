const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { getUsers } = require("./controllers/users.controller");
const { getArticles, getArticleById } = require("./controllers/articles.controller");
const { getCommentsForArticle, addCommentToArticle } = require("./controllers/comments.controller");

const { handleNotFoundError, handleInvalidInputError, handleUnexpectedError } = require("./errors");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/users", getUsers);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsForArticle);

app.post("/api/articles/:article_id/comments", addCommentToArticle)

app.use(handleNotFoundError);  
app.use(handleInvalidInputError);  
app.use(handleUnexpectedError);

module.exports = app;
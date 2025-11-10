const express = require("express");
const cors = require('cors');

const app = express();
app.use(cors());

app.use(express.json());
app.use("/api", express.static("public"));

const { getTopics } = require("./controllers/topics.controller");
const { getUsers } = require("./controllers/users.controller");
const { getArticles, getArticleById, patchArticleVotes } = require("./controllers/articles.controller");
const { getCommentsForArticle, addCommentToArticle, deleteCommentById } = require("./controllers/comments.controller");

const { handleNotFoundError, handleInvalidInputError, handleUnexpectedError } = require("./errors");

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/users", getUsers);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsForArticle);
app.post("/api/articles/:article_id/comments", addCommentToArticle)
app.patch('/api/articles/:article_id', patchArticleVotes)
app.delete("/api/comments/:comment_id", deleteCommentById)

app.use(handleNotFoundError);  
app.use(handleInvalidInputError);  
app.use(handleUnexpectedError);

module.exports = app;
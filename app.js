const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { getArticles } = require("./controllers/articles.controller")
const { getUsers } = require("./controllers/users.controller");
const { getArticles, getArticleById } = require("./controllers/articles.controller");


const app = express();

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/users", getUsers);
app.get("/api/articles/:article_id", getArticleById);

//error handling

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") return res.status(400).send({ msg: "Invalid article_id" });
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) return res.status(err.status).send({ msg: err.msg });
  console.error(err);
  res.status(500).send({ msg: "Internal Server Error" });
});




















module.exports = app;
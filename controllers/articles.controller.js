const { selectArticles, selectArticleById } = require("../models/articles.model");

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;

  selectArticles(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  if (isNaN(article_id)) {
    return res.status(400).send({ msg: "Bad request" });
  }

  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

const { updateArticlesVote } = require("../models/articles.model")

exports.patchArticleVotes = (req, res, next) => {
  const {article_id} = req.params;
  const {inc_votes} = req.body;

  if(inc_votes === undefined){
    return res.status(400).send({msg: "Bad request, missing inc_votes"});
  }

  if (typeof inc_votes !== 'number')
    return res.status(400).send({msg: "Bad request, inc_votes must be a number"});
    
  

  updateArticlesVote(article_id, inc_votes)
   .then((updatedArticle) => {
    res.status(200).send({article: updatedArticle});
   })
   .catch(next);
  };
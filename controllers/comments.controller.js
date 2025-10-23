const { selectCommentsForArticle } = require("../models/comments.model");

exports.getCommentsForArticle = (req, res, next) => {
  const { article_id } = req.params;

  if (isNaN(article_id)) {
    return res.status(400).send({ msg: "Bad request" });
  }

  selectCommentsForArticle(article_id)
    .then((comments) => {
      if (comments.length === 0) {  
        return res.status(404).send({ msg: "Article not found" });
      }
      res.status(200).send({ comments });  
    })
    .catch(next);  
};
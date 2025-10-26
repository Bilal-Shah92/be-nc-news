const { selectCommentsForArticle, insertComment, removeCommentById } = require("../models/comments.model");

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

exports.addCommentToArticle = (req, res, next) => {
  const { article_id } = req.params;  
  const { username, body } = req.body; 

 
  if (isNaN(article_id)) {
    return res.status(400).send({ msg: "Bad request" });  
  }

  if (!username || !body) {
    return res.status(400).send({ msg: "Missing required fields" });
  }

  insertComment(article_id, username, body)
    .then((comment) => {
      
      res.status(201).send({ comment });
    })
    .catch(next);  
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  if(isNaN(comment_id)){
    return res.status(400).send({ msg: "Bad request"})
  }

  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send()
    })
    .catch(next)
}
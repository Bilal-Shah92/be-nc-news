const db = require("../db/connection");

exports.selectCommentsForArticle = (articleId) => {
  return db
    .query(
      `SELECT comment_id, votes, created_at, author, body, article_id
       FROM comments
       WHERE article_id = $1
       ORDER BY created_at DESC;`,
      [articleId]
    )
    .then(({ rows }) => {
      return rows;  
    });
};

exports.insertComment = (articleId, username, body) => {
  return db
    .query(
      `INSERT INTO comments (article_id, author, body) 
       VALUES ($1, $2, $3) 
       RETURNING comment_id, article_id, author, body, created_at;`,
      [articleId, username, body]
    )
    .then(({ rows }) => rows[0]); 
};

exports.removeCommentById = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [comment_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      }
    });
};
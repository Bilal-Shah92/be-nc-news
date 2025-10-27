const db = require("../db/connection");

exports.selectArticles = (sort_by = "created_at", order = "desc") => {

  const validSortColumns = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];

  if(!validSortColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort_by column"})
  }

  const lowerCaseOrder = order.toLowerCase();
    if (lowerCaseOrder !== "asc" && lowerCaseOrder !== "desc"){
      return Promise.reject({ status: 400, msg: "Invalid order query"})
    }

    return db
    .query(
        `SELECT
         articles.author,
         articles.title,
         articles.article_id,
         articles.topic,
         articles.created_at,
         articles.votes,
         articles.article_img_url,
         COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${lowerCaseOrder};
    `
    )
    .then((result) => {
        return result.rows;
    });
  };


exports.selectArticleById = (articleId) => {
  return db
    .query(`
      SELECT 
      author, 
      title, 
      article_id, 
      body, 
      topic, 
      created_at, 
      votes, 
      article_img_url
      FROM articles
      WHERE article_id = $1;
    `, [articleId])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return rows[0];
    });
}

exports.updateArticlesVote = (article_id, inc_votes) => {
  return db
   .query(`
     UPDATE articles
     SET votes = votes + $1
     WHERE article_id = $2
     RETURNING *`,
     [inc_votes, article_id]
    )
    .then((result) => {
      if(result.rows.length === 0){
        return Promise.reject({ status: 404, msg: "Article not found"});
      }
      return result.rows[0]
    });
};

const { convertTimestampToDate } = require("../seeds/utils") 
const pgFormat = require("pg-format")
const db = require("../connection")

const seed = async ({ topicData, userData, articleData, commentData }) => {
  
  await db.query('DROP TABLE IF EXISTS comments;');
  await db.query('DROP TABLE IF EXISTS articles;');
  await db.query('DROP TABLE IF EXISTS users;');
  await db.query('DROP TABLE IF EXISTS topics;');


await db.query(`
CREATE TABLE topics (
  slug VARCHAR PRIMARY KEY,
  description VARCHAR,
  img_url VARCHAR(1000)
)
  `);

  const topicsFormatted = pgFormat(
    `INSERT INTO topics(slug, description, img_url)
    VALUES %L
    RETURNING *;`,
    topicData.map(({slug, description, img_url}) => [slug, description, img_url])
  );
  await db.query(topicsFormatted);

await db.query(`
CREATE TABLE users (
  username VARCHAR PRIMARY KEY,
  name VARCHAR,
  avatar_url VARCHAR(1000)
)
  `);

  const usersFormatted = pgFormat(
    `INSERT INTO users(username, name, avatar_url)
    VALUES %L
    RETURNING *;`,
    userData.map(({username, name, avatar_url}) => [username, name, avatar_url])
  );
  await db.query(usersFormatted);

await db.query(`
CREATE TABLE articles (
  article_id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  topic VARCHAR REFERENCES topics(slug),
  author VARCHAR REFERENCES users(username),
  body TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  votes INT NOT NULL DEFAULT 0,
  article_img_url VARCHAR(1000)
);
  `);

  const articleTimestampsFormatted = articleData.map(convertTimestampToDate);

  const articlesFormatted = pgFormat(
    `INSERT INTO articles(title, topic, author, body, created_at, votes, article_img_url)
    VALUES %L
    RETURNING *;`,
    articleTimestampsFormatted.map(({title, topic, author, body, created_at, votes, article_img_url}) => [title, topic, author, body, created_at, votes ?? 0, article_img_url])
  );
  await db.query(articlesFormatted);

await db.query(`
CREATE TABLE comments (
  comment_id SERIAL PRIMARY KEY,
  article_id INT REFERENCES articles(article_id),
  body TEXT NOT NULL,
  votes INT NOT NULL DEFAULT 0,
  author VARCHAR REFERENCES users(username),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)
  `);
    
    const commentTimestampsFormatted = commentData.map(convertTimestampToDate);
    const commentsFormatted = pgFormat(
    `INSERT INTO comments(body, votes, author, created_at, article_id)
    VALUES %L
    RETURNING *;`,
    commentTimestampsFormatted.map(({body, votes, author, created_at, article_id}) => [body, votes ?? 0, author, created_at, article_id])
  );
  await db.query(commentsFormatted);

};

module.exports = seed;

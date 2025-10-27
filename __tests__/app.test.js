const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
expect.extend(require("jest-sorted"));

beforeEach(() => seed(testData));
afterAll(() => db.end());

//question 1
describe("GET /api/topics", () => {
  test("respond with an object with the key of topics and the value of an array of topic objects. Each of which should have the following properties, slug and description", () => {
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then((response) => {
      expect(response.body.topics.length).toBeGreaterThan(0);
   });
  });
});

//question 2
  describe("GET /api/articles", () => {
    test("respond with an object with the key of articles and the value of an array of article objects", () => {
      return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
      expect(response.body.articles.length).toBeGreaterThan(0);
      });
  });
    
    test("articles should be sorted by date in descending order", () => {
      return request(app)
       .get("/api/articles")
       .expect(200)
       .then((response) => {
          const articles = response.body.articles;
          const newest = new Date(articles[0].created_at);
          const oldest = new Date(articles[articles.length - 1].created_at);
          expect(newest > oldest).toBe(true); 
   });
  });

    test("there should not be a body property present on any of the article objects", () => {
      return request(app)
       .get("/api/articles")
       .expect(200)
       .then((response) => {
       response.body.articles.forEach((article) => {
      expect(article).not.toHaveProperty("body");
    });
  });
 });
});

//question 3
  describe("GET /api/users", () => {
    test("should respond with an object with the key of users and the value of an array of objects", () => {
      return request(app)
       .get("/api/users")
       .expect(200)
       .then((response) => {
       expect(response.body.users.length).toBeGreaterThan(0);

       const user = response.body.users[0];
       expect(user).toHaveProperty("username");
       expect(user).toHaveProperty("name");
       expect(user).toHaveProperty("avatar_url");
    });
  });
});

//question 4
  describe("GET /api/articles/:article_id", () => {
    test("should respond with an object with the key of article and the value of an article object", async () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const body = response.body;
        expect(body.article).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: 1,
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          })
        );
      });
  });

   test("400: responds with 'Bad request' when article_id is not a number", () => {
    return request(app)
      .get("/api/articles/not-a-number")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

  test("404: responds with 'Article not found when article_id does not exist", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article not found");
      });
  });

  // question 5
  describe("GET /api/articles/:article_id/comments", () => {
  test("should return an object with the key of comments and the value of an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toBeInstanceOf(Array);
        expect(response.body.comments.length).toBeGreaterThan(0);  
      });
  });

     test("should return 400 for invalid article_id", () => {
    return request(app)
      .get("/api/articles/not-a-number/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });

  test("should return 404 for non-existent article_id", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article not found");
      });
  });
});

//question 6

describe("POST /api/articles/:article_id/comments", () => {
  test("should return a 400 if username is missing", () => {
    const newComment = { body: "good" };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Missing required fields");
      });
  });
})

  //question 7

  describe("PATCH /api/articles/:article_id", () => {
    test("should update an articles votes", () => {
    
    const articleId = 1

    return request(app)
      .patch(`/api/articles/${articleId}`) 
      .send({ inc_votes: 5 })
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body.article.votes).toBe(105);
    })
})

 test("should return an error if article does not exist", () => {
    const articleId = 9999;

    return request(app)
      .patch(`/api/articles/${articleId}`)
      .send({ inc_votes: 5 })
      .then((response) => {
        expect(response.status).toBe(404);
        expect(response.body.msg).toBe("Article not found");
      });
  });

    test("should return an error if inc_votes is missing", () => {
    const articleId = 1; 

    return request(app)
      .patch(`/api/articles/${articleId}`)
      .send({})
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body.msg).toBe("Bad request, missing inc_votes");
      });
  });

  test("should return an error if inc_votes is not a number", () => {
    const articleId = 1; 

    return request(app)
      .patch(`/api/articles/${articleId}`)
      .send({ inc_votes: "five" })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body.msg).toBe("Bad request, inc_votes must be a number");
      });
  });
})

  //question 8
  describe("DELETE /api/comments/:comment_id", () => {
    test("deletes the comment by comment_id and responds with status 204 and no content", () => {
    
     return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then((response) => {
      expect(response.body).toEqual({});
      });
  });

   test("responds with 'Comment not found' for valid but non-existent id", () => {

    return request(app)
      .delete("/api/comments/9999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Comment not found");
      });
  });

  test("responds with 'Bad request' when comment_id is not a number", () => {

    return request(app)
      .delete("/api/comments/not-a-number")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
})

  //question 9
   describe("GET /api/articles (sorting queries)", () => {
     test("sorts by created_at desc by default", () => {
     
      return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });

   test("sorts by votes asc when order=asc", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("votes");
      });
  });

  test("should return invalid sort_by column", () => {
    return request(app)
      .get("/api/articles?sort_by=unknown_column")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid sort_by column");
      });
  });

   test("should return Invalid order query", () => {
    return request(app)
      .get("/api/articles?order=not_correct_order")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid order query");
      });
  });
});

  //question 10
describe("GET /api/articles(topic query)", () => {
  test("responds with only articles from the given topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBeGreaterThan(0);
        body.articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
    })

      test("responds with empty array if topic exists but has no articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual([]);
      });
  });

  test("responds with Topic not found' if topic does not exist", () => {
    return request(app)
      .get("/api/articles?topic=notarealtopic")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Topic not found");
      });
  });

  //question 11
  describe("GET /api/articles/:article_id (comment_count)", () => {
  test("should return article including comment_count", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toHaveProperty("comment_count", expect.any(Number));
      });
  });

  test("should return comment_count as 0 when no comments", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        expect(body.article.comment_count).toBe(0);
      });
  });
});
});

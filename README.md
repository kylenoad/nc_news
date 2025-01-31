# Project Name: KN News

## Live Demo available [here](https://kn-news.onrender.com/api)

##Project Overview

##Setup
1. Clone repositary: https://github.com/kylenoad/nc_news.git
2. Run npm i to install the dependencies 

You will need to create two .env files for your project: .env.test and .env.development. Into each, add PGDATABASE=, with the correct database name for that environment (see /db/setup.sql for the database names)

##Available endpoints
GET /api - list of available end points and expected response 
GET /api/topics
GET /api/articles
GET /api/users
GET /api/articles/:article_id
GET /api/articles/:article_id/comments
POST /api/articles/:article_id/comments
PATCH /api/articles/:article_id
DELETE /api/comments/:comment_id



  "devDependencies": {
    "husky": "^8.0.2",
    "jest": "^27.5.1",
    "jest-extended": "^2.0.0",
    "jest-sorted": "^1.0.15",
    "pg-format": "^1.0.4",
    "supertest": "^7.0.0"
  },
  "dependencies": {
    "dotenv": "^16.0.0",
    "express": "^4.21.2",
    "pg":

## Live Demo available [here](https://kn-news.onrender.com/api)

## Project Overview
The project is a RESTful API backend that enables users to interact with a database of articles, topics, and comments. This API provides various endpoints that allow users to perform CRUD (Create, Read, Update, Delete) operations on the data, with additional sorting and filtering functionality.

The API is built using javascript, Node.js, Express, and PostgreSQL.

## Setup
1. Clone repositary: https://github.com/kylenoad/nc_news.git
2. Run npm i to install the dependencies
3. You will need to create two .env files for your project: .env.test and .env.development. Into each, add PGDATABASE=, with the correct database name for that environment (see /db/setup.sql for the database names)
4. Seed the database: npm run seed
5. Check everything is working: npm run test

## Requirements
- `Node.js v
- PostgreSQL v


## Available Endpoints
- `GET /api` - List of available endpoints and expected response
- `GET /api/topics`
- `GET /api/articles`
- `GET /api/users`
- `GET /api/articles/:article_id`
- `GET /api/articles/:article_id/comments`
- `POST /api/articles/:article_id/comments`
- `PATCH /api/articles/:article_id`
- `DELETE /api/comments/:comment_id`

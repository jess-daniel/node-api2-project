const express = require("express");

const postRouter = require("./posts/posts-router");

const server = express();

const port = 5000;

// Middlewares
server.use(express.json());

// Routes
server.use("/api/posts", postRouter);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

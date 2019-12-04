/** @format */

const express = require("express");

// database functions
const db = require("../data/db");

const router = express.Router();

// GET all posts
router.get("/", (req, res) => {
  db.find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "Server error", err });
    });
});

// GET specific post by id
router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then(post => {
      if (post.length > 0) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The post information could not be retrieved.", err });
    });
});

// GET comments of a specific post by id
router.get("/:id/comments", (req, res) => {
  const { id } = req.params;
  db.findCommentById(id)
    .then(comment => {
      if (comment.length > 0) {
        res.status(200).json(comment);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: "The comments information could not be retrieved.",
        err
      });
    });
});

// POST a new post
router.post("/", (req, res) => {
  const postData = req.body;
  if (postData.title && postData.contents) {
    db.insert(postData)
      .then(post => {
        const newPost = { ...postData, ...post };
        res.status(201).json(newPost);
      })
      .catch(err => {
        res.status(500).json({
          error: "There was an error while saving the post to the database",
          err
        });
      });
  } else {
    res
      .status(400)
      .json({ errorMessage: "Please provide title and contents for the post" });
  }
});

// POST a new comment
router.post("/:id/comments", (req, res) => {
  const { text } = req.body;
  const { id } = req.params;
  if (text) {
    db.findById(id)
      .then(post => {
        if (post.length) {
          const newComment = { text, post_id: id };
          db.insertComment(newComment)
            .then(comment => {
              res.status(201).json({ ...comment, ...newComment });
            })
            .catch(err => {
              res.status(500).json({ message: "Server error", err });
            });
        } else {
          res.status(404).json({
            message: "The post with the specified ID does not exist."
          });
        }
      })
      .catch(err => {
        res.status(500).json({ message: "Server error", err });
      });
  } else {
    res
      .status(400)
      .json({ errorMessage: "Please provide text for the comment." });
  }
});

// PUT a post
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  if (changes.title && changes.contents) {
    db.update(id, changes).then(updatedPost => {
      if (updatedPost) {
        const newPost = { ...updatedPost, ...changes };
        res.status(200).json(newPost);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    });
  } else {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  }
});

// DELETE a post
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.remove(id)
    .then(removed => {
      if (removed) {
        res.status(200).json(removed);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "The post could not be deleted.", err });
    });
});

module.exports = router;

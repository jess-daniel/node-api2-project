const express = require("express");

// database functions
const db = require("../data/db");

const router = express.Router();

router.get("/", (req, res) => {
    db.find()
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "Server error", err });
    })
})

module.exports = router;
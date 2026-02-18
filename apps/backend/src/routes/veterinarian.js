const express = require ("express");
const { route } = require("./auth");

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        message: "Veterinarian endpoint working"
    });
});

module.exports = router;
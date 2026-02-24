const express = require('express');

const router = express.Router();

const {
    getAll,
    getById,
    create,
    update
} = require("../controllers/responsiblesController");


router.get("/", getAll);
router.get("/:id", getById);
router.post("/", create);
router.put("/:id", update);

module.exports = router;
const express = require('express');

const validateData = require("../middleware/validateData");
const { responsibleSchema, updateResponsibleSchema } = require("../schemas/responsibleSchema");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const {
    getAll,
    getById,
    create,
    update
} = require("../controllers/responsiblesController");

router.use(protect);

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", validateData(responsibleSchema), create);
router.put("/:id", validateData(updateResponsibleSchema), update);

module.exports = router;
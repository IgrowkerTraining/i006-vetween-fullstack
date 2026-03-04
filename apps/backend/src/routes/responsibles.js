const express = require('express');

const validateData = require("../middleware/validateData");
const { responsibleSchema, updateResponsibleSchema } = require("../schemas/responsibleSchema");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const responsiblesController = require("../controllers/responsiblesController.js");

router.use(protect);

router.get("/", responsiblesController.getAll);
router.get("/:id", responsiblesController.getById);
router.post("/", validateData(responsibleSchema), responsiblesController.create);
router.patch("/:id", validateData(updateResponsibleSchema), responsiblesController.update);

module.exports = router;
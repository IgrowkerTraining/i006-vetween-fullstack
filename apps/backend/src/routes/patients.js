const express = require("express");
const router = express.Router();
const patientsController = require("../controllers/patientsController.js");


router.get("/", patientsController.getAll);
router.get("/:id", patientsController.getById);
router.post("/", patientsController.create);
router.put("/:id", patientsController.update);
router.delete("/:id", patientsController.remove);

module.exports = router;
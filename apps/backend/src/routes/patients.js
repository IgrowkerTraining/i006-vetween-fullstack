const express = require("express");
const router = express.Router();
const patientsController = require("../controllers/patientsController.js");
const visitController = require("../controllers/visitController");
const vaccineController = require("../controllers/vaccineController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", patientsController.getAll);
router.get("/:id", patientsController.getById);
router.post("/", patientsController.create);
router.put("/:id", patientsController.update);
router.delete("/:id", patientsController.remove);
router.get("/:id/visitas", protect, visitController.getPatientVisits);
router.get("/:id/vacunas", protect, vaccineController.getPatientVaccines);

module.exports = router;
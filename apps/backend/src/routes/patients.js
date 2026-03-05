const express = require("express");
const router = express.Router();
const patientsController = require("../controllers/patientsController.js");
const visitController = require("../controllers/visitController");
const vaccineController = require("../controllers/vaccineController");

const validateData = require("../middleware/validateData");
const { patientSchema, updatePatientSchema } = require("../schemas/patientSchema");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", patientsController.getAll);
router.get("/:id", patientsController.getById);
router.post("/", validateData(patientSchema),patientsController.create);
router.patch("/:id", validateData(updatePatientSchema), patientsController.update);
router.delete("/:id", patientsController.remove);

//Rutas para visitas y vacunas de un paciente
router.get("/:id/visitas", visitController.getPatientVisits);
router.get("/:id/vacunas", vaccineController.getPatientVaccines);

module.exports = router;
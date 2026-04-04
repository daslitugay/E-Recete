const { expressjwt } = require('express-jwt');
const auth = expressjwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload',
    algorithms: ['SHA1','RS256','HS256']
});

var express = require('express');
var router = express.Router();
var prescriptionController = require('../controllers/prescriptionController');
var medicationController = require('../controllers/medicationController');
var authController =require('../controllers/auth');

router.post('/register', authController.register);   
router.post('/login', authController.login);

router
.route('/prescriptions')
.get(prescriptionController.prescriptionList)
.post(prescriptionController.prescriptionCreate);

router
.route('/prescriptions/:prescriptionId')
.get(prescriptionController.prescriptionReadOne)
.put(prescriptionController.prescriptionUpdateOne)
.delete(prescriptionController.prescriptionDeleteOne);

router
.route('/medications')
.get(medicationController.medicationList)
.post(medicationController.medicationCreate);

router
.route('/medications/:medicationId')
.get(medicationController.medicationReadOne)
.put(medicationController.medicationUpdateOne)
.delete(medicationController.medicationDeleteOne);

router
.route('/prescriptions/:prescriptionId/medications')
.get(prescriptionController.getMedicationsForPrescription)
.post(prescriptionController.addMedicationToPrescription);

router
.route('/prescriptions/:prescriptionId/medications/:medicationId')
.get(prescriptionController.getMedicationForPrescription)
.put(prescriptionController.updateMedicationForPrescription)
.delete(prescriptionController.removeMedicationFromPrescription);

module.exports = router;
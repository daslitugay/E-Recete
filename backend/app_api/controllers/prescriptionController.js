var mongoose = require('mongoose');
var Prescription = mongoose.model('Prescription');

const createResponse = function(res, status, content) {
    res.status(status).json(content);
}

var createMedication = function(req, res, incomingPrescription) {
    try {
        incomingPrescription.medications.push(req.body);
        incomingPrescription.save().then(function (response) {
            var medications = response.medications;
            var medication = medications[medications.length - 1];
            createResponse(res, 201, medication);
        });
    } catch (error) {
        createResponse(res, 400, error.message);
    }
}

const prescriptionList =async function(req, res) {
    try {
        const response = await Prescription.find();
        createResponse(res, 200, response);
    } catch (error) {
        createResponse(res, 400, error.message);
    }
}

const prescriptionCreate =async function(req, res) {
    try {
        const response = await Prescription.create(req.body);
        createResponse(res, 201, response);
    } catch (error) {
        createResponse(res, 400, error.message);
    }
}

const prescriptionReadOne =async function(req, res) {
    try {
        const response = await Prescription.findById(req.params.prescriptionId);
        if (!response) {
            createResponse(res, 404, {message: "Prescription not found"});
        } else {
            createResponse(res, 200, response);
        }
    } catch (error) {
        createResponse(res, 400, error.message);
    }
}

const prescriptionUpdateOne =async function(req, res) {
    try {
        const response = await Prescription.findByIdAndUpdate(req.params.prescriptionId, req.body, {new: true});
        if (!response) {
            createResponse(res, 404, {message: "Prescription not found"});
        } else {
            createResponse(res, 200, response);
        }
    } catch (error) {
        createResponse(res, 400, error.message);
    }
}

const prescriptionDeleteOne =async function(req, res) {
    try {
        const response = await Prescription.findByIdAndDelete(req.params.prescriptionId);
        if (!response) {
            createResponse(res, 404, {message: "Prescription not found"});
        } else {
            createResponse(res, 200, {message: "Prescription deleted"});
        }
    } catch (error) {
        createResponse(res, 400, error.message);
    }
}

const getMedicationsForPrescription =async function(req, res) {
    try {
        const response = await Prescription.findById(req.params.prescriptionId).populate('medications');
        if (!response) {
            createResponse(res, 404, {message: "Prescription not found"});
        } else {
            createResponse(res, 200, response.medications);
        }
    } catch (error) {
        createResponse(res, 400, error.message);
    }
}

const addMedicationToPrescription = async function(req, res, incomingPrescription) {
    try {
        await Prescription.findById(req.params.prescriptionId)
        .select('medications')
        .exec()
        .then((incomingPrescription) => {
            createMedication(req, res, incomingPrescription);
        });
    } catch (error) {
        createResponse(res, 400, error.message);
    }
}

const getMedicationForPrescription =async function(req, res) {
    try {
        const response = await Prescription.findById(req.params.prescriptionId).populate('medications');
        if (!response) {
            createResponse(res, 404, {message: "Prescription not found"});
        } else {
            createResponse(res, 200, response.medications);
        }
    } catch (error) {
        createResponse(res, 400, error.message);
    }
}

const updateMedicationForPrescription =async function(req, res) {
    try {
        await Prescription.findById(req.params.prescriptionId)
        .select('medications')
        .exec()
        .then(function (response) {
            try {
                let medication = response.medications.id(req.params.medicationId);
                medication.set(req.body);
                response.save().then(function () {
                    createResponse(res, 200, medication);
                });
            } catch (error) {
                createResponse(res, 400, error.message);
            }
        });
    } catch (error) {
        createResponse(res, 400, error.message);
    }
}

const removeMedicationFromPrescription =async function(req, res) {
    try {
        await Prescription.findById(req.params.prescriptionId)
        .select('medications')
        .exec()
        .then(function (response) {
            try {
                let medication = response.medications.id(req.params.medicationId);
                medication.deleteOne();
                response.save().then(function () {
                    createResponse(res, 200, {message: "Medication removed from prescription"});
                });
            } catch (error) {
                createResponse(res, 400, error.message);
            }
        });                
    } catch (error) {
        createResponse(res, 400, error.message);
    }
}

module.exports = {
    prescriptionList,
    prescriptionCreate,
    prescriptionReadOne,
    prescriptionUpdateOne,
    prescriptionDeleteOne,
    getMedicationsForPrescription,
    addMedicationToPrescription,
    getMedicationForPrescription,
    updateMedicationForPrescription,
    removeMedicationFromPrescription
};
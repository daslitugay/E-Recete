var mongoose = require('mongoose');
var Medication = mongoose.model('Medication');

const createResponse = function(res, status, content) {
    res.status(status).json(content);
}

const medicationList = async function(req, res) {
    try {
        const response = await Medication.find();
        createResponse(res, 200, response);
    } catch (error) {
        createResponse(res, 400, error.message);  
    }
}

const medicationCreate = async function(req, res) {
    try {
        const response = await Medication.create(req.body);
        createResponse(res, 201, response);
    } catch (error) {
        createResponse(res, 400, error.message);
    }
}

const medicationReadOne =async function(req, res) {
     try {
        const response = await Medication.findById(req.params.medicationId);
        if (!response) {
            createResponse(res, 404, {message: "Medication not found"});
        } else {
            createResponse(res, 200, response);
        }
     } catch (error) {
        createResponse(res, 400, error.message);
     }
}

const medicationUpdateOne =async function(req, res) {
     try {
        const response = await Medication.findByIdAndUpdate(req.params.medicationId, req.body, {new: true});
        if (!response) {
            createResponse(res, 404, {message: "Medication not found"});
        } else {
            createResponse(res, 200, response);
        }
     } catch (error) {
        createResponse(res, 400, error.message);
     }
}

const medicationDeleteOne =async function(req, res) {
     try {
        const response = await Medication.findByIdAndDelete(req.params.medicationId);
        if (!response) {
            createResponse(res, 404, {message: "Medication not found"});
        } else {
            createResponse(res, 200, {message: "Medication deleted"});
        }
     } catch (error) {
        createResponse(res, 400, error.message);
     }
}

module.exports = {
    medicationList,
    medicationCreate,
    medicationReadOne,
    medicationUpdateOne,
    medicationDeleteOne
};
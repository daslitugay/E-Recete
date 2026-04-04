var mongoose = require('mongoose');

var medicationSchema = new mongoose.Schema({
    name: String,
    expirationDate: Date,
    unitsPerBox: Number,
    boxCount: Number,
});

var prescriptionSchema = new mongoose.Schema({
    patientId: String,
    doctorId: String,
    medications: [medicationSchema],
    datePrescribed: Date,
    instructions: String,
    createdAt: { type: Date, default: Date.now },   
});

mongoose.model('Prescription', prescriptionSchema, 'prescriptions');
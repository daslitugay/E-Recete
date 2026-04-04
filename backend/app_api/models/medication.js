var mongoose = require('mongoose');

var medicationSchema = new mongoose.Schema({
    name: String,
    expirationDate: Date,
    unitsPerBox: Number,
    boxCount: Number,
});

mongoose.model('Medication', medicationSchema, 'medications');
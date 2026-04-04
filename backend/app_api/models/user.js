var mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const user=new mongoose.Schema({
    IDnumber: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['doctor', 'patient'],
        required: true
    },
    hash: String,
    salt: String,
    token: {
        type: String,
    }
});

user.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

user.methods.validatePassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
};

user.methods.generateJWT = function() {
    return jwt.sign({
        _id: this.id,
        IDnumber: this.IDnumber,
        name: this.name,
        role: this.role
    }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

mongoose.model('user', user, 'users');
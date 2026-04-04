const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('user');

const createResponse = function(res, status, content) {
    return res.status(status).json(content);
};

const register = async function(req, res) {
    if (!req.body.name || !req.body.IDnumber || !req.body.password || !req.body.role) {
        return createResponse(res, 400, { message: "All fields are required" });
    }

    const user = new User();
    user.name = req.body.name;
    user.IDnumber = req.body.IDnumber;
    user.role = req.body.role;
    user.setPassword(req.body.password);

    try {
        const newUser = await user.save();
        const generatedToken = newUser.generateJWT();
        return createResponse(res, 200, { status: 'success', token: generatedToken });
    } catch (error) {
        return createResponse(res, 500, { status: 'error', message: error.message });
    }
};

const login = async function(req, res) {
    if (!req.body.IDnumber || !req.body.password) {
        return createResponse(res, 400, { message: "IDnumber and password are required" });
    }

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return createResponse(res, 500, { status: 'error', message: err.message });
        }

        if (!user) {
            return createResponse(res, 401, { status: 'error', message: "Invalid IDnumber or password" });
        }

        const generatedToken = user.generateJWT();
        return createResponse(res, 200, { status: 'success', token: generatedToken });
    })(req, res);
};

module.exports = {
    register,
    login
};
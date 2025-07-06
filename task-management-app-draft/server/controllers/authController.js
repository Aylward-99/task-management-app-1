const User = require('../models/User');
const { generateToken } = require('../utils/token');
const { errorHandler, successHandler } = require('../utils/responseHandler');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return errorHandler(res, 400, 'User already exists');
        }
        const user = await User.create({ name, email, password });
        successHandler(res, 201, { _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) });
    } catch (error) {
        errorHandler(res, 500, error.message);
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            successHandler(res, 200, { _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) });
        } else {
            errorHandler(res, 401, 'Invalid email or password');
        }
    } catch (error) {
        errorHandler(res, 500, error.message);
    }
};
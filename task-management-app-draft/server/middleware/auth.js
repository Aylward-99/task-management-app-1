const jwt = require('jsonwebtoken');
const { errorHandler } = require('../utils/responseHandler');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            errorHandler(res, 401, 'Not authorized, token failed');
        }
    }
    if (!token) {
        errorHandler(res, 401, 'Not authorized, no token');
    }
};

module.exports = { protect };
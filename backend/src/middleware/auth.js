const { verifyToken } = require('../utils/jwt');
const { sendError } = require('../utils/response');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return sendError(res, 'Not authenticated. Please log in.', 401);

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);

    if (!user) return sendError(res, 'User no longer exists.', 401);
    if (!user.isActive) return sendError(res, 'Your account has been deactivated.', 403);

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') return sendError(res, 'Invalid token.', 401);
    if (err.name === 'TokenExpiredError') return sendError(res, 'Token expired. Please log in again.', 401);
    next(err);
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendError(res, 'You do not have permission to perform this action.', 403);
    }
    next();
  };
};

module.exports = { protect, restrictTo };
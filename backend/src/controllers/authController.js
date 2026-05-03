const User = require('../models/User');
const { signToken } = require('../utils/jwt');
const { sendSuccess, sendError } = require('../utils/response');

const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return sendError(res, 'Name, email, and password are required', 400);

    const existingUser = await User.findOne({ email });
    if (existingUser) return sendError(res, 'Email already registered', 400);

    let assignedRole = 'developer';
    if (role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount === 0) assignedRole = 'admin';
    }

    const user = await User.create({ name, email, password, role: assignedRole });
    const token = signToken(user._id, user.role);
    sendSuccess(res, { user, token }, 'Account created successfully', 201);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return sendError(res, 'Email and password are required', 400);

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return sendError(res, 'Invalid email or password', 401);

    if (!user.isActive) return sendError(res, 'Account deactivated. Contact support.', 403);

    const token = signToken(user._id, user.role);
    sendSuccess(res, { user: user.toJSON(), token }, 'Login successful');
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    sendSuccess(res, { user }, 'User fetched');
  } catch (err) {
    next(err);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return sendError(res, 'Current and new password are required', 400);

    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword)))
      return sendError(res, 'Current password is incorrect', 401);

    user.password = newPassword;
    await user.save();
    const token = signToken(user._id, user.role);
    sendSuccess(res, { token }, 'Password updated successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, login, getMe, updatePassword };
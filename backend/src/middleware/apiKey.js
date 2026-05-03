const ApiKey = require('../models/ApiKey');

const verifyApiKey = async (req, res, next) => {
  try {
    const key = req.header('x-api-key');

    if (!key) {
      return res.status(401).json({
        success: false,
        message: 'API key missing',
      });
    }

    const apiKey = await ApiKey.findOne({ key }).populate('user');

    if (!apiKey) {
      return res.status(403).json({
        success: false,
        message: 'Invalid API key',
      });
    }

    if (!apiKey.isActive) {
      return res.status(403).json({
        success: false,
        message: 'API key disabled',
      });
    }

    // 🔥 Attach user (so it's "logged-in user access")
    req.user = apiKey.user;
    req.apiKey = apiKey;

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { verifyApiKey };
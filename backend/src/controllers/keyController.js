const ApiKey = require('../models/ApiKey');
const Api = require('../models/Api');
const { sendSuccess, sendError } = require('../utils/response');

const generateKey = async (req, res, next) => {
  try {
    const { name, environment = 'live', expiresAt } = req.body;
    if (!name) return sendError(res, 'Key name is required', 400);

    const api = await Api.findOne({ _id: req.params.apiId, owner: req.user._id });
    if (!api) return sendError(res, 'API not found', 404);

    const { rawKey, prefix, keyHash } = ApiKey.generateKey(environment);
    const apiKey = await ApiKey.create({
      name, keyHash, prefix,
      api: api._id,
      owner: req.user._id,
      environment,
      expiresAt: expiresAt || null,
    });

    sendSuccess(res, {
      apiKey: { ...apiKey.toObject(), key: rawKey },
      warning: 'Copy this key now. It will not be shown again.',
    }, 'API key generated', 201);
  } catch (err) {
    next(err);
  }
};

const listKeys = async (req, res, next) => {
  try {
    const api = await Api.findOne({ _id: req.params.apiId, owner: req.user._id });
    if (!api) return sendError(res, 'API not found', 404);
    const keys = await ApiKey.find({ api: api._id, owner: req.user._id }).sort({ createdAt: -1 });
    sendSuccess(res, { keys });
  } catch (err) {
    next(err);
  }
};

const listAllKeys = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = { owner: req.user._id };
    if (status) query.status = status;
    const keys = await ApiKey.find(query).populate('api', 'name status').sort({ createdAt: -1 });
    sendSuccess(res, { keys });
  } catch (err) {
    next(err);
  }
};

const revokeKey = async (req, res, next) => {
  try {
    const key = await ApiKey.findOneAndUpdate(
      { _id: req.params.keyId, owner: req.user._id, status: 'active' },
      { status: 'revoked', revokedAt: new Date() },
      { new: true }
    );
    if (!key) return sendError(res, 'Key not found or already revoked', 404);
    sendSuccess(res, { key }, 'API key revoked');
  } catch (err) {
    next(err);
  }
};

const getKey = async (req, res, next) => {
  try {
    const key = await ApiKey.findOne({ _id: req.params.keyId, owner: req.user._id })
      .populate('api', 'name status pricePerRequest');
    if (!key) return sendError(res, 'Key not found', 404);
    sendSuccess(res, { key });
  } catch (err) {
    next(err);
  }
};

module.exports = { generateKey, listKeys, listAllKeys, revokeKey, getKey };
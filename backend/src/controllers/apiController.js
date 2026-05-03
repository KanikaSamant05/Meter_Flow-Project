const Api = require('../models/Api');
const ApiKey = require('../models/ApiKey');
const { sendSuccess, sendError } = require('../utils/response');

const createApi = async (req, res, next) => {
  try {
    const { name, description, baseUrl, version, pricingModel, pricePerRequest, rateLimit, tags } = req.body;
    if (!name) return sendError(res, 'API name is required', 400);

    const api = await Api.create({
      name, description, baseUrl, version, pricingModel,
      pricePerRequest, rateLimit, tags, owner: req.user._id,
    });
    sendSuccess(res, { api }, 'API created successfully', 201);
  } catch (err) {
    next(err);
  }
};

const getApis = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { owner: req.user._id };
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const [apis, total] = await Promise.all([
      Api.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Api.countDocuments(query),
    ]);
    sendSuccess(res, {
      apis,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

const getApi = async (req, res, next) => {
  try {
    const api = await Api.findOne({ _id: req.params.id, owner: req.user._id });
    if (!api) return sendError(res, 'API not found', 404);
    const keyCount = await ApiKey.countDocuments({ api: api._id, status: 'active' });
    sendSuccess(res, { api, activeKeyCount: keyCount });
  } catch (err) {
    next(err);
  }
};

const updateApi = async (req, res, next) => {
  try {
    const allowedFields = ['name','description','baseUrl','version','status','pricingModel','pricePerRequest','rateLimit','tags'];
    const updates = {};
    allowedFields.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const api = await Api.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      updates,
      { new: true, runValidators: true }
    );
    if (!api) return sendError(res, 'API not found', 404);
    sendSuccess(res, { api }, 'API updated successfully');
  } catch (err) {
    next(err);
  }
};

const deleteApi = async (req, res, next) => {
  try {
    const api = await Api.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!api) return sendError(res, 'API not found', 404);
    await ApiKey.updateMany({ api: api._id }, { status: 'revoked', revokedAt: new Date() });
    sendSuccess(res, null, 'API deleted successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = { createApi, getApis, getApi, updateApi, deleteApi };
const mongoose = require('mongoose');

const apiSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'API name is required'],
      trim: true,
      minlength: [2, 'API name must be at least 2 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    baseUrl: {
      type: String,
      trim: true,
      default: '',
    },
    version: {
      type: String,
      default: 'v1',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'deprecated'],
      default: 'active',
    },
    pricingModel: {
      type: String,
      enum: ['per_request', 'flat_rate', 'tiered'],
      default: 'per_request',
    },
    pricePerRequest: {
      type: Number,
      default: 0.001,
    },
    rateLimit: {
      requestsPerMinute: { type: Number, default: 60 },
      requestsPerDay: { type: Number, default: 10000 },
    },
    totalRequests: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Api', apiSchema);
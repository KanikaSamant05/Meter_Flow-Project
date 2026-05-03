const mongoose = require('mongoose');
const crypto = require('crypto');

const apiKeySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Key name is required'],
      trim: true,
    },
    keyHash: {
      type: String,
      required: true,
      select: false,
    },
    prefix: {
      type: String,
      required: true,
    },
    api: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Api',
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'revoked', 'expired'],
      default: 'active',
    },
    environment: {
      type: String,
      enum: ['live', 'test'],
      default: 'live',
    },
    totalRequests: { type: Number, default: 0 },
    totalCost: { type: Number, default: 0 },
    lastUsedAt: { type: Date, default: null },
    expiresAt: { type: Date, default: null },
    revokedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

apiKeySchema.statics.generateKey = function (environment = 'live') {
  const prefix = `mf_${environment}_`;
  const rawSecret = crypto.randomBytes(24).toString('hex');
  const rawKey = `${prefix}${rawSecret}`;
  const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
  return { rawKey, prefix, keyHash };
};

apiKeySchema.statics.hashKey = function (rawKey) {
  return crypto.createHash('sha256').update(rawKey).digest('hex');
};

module.exports = mongoose.model('ApiKey', apiKeySchema);
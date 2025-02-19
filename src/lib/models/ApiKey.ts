import mongoose from 'mongoose';
import crypto from 'crypto';

const ApiKeySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  key: {
    type: String,
    required: true,
    unique: true,
  },
  hashedKey: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastUsed: {
    type: Date,
  },
});

// Generate a new API key
ApiKeySchema.statics.generateKey = function() {
  const key = crypto.randomBytes(32).toString('base64url');
  const hashedKey = crypto.createHash('sha256').update(key).digest('hex');
  return { key, hashedKey };
};

// Verify an API key
ApiKeySchema.statics.verifyKey = function(key: string) {
  const hashedKey = crypto.createHash('sha256').update(key).digest('hex');
  return this.findOne({ hashedKey });
};

export const ApiKey = mongoose.models.ApiKey || mongoose.model('ApiKey', ApiKeySchema); 
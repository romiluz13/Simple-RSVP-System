import mongoose from 'mongoose';
import crypto from 'crypto';

const rsvpSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  willAttend: {
    type: Boolean,
    required: true,
    default: true,
  },
  guestCount: {
    type: Number,
    required: true,
    min: [0, 'Guest count cannot be negative'],
    default: 1,
  },
  managementToken: {
    type: String,
    required: true,
    default: () => crypto.randomBytes(32).toString('hex'),
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
}, {
  toJSON: { getters: true },
  toObject: { getters: true }
});

// Update guest count based on attendance
rsvpSchema.pre('save', function(next) {
  if (!this.willAttend) {
    this.guestCount = 0;
  } else if (this.guestCount < 1) {
    this.guestCount = 1;
  }
  this.updatedAt = new Date();
  next();
});

// Clear existing model if it exists (helpful in development)
const RSVP = mongoose.models.RSVP || mongoose.model('RSVP', rsvpSchema);

export { RSVP }; 
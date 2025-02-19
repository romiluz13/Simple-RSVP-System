import mongoose from 'mongoose';

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
  },
  willAttend: {
    type: Boolean,
    required: true,
    default: true,
  },
  guestCount: {
    type: Number,
    required: true,
    min: 0,
    default: 1,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  toJSON: { getters: true },
  toObject: { getters: true }
});

// Remove all previous middleware
rsvpSchema.pre('save', function(next) {
  const count = Number(this.guestCount);
  if (this.willAttend) {
    this.guestCount = isNaN(count) ? 1 : Math.max(1, count);
  } else {
    this.guestCount = 0;
  }
  next();
});

// Clear existing model if it exists
if (mongoose.models.RSVP) {
  delete mongoose.models.RSVP;
}

// Create new model
export const RSVP = mongoose.model('RSVP', rsvpSchema); 
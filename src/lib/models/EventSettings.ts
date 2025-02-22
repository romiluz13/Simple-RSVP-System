import mongoose from 'mongoose';

export interface IEventSettings {
  title: string;
  date: string;
  time: string;
  venueName: string;
  venueAddress: string;
  updatedAt: Date;
}

const EventSettingsSchema = new mongoose.Schema<IEventSettings>({
  title: { 
    type: String, 
    required: true,
    default: process.env.NEXT_PUBLIC_EVENT_TITLE || 'Event'
  },
  date: { 
    type: String, 
    required: true,
    default: process.env.NEXT_PUBLIC_EVENT_DATE
  },
  time: { 
    type: String, 
    required: true,
    default: process.env.NEXT_PUBLIC_EVENT_TIME
  },
  venueName: { 
    type: String, 
    required: true,
    default: process.env.NEXT_PUBLIC_VENUE_NAME
  },
  venueAddress: { 
    type: String, 
    required: true,
    default: process.env.NEXT_PUBLIC_VENUE_ADDRESS
  },
  updatedAt: { 
    type: Date, 
    default: Date.now,
    index: true
  }
}, {
  timestamps: true,
  collection: 'eventSettings'
});

// Update timestamp on save
EventSettingsSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Update timestamp on update
EventSettingsSchema.pre('findOneAndUpdate', function() {
  this.set({ updatedAt: new Date() });
});

// Clean up response
EventSettingsSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc: any, ret: any) {
    delete ret._id;
    return ret;
  }
});

export const EventSettings = mongoose.models.EventSettings || 
  mongoose.model<IEventSettings>('EventSettings', EventSettingsSchema); 
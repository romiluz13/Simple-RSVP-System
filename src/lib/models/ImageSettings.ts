import mongoose from 'mongoose';

export interface IImageSettings {
  name: string;
  imageUrl: string;
  altText: string;
  isUploaded: boolean;
  uploadPath?: string;
  updatedAt: Date;
}

const ImageSettingsSchema = new mongoose.Schema<IImageSettings>({
  name: { 
    type: String, 
    required: true, 
    default: 'rsvp-hero',
    unique: true,
    index: true
  },
  imageUrl: { 
    type: String, 
    required: true,
    default: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30'
  },
  altText: { 
    type: String, 
    required: true,
    default: 'Event Celebration'
  },
  isUploaded: {
    type: Boolean,
    default: false,
    index: true
  },
  uploadPath: {
    type: String,
    sparse: true
  },
  updatedAt: { 
    type: Date, 
    default: Date.now,
    index: true
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
  collection: 'imageSettings' // Explicitly set collection name
});

// Ensure indexes are created
ImageSettingsSchema.index({ name: 1 }, { unique: true });
ImageSettingsSchema.index({ updatedAt: -1 });

// Update the timestamp on save
ImageSettingsSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Clean up old images if needed
ImageSettingsSchema.pre('findOneAndUpdate', function() {
  this.set({ updatedAt: new Date() });
});

// Ensure we're using lean queries for better performance
ImageSettingsSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc: any, ret: any) {
    delete ret._id;
    return ret;
  }
});

export const ImageSettings = mongoose.models.ImageSettings || 
  mongoose.model<IImageSettings>('ImageSettings', ImageSettingsSchema); 
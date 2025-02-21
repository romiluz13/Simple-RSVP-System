import mongoose from 'mongoose';
import type { Component, Theme } from '../utils/emailTemplates';

// Define nested schemas for better validation
const themeSchema = new mongoose.Schema({
  primaryColor: {
    type: String,
    required: true,
    default: '#B45309'
  },
  secondaryColor: {
    type: String,
    required: true,
    default: '#1F2937'
  },
  accentColor: {
    type: String,
    required: true,
    default: '#D97706'
  }
}, { _id: false });

const componentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['header', 'text', 'eventDetails', 'button', 'divider'],
    required: true
  },
  content: {
    type: String,
    required: function(this: { type: string }) {
      // content is required for all types except eventDetails and divider
      return !['eventDetails', 'divider'].includes(this.type);
    },
    default: ''
  },
  style: {
    type: String,
    enum: ['primary', 'secondary', 'accent'],
    required: true
  }
}, { _id: false });

const emailTemplateSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  layout: {
    type: String,
    enum: ['default', 'minimal', 'elegant'],
    default: 'default'
  },
  components: [componentSchema],
  theme: {
    type: themeSchema,
    required: true,
    default: () => ({})
  }
}, { _id: false });

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  confirmation: {
    type: emailTemplateSchema,
    required: true
  },
  reminder: {
    type: emailTemplateSchema,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  strict: true,
  strictQuery: true
});

// Update the updatedAt timestamp before saving
templateSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export interface ITemplate extends mongoose.Document {
  name: string;
  confirmation: {
    subject: string;
    layout: 'default' | 'minimal' | 'elegant';
    components: Component[];
    theme: Theme;
  };
  reminder: {
    subject: string;
    layout: 'default' | 'minimal' | 'elegant';
    components: Component[];
    theme: Theme;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Clear existing model if it exists (helpful in development)
const Template = mongoose.models.Template || mongoose.model<ITemplate>('Template', templateSchema);

export { Template }; 
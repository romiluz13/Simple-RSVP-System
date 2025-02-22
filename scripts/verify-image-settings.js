const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function verifyImageSettings() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI is not defined in .env.local');
    process.exit(1);
  }

  console.log('🔍 Verifying image settings...');

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('✅ Connected to MongoDB');

    // Define the schema
    const ImageSettingsSchema = new mongoose.Schema({
      name: String,
      imageUrl: String,
      altText: String,
      isUploaded: Boolean,
      uploadPath: String,
      updatedAt: Date
    });

    // Get or create the model
    const ImageSettings = mongoose.models.ImageSettings || 
      mongoose.model('ImageSettings', ImageSettingsSchema);

    // Check current settings
    const settings = await ImageSettings.findOne({ name: 'rsvp-hero' });
    
    if (settings) {
      console.log('📸 Current image settings:', {
        name: settings.name,
        imageUrl: settings.imageUrl,
        altText: settings.altText,
        isUploaded: settings.isUploaded,
        uploadPath: settings.uploadPath,
        updatedAt: settings.updatedAt
      });
    } else {
      console.log('⚠️ No image settings found');
      
      // Create default settings
      const defaultSettings = await ImageSettings.create({
        name: 'rsvp-hero',
        imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
        altText: 'Event Celebration',
        isUploaded: false,
        updatedAt: new Date()
      });

      console.log('✅ Created default settings:', defaultSettings);
    }

    // Verify indexes
    const indexes = await ImageSettings.collection.indexes();
    console.log('📑 Collection indexes:', indexes);

    await mongoose.disconnect();
    console.log('✅ Verification complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  }
}

verifyImageSettings(); 
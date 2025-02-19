import { config } from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
config({ path: '.env.local' });

async function verifyAuth0Config() {
  const requiredVars = [
    'AUTH0_SECRET',
    'AUTH0_BASE_URL',
    'AUTH0_ISSUER_BASE_URL',
    'AUTH0_CLIENT_ID',
    'AUTH0_CLIENT_SECRET',
    'AUTH0_SCOPE',
    'AUTH0_AUDIENCE',
    'NEXT_PUBLIC_AUTH0_DOMAIN',
    'NEXT_PUBLIC_AUTH0_CLIENT_ID'
  ];

  // Check for missing variables
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    console.error('❌ Missing required Auth0 environment variables:');
    missingVars.forEach(varName => console.error(`   - ${varName}`));
    process.exit(1);
  }

  try {
    // Verify Auth0 domain is accessible
    const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
    const response = await fetch(`https://${domain}/.well-known/openid-configuration`);
    
    if (!response.ok) {
      throw new Error(`Failed to connect to Auth0 domain: ${domain}`);
    }

    const config = await response.json();
    console.log('✅ Auth0 configuration verified successfully');
    console.log(`📊 Connected to Auth0 tenant: ${domain}`);
    console.log('   - OpenID configuration loaded');
    console.log(`   - Issuer: ${config.issuer}`);
    
    // Verify client credentials (without exposing secrets)
    const clientId = process.env.AUTH0_CLIENT_ID;
    console.log(`   - Client ID: ${clientId?.slice(0, 8)}...`);
    
    // Verify callback URLs
    const baseUrl = process.env.AUTH0_BASE_URL;
    console.log(`   - Base URL: ${baseUrl}`);
    console.log('   - Callback URL: /api/auth/callback');
    console.log('   - Logout URL: /api/auth/logout');

    process.exit(0);
  } catch (error) {
    console.error('❌ Auth0 verification failed:', error.message);
    process.exit(1);
  }
}

verifyAuth0Config(); 
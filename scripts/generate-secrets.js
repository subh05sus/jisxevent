#!/usr/bin/env node

const crypto = require('crypto');

console.log('🔐 Production Environment Variables Generator\n');

console.log('Add these to your production environment:\n');

console.log('NEXTAUTH_SECRET=' + crypto.randomBytes(32).toString('base64'));
console.log('JWT_SECRET=' + crypto.randomBytes(32).toString('base64'));

console.log('\n⚠️  Important:');
console.log('1. Also set NEXTAUTH_URL to your production domain');
console.log('2. Keep these secrets secure and never commit them to git');
console.log('3. Use different secrets for staging and production');

console.log('\n📝 Example production .env:');
console.log('DATABASE_URL=your_production_database_url');
console.log('NEXTAUTH_URL=https://yourdomain.com');
console.log('NEXTAUTH_SECRET=' + crypto.randomBytes(32).toString('base64'));
console.log('JWT_SECRET=' + crypto.randomBytes(32).toString('base64'));

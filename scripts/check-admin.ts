/**
 * Admin User Check Script
 * 
 * Automatically checks if an admin user exists and creates one if needed.
 * This script runs automatically when the project starts.
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables FIRST before importing anything that needs them
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.log('⚠️  .env.local file not found');
  console.log('   Skipping admin user check. The app will start normally.');
  process.exit(0);
}

async function checkAndCreateAdmin() {
  try {
    // Check if required env vars are set before proceeding
    if (!process.env.MONGODB_URI) {
      console.log('⚠️  MONGODB_URI not set in .env.local');
      console.log('   Skipping admin user check. The app will start normally.');
      return;
    }

    // Validate required environment variables
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      console.log('⚠️  ADMIN_EMAIL and ADMIN_PASSWORD not set in .env.local');
      console.log('   Skipping admin user creation. You can create one manually with: npm run seed:admin');
      return;
    }

    // Dynamically import modules that depend on env vars (only after we've verified they exist)
    const { default: connectDB } = await import('../lib/db');
    const { default: User } = await import('../models/User');
    const { hashPassword } = await import('../lib/auth');

    await connectDB();
    console.log('🔍 Checking for admin user...');

    const email = process.env.ADMIN_EMAIL.toLowerCase().trim();
    const password = process.env.ADMIN_PASSWORD;

    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      email,
      roles: 'admin'
    });

    if (existingAdmin) {
      console.log(`✅ Admin user already exists: ${email}`);
      return;
    }

    // Check if user exists but without admin role
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`ℹ️  User exists but is not admin: ${email}`);
      console.log('   Adding admin role...');
      existingUser.roles.push('admin');
      existingUser.password = await hashPassword(password);
      await existingUser.save();
      console.log('✅ Admin role added successfully!');
      return;
    }

    // Create new admin user
    console.log('📝 Creating admin user...');
    const hashedPassword = await hashPassword(password);
    const admin = await User.create({
      email,
      password: hashedPassword,
      roles: ['admin'],
    });

    console.log('✅ Admin user created successfully!');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Roles: ${admin.roles.join(', ')}`);
  } catch (error: any) {
    // Don't exit on error, just log it - we don't want to prevent the app from starting
    console.error('⚠️  Error checking/creating admin user:', error.message);
    console.log('   The application will continue to start. You can create admin manually with: npm run seed:admin');
  }
}

// Run the check when script is executed directly
checkAndCreateAdmin()
  .then(() => {
    // Only exit if this is the main module (not imported)
    if (process.argv[1] && process.argv[1].includes('check-admin.ts')) {
      process.exit(0);
    }
  })
  .catch((error) => {
    console.error('Fatal error in admin check:', error);
    if (process.argv[1] && process.argv[1].includes('check-admin.ts')) {
      process.exit(1);
    }
  });

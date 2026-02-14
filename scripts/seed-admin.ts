/**
 * Admin User Seed Script
 * 
 * Creates an initial admin user in the database.
 * Run with: npm run seed:admin
 */

import * as dotenv from 'dotenv';
import connectDB from '../lib/db';
import User from '../models/User';
import { hashPassword } from '../lib/auth';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function seedAdmin() {
  try {
    // Validate required environment variables
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local');
    }

    await connectDB();
    console.log('✅ Connected to database');

    const email = process.env.ADMIN_EMAIL.toLowerCase().trim();
    const password = process.env.ADMIN_PASSWORD;

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      if (existingAdmin.roles.includes('admin')) {
        console.log(`ℹ️  Admin user already exists: ${email}`);
        console.log('   Updating password...');
        existingAdmin.password = await hashPassword(password);
        await existingAdmin.save();
        console.log('✅ Admin password updated');
        return;
      } else {
        // User exists but is not admin, add admin role
        console.log(`ℹ️  User exists but is not admin: ${email}`);
        existingAdmin.roles.push('admin');
        existingAdmin.password = await hashPassword(password);
        await existingAdmin.save();
        console.log('✅ Admin role and password set');
        return;
      }
    }

    // Create new admin user
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
    console.error('❌ Error seeding admin:', error.message);
    process.exit(1);
  }
}

// Run the script
seedAdmin()
  .then(() => {
    console.log('✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

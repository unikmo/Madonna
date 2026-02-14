/**
 * Admin User Initialization
 * 
 * This module automatically checks and creates an admin user when the app starts.
 * It's imported in the app layout to ensure it runs on server startup.
 */

import connectDB from './db';
import User from '../models/User';
import { hashPassword } from './auth';

let adminCheckPromise: Promise<void> | null = null;

export async function initializeAdmin(): Promise<void> {
  // Only run once, even if called multiple times
  if (adminCheckPromise) {
    return adminCheckPromise;
  }

  adminCheckPromise = (async () => {
    try {
      // Check if MongoDB URI is available
      if (!process.env.MONGODB_URI) {
        // Silently skip - this is expected in some environments
        return;
      }

      // Validate required environment variables
      if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
        // Silently skip - admin creation is optional
        return;
      }

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
      // Don't throw - we don't want to prevent the app from starting
      console.error('⚠️  Error checking/creating admin user:', error.message);
      console.log('   The application will continue to start. You can create admin manually with: npm run seed:admin');
    }
  })();

  return adminCheckPromise;
}

// Auto-initialize on import (runs once)
if (typeof window === 'undefined') {
  // Only run on server-side
  initializeAdmin().catch(() => {
    // Silently handle errors - we don't want to crash the app
  });
}

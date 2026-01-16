#!/usr/bin/env node

/**
 * Production Deployment Database Setup
 *
 * This script handles the complete database setup for production deployment,
 * including migration from SQLite to PostgreSQL if needed.
 *
 * Run this script during deployment or manually after deployment.
 *
 * Usage:
 * node scripts/setup-production-db.js
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupProductionDb() {
  console.log('🚀 Setting up production database...');

  try {
    // Check if DATABASE_URL is set
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error('DATABASE_URL environment variable is required');
    }

    console.log('📊 Database URL configured');

    // Generate Prisma client
    console.log('🔧 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });

    // Push database schema (better for production than migrate deploy)
    console.log('🗃️  Pushing database schema...');
    execSync('npx prisma db push --force-reset', { stdio: 'inherit' });

    // Check if we need to migrate from SQLite
    const sqliteDbPath = process.env.SQLITE_DB_PATH || './dev.db';
    const needsMigration = fs.existsSync(sqliteDbPath);

    if (needsMigration) {
      console.log('📦 SQLite database found, running migration...');

      // Backup SQLite database
      console.log('💾 Creating backup...');
      execSync('npm run db:backup', { stdio: 'inherit' });

      // Run migration
      console.log('🔄 Migrating data...');
      execSync('npm run db:migrate', { stdio: 'inherit' });

      // Verify migration
      console.log('✅ Verifying migration...');
      execSync('npm run db:verify', { stdio: 'inherit' });

      console.log('🎉 Migration completed successfully!');
    } else {
      console.log('ℹ️  No SQLite database found, skipping migration');
    }

    // Run a final health check
    console.log('🏥 Running database health check...');
    execSync('npm test -- health.test.ts', { stdio: 'inherit' });

    console.log('🎉 Production database setup completed!');

  } catch (error) {
    console.error('❌ Production database setup failed:', error);
    throw error;
  }
}

// Run setup if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupProductionDb()
    .then(() => {
      console.log('🎉 Production database setup script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Production database setup script failed:', error);
      process.exit(1);
    });
}

export { setupProductionDb };
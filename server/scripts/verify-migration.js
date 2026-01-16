#!/usr/bin/env node

/**
 * Migration Verification Script
 *
 * Verifies that the PostgreSQL migration was successful by comparing
 * data counts between the original SQLite database and the new PostgreSQL database.
 *
 * Usage:
 * node scripts/verify-migration.js
 */

import { PrismaClient as PostgresPrisma } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function verifyMigration() {
  console.log('🔍 Verifying PostgreSQL migration...');

  const postgresUrl = process.env.DATABASE_URL;
  if (!postgresUrl) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  const postgresPrisma = new PostgresPrisma({
    datasourceUrl: postgresUrl,
  });

  try {
    await postgresPrisma.$connect();
    console.log('✅ Connected to PostgreSQL database');

    // Get counts from PostgreSQL
    const counts = {
      users: await postgresPrisma.user.count(),
      progress: await postgresPrisma.progress.count(),
      projects: await postgresPrisma.project.count(),
      badges: await postgresPrisma.badge.count(),
      labSessions: await postgresPrisma.labSession.count(),
      aars: await postgresPrisma.afterActionReview.count(),
    };

    console.log('📊 PostgreSQL Data Counts:');
    console.log(`  Users: ${counts.users}`);
    console.log(`  Progress: ${counts.progress}`);
    console.log(`  Projects: ${counts.projects}`);
    console.log(`  Badges: ${counts.badges}`);
    console.log(`  Lab Sessions: ${counts.labSessions}`);
    console.log(`  AARs: ${counts.aars}`);

    // Check for migration summary
    const summaryPath = path.join(__dirname, '..', 'migration-summary.json');
    if (fs.existsSync(summaryPath)) {
      const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
      console.log('\n📄 Migration Summary Comparison:');
      console.log(`  Expected Users: ${summary.usersCount}`);
      console.log(`  Actual Users: ${counts.users}`);
      console.log(`  Match: ${summary.usersCount === counts.users ? '✅' : '❌'}`);
    }

    // Basic validation
    const issues = [];

    if (counts.users === 0) {
      issues.push('No users found in PostgreSQL database');
    }

    if (issues.length > 0) {
      console.log('\n⚠️  Issues found:');
      issues.forEach(issue => console.log(`  - ${issue}`));
    } else {
      console.log('\n✅ Migration verification passed!');
    }

    return { counts, issues };

  } catch (error) {
    console.error('❌ Verification failed:', error);
    throw error;
  } finally {
    await postgresPrisma.$disconnect();
  }
}

// Run verification if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  verifyMigration()
    .then((result) => {
      if (result.issues.length > 0) {
        console.log('💥 Verification found issues');
        process.exit(1);
      } else {
        console.log('🎉 Verification completed successfully');
        process.exit(0);
      }
    })
    .catch((error) => {
      console.error('💥 Verification script failed:', error);
      process.exit(1);
    });
}

export { verifyMigration };
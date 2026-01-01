#!/usr/bin/env node

/**
 * SQLite Database Backup Script
 *
 * Creates a backup of the SQLite database before migration to PostgreSQL.
 * Run this before deploying to production.
 *
 * Usage:
 * node scripts/backup-sqlite.js
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function backupSqlite() {
  console.log('📦 Creating SQLite database backup...');

  const dbPath = process.env.SQLITE_DB_PATH || './dev.db';
  const backupPath = path.join(__dirname, '..', `sqlite-backup-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.db`);

  try {
    // Check if SQLite database exists
    if (!fs.existsSync(dbPath)) {
      console.log('⚠️  SQLite database not found, skipping backup');
      return null;
    }

    // Copy the database file
    fs.copyFileSync(dbPath, backupPath);
    console.log(`✅ SQLite backup created: ${backupPath}`);

    // Test the backup by connecting
    const prisma = new PrismaClient({
      datasourceUrl: `file:${backupPath}`,
    });

    try {
      await prisma.$connect();
      const userCount = await prisma.user.count();
      console.log(`📊 Backup verification: ${userCount} users found`);
      await prisma.$disconnect();
    } catch (error) {
      console.error('❌ Backup verification failed:', error);
      throw error;
    }

    return backupPath;

  } catch (error) {
    console.error('❌ Backup failed:', error);
    throw error;
  }
}

// Run backup if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  backupSqlite()
    .then((backupPath) => {
      if (backupPath) {
        console.log('🎉 Backup script completed successfully');
      }
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Backup script failed:', error);
      process.exit(1);
    });
}

export { backupSqlite };
#!/usr/bin/env node

/**
 * Production Database Deployment Script
 *
 * This script handles the complete database setup for production deployment.
 * It supports both fresh installations and migrations from development SQLite.
 *
 * Features:
 * - Automatic database provider detection (SQLite dev → PostgreSQL prod)
 * - Data migration with integrity checks
 * - Rollback capabilities
 * - Comprehensive logging
 *
 * Usage:
 * NODE_ENV=production node scripts/deploy-database.js
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

class DatabaseDeployer {
  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.databaseUrl = process.env.DATABASE_URL;
    this.sqlitePath = process.env.SQLITE_DB_PATH || './prisma/dev.db';
    this.backupDir = './backups';
    this.logs = [];
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${level}: ${message}`;
    console.log(logMessage);
    this.logs.push(logMessage);
  }

  async run() {
    try {
      this.log('🚀 Starting database deployment...');

      // Validate environment
      await this.validateEnvironment();

      // Create backup directory
      this.ensureBackupDirectory();

      // Detect deployment type
      const deploymentType = await this.detectDeploymentType();

      if (deploymentType === 'migration') {
        await this.performMigration();
      } else {
        await this.performFreshInstall();
      }

      // Run health checks
      await this.runHealthChecks();

      // Generate deployment report
      this.generateReport();

      this.log('🎉 Database deployment completed successfully!');

    } catch (error) {
      this.log(`❌ Database deployment failed: ${error.message}`, 'ERROR');
      await this.rollback();
      throw error;
    }
  }

  async validateEnvironment() {
    this.log('🔍 Validating environment...');

    if (!this.databaseUrl) {
      throw new Error('DATABASE_URL environment variable is required');
    }

    // Validate database URL format based on environment
    if (this.isProduction) {
      if (!this.databaseUrl.startsWith('postgresql://')) {
        throw new Error('Production requires PostgreSQL DATABASE_URL');
      }
      // Update schema provider for production
      await this.updateSchemaForProduction();
    } else {
      if (!this.databaseUrl.startsWith('file:')) {
        throw new Error('Development requires SQLite DATABASE_URL (file:...)');
      }
    }

    this.log('✅ Environment validation passed');
  }

  ensureBackupDirectory() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
      this.log(`📁 Created backup directory: ${this.backupDir}`);
    }
  }

  async detectDeploymentType() {
    this.log('🔍 Detecting deployment type...');

    // Check if SQLite database exists (indicates migration needed)
    const sqliteExists = fs.existsSync(this.sqlitePath);

    // Check if PostgreSQL has existing data
    const hasPostgresData = await this.checkPostgresData();

    if (sqliteExists && !hasPostgresData) {
      this.log('📦 Migration deployment detected (SQLite → PostgreSQL)');
      return 'migration';
    } else if (!sqliteExists && !hasPostgresData) {
      this.log('🆕 Fresh installation detected');
      return 'fresh';
    } else if (hasPostgresData) {
      this.log('🔄 Update deployment detected (schema only)');
      return 'update';
    } else {
      throw new Error('Unable to determine deployment type');
    }
  }

  async updateSchemaForProduction() {
    const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
    let schemaContent = fs.readFileSync(schemaPath, 'utf8');

    // Change provider from sqlite to postgresql
    if (schemaContent.includes('provider = "sqlite"')) {
      schemaContent = schemaContent.replace('provider = "sqlite"', 'provider = "postgresql"');
      fs.writeFileSync(schemaPath, schemaContent);
      this.log('📝 Updated Prisma schema provider to PostgreSQL for production');
    }
  }

  async performMigration() {
    this.log('🔄 Performing database migration...');

    // Create backup
    await this.createBackup();

    // Generate Prisma client for PostgreSQL
    this.log('🔧 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });

    // Push schema to PostgreSQL
    this.log('🗃️ Pushing database schema...');
    execSync('npx prisma db push --force-reset', { stdio: 'inherit' });

    // Run data migration
    this.log('📊 Migrating data...');
    execSync('node scripts/migrate-to-postgres.js', { stdio: 'inherit' });

    // Verify migration
    this.log('✅ Verifying migration...');
    execSync('node scripts/verify-migration.js', { stdio: 'inherit' });
  }

  async performFreshInstall() {
    this.log('🆕 Performing fresh database installation...');

    // Generate Prisma client
    this.log('🔧 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });

    // Push schema
    this.log('🗃️ Pushing database schema...');
    execSync('npx prisma db push', { stdio: 'inherit' });

    // Optional: Run seed script if available
    if (fs.existsSync('../client/seed.cjs')) {
      this.log('🌱 Running database seed...');
      execSync('node ../client/seed.cjs', { stdio: 'inherit' });
    }
  }

  async createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(this.backupDir, `backup-${timestamp}.db`);

    if (fs.existsSync(this.sqlitePath)) {
      fs.copyFileSync(this.sqlitePath, backupPath);
      this.log(`💾 Created backup: ${backupPath}`);
    }
  }

  async runHealthChecks() {
    this.log('🏥 Running health checks...');

    // Test database connection
    execSync('npx prisma db execute --file scripts/health-check.sql', { stdio: 'pipe' });

    // Run database tests
    execSync('npm test -- --testPathPattern=health.test.ts', { stdio: 'inherit' });

    this.log('✅ Health checks passed');
  }

  async rollback() {
    this.log('🔄 Attempting rollback...', 'WARN');

    try {
      // Find latest backup
      const backups = fs.readdirSync(this.backupDir)
        .filter(f => f.startsWith('backup-'))
        .sort()
        .reverse();

      if (backups.length > 0) {
        const latestBackup = path.join(this.backupDir, backups[0]);
        fs.copyFileSync(latestBackup, this.sqlitePath);
        this.log(`🔄 Rolled back to backup: ${latestBackup}`);
      } else {
        this.log('⚠️ No backup found for rollback', 'WARN');
      }
    } catch (error) {
      this.log(`❌ Rollback failed: ${error.message}`, 'ERROR');
    }
  }

  generateReport() {
    const reportPath = path.join(this.backupDir, 'deployment-report.json');
    const report = {
      timestamp: new Date().toISOString(),
      environment: this.isProduction ? 'production' : 'development',
      databaseUrl: this.databaseUrl.replace(/:[^:]+@/, ':***@'), // Mask password
      deploymentType: 'completed',
      logs: this.logs
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    this.log(`📄 Deployment report saved: ${reportPath}`);
  }
}

// Run deployment if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🚀 Starting database deployment script...');
  const deployer = new DatabaseDeployer();

  deployer.run()
    .then(() => {
      console.log('🎉 Database deployment script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Database deployment script failed:', error);
      process.exit(1);
    });
}

export { DatabaseDeployer };
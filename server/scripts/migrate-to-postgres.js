#!/usr/bin/env node

/**
 * Database Migration Script: SQLite to PostgreSQL
 *
 * This script migrates data from SQLite to PostgreSQL for production deployment.
 * Run this script when deploying to production with PostgreSQL.
 *
 * Usage:
 * 1. Ensure SQLite database exists with data
 * 2. Set DATABASE_URL to PostgreSQL connection string
 * 3. Run: node scripts/migrate-to-postgres.js
 */

import { PrismaClient as SqlitePrisma } from '@prisma/client';
import { PrismaClient as PostgresPrisma } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrateToPostgres() {
  console.log('🚀 Starting SQLite to PostgreSQL migration...');

  // SQLite connection (source)
  const sqliteDbPath = process.env.SQLITE_DB_PATH || './dev.db';
  const sqlitePrisma = new SqlitePrisma({
    datasourceUrl: `file:${sqliteDbPath}`,
  });

  // PostgreSQL connection (target)
  const postgresUrl = process.env.DATABASE_URL;
  if (!postgresUrl) {
    throw new Error('DATABASE_URL environment variable is required for PostgreSQL connection');
  }

  const postgresPrisma = new PostgresPrisma({
    datasourceUrl: postgresUrl,
  });

  try {
    console.log('📊 Connecting to databases...');

    // Test connections
    await sqlitePrisma.$connect();
    await postgresPrisma.$connect();
    console.log('✅ Database connections established');

    // Migrate Users
    console.log('👥 Migrating users...');
    const users = await sqlitePrisma.user.findMany({
      include: {
        progress: true,
        projects: true,
        badges: true,
        labSessions: true,
        aars: true,
      },
    });

    console.log(`Found ${users.length} users to migrate`);

    for (const user of users) {
      console.log(`Migrating user: ${user.email}`);

      // Create user in PostgreSQL
      const createdUser = await postgresPrisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          password: user.password,
          name: user.name,
          currentWeek: user.currentWeek,
          totalXP: user.totalXP,
          createdAt: user.createdAt,
        },
      });

      // Migrate progress
      if (user.progress.length > 0) {
        console.log(`  Migrating ${user.progress.length} progress records...`);
        await postgresPrisma.progress.createMany({
          data: user.progress.map(p => ({
            id: p.id,
            userId: p.userId,
            weekId: p.weekId,
            lessonId: p.lessonId,
            completed: p.completed,
            score: p.score,
            completedAt: p.completedAt,
          })),
        });
      }

      // Migrate projects
      if (user.projects.length > 0) {
        console.log(`  Migrating ${user.projects.length} projects...`);
        await postgresPrisma.project.createMany({
          data: user.projects.map(p => ({
            id: p.id,
            userId: p.userId,
            projectId: p.projectId,
            title: p.title,
            description: p.description,
            githubUrl: p.githubUrl,
            deployUrl: p.deployUrl,
            completed: p.completed,
            completedAt: p.completedAt,
          })),
        });
      }

      // Migrate badges
      if (user.badges.length > 0) {
        console.log(`  Migrating ${user.badges.length} badges...`);
        await postgresPrisma.badge.createMany({
          data: user.badges.map(b => ({
            id: b.id,
            userId: b.userId,
            badgeType: b.badgeType,
            badgeName: b.badgeName,
            earnedAt: b.earnedAt,
          })),
        });
      }

      // Migrate lab sessions
      if (user.labSessions.length > 0) {
        console.log(`  Migrating ${user.labSessions.length} lab sessions...`);
        await postgresPrisma.labSession.createMany({
          data: user.labSessions.map(l => ({
            id: l.id,
            userId: l.userId,
            exerciseId: l.exerciseId,
            code: l.code,
            output: l.output,
            passed: l.passed,
            submittedAt: l.submittedAt,
          })),
        });
      }

      // Migrate AARs
      if (user.aars.length > 0) {
        console.log(`  Migrating ${user.aars.length} AARs...`);
        await postgresPrisma.afterActionReview.createMany({
          data: user.aars.map(a => ({
            id: a.id,
            userId: a.userId,
            lessonId: a.lessonId,
            level: a.level,
            labId: a.labId,
            completedAt: a.completedAt,
            whatWasAccomplished: a.whatWasAccomplished,
            whatWorkedWell: a.whatWorkedWell,
            whatDidNotWork: a.whatDidNotWork,
            whyDidNotWork: a.whyDidNotWork,
            whatWouldIDoDifferently: a.whatWouldIDoDifferently,
            whatDidILearn: a.whatDidILearn,
            wordCounts: a.wordCounts,
            qualityScore: a.qualityScore,
            aiReview: a.aiReview,
            patterns: a.patterns,
            createdAt: a.createdAt,
            updatedAt: a.updatedAt,
          })),
        });
      }
    }

    console.log('✅ Migration completed successfully!');

    // Generate migration summary
    const summary = {
      migratedAt: new Date().toISOString(),
      usersCount: users.length,
      totalProgress: users.reduce((sum, u) => sum + u.progress.length, 0),
      totalProjects: users.reduce((sum, u) => sum + u.projects.length, 0),
      totalBadges: users.reduce((sum, u) => sum + u.badges.length, 0),
      totalLabSessions: users.reduce((sum, u) => sum + u.labSessions.length, 0),
      totalAARs: users.reduce((sum, u) => sum + u.aars.length, 0),
    };

    const summaryPath = path.join(__dirname, '..', 'migration-summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    console.log(`📄 Migration summary saved to: ${summaryPath}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await sqlitePrisma.$disconnect();
    await postgresPrisma.$disconnect();
  }
}

// Run migration if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateToPostgres()
    .then(() => {
      console.log('🎉 Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration script failed:', error);
      process.exit(1);
    });
}

export { migrateToPostgres };
# Database Migration: SQLite to PostgreSQL

This guide covers migrating the DevOps Roadmap application from SQLite (development) to PostgreSQL (production).

## Overview

The application currently uses SQLite for development but PostgreSQL for production deployments. This migration ensures data consistency when moving from development to production.

## Prerequisites

- Node.js 18+
- Access to both SQLite and PostgreSQL databases
- Existing SQLite database with data (optional)

## Migration Steps

### 1. Backup SQLite Database

Before migration, create a backup of your SQLite database:

```bash
npm run db:backup
```

This creates a timestamped backup file in the server directory.

### 2. Set Environment Variables

Ensure your `.env` file has the correct PostgreSQL connection string:

```env
DATABASE_URL="postgresql://username:password@host:5432/database"
```

### 3. Generate Prisma Client for PostgreSQL

Update the Prisma schema and generate the client:

```bash
npx prisma generate
```

### 4. Run Migration

Execute the migration script:

```bash
npm run db:migrate
```

This script will:
- Connect to both SQLite (source) and PostgreSQL (target)
- Export all data from SQLite
- Import data into PostgreSQL
- Generate a migration summary

### 5. Verify Migration

After migration, verify the data:

```bash
# Check user count
npx prisma db execute --file scripts/verify-migration.sql

# Or manually check with Prisma Studio
npx prisma studio
```

## Deployment

### Render Deployment

The `render.yaml` configuration already includes PostgreSQL database service. When deploying:

1. The database will be automatically created
2. Set the `DATABASE_URL` environment variable
3. Run the migration script during deployment

### Railway Deployment

Similar to Render, Railway supports PostgreSQL databases. Update the `railway.json` if needed.

## Troubleshooting

### Connection Issues

- Verify `DATABASE_URL` format: `postgresql://user:password@host:port/database`
- Ensure PostgreSQL server is running and accessible
- Check firewall settings

### Data Migration Errors

- Check SQLite database exists and is readable
- Verify PostgreSQL user has write permissions
- Check for foreign key constraint violations

### Rollback

If migration fails:

1. Restore from SQLite backup
2. Check migration logs for specific errors
3. Contact support if needed

## Schema Differences

### SQLite → PostgreSQL Changes

- **UUID Generation**: SQLite uses `uuid()` function, PostgreSQL uses `gen_random_uuid()`
- **JSON Fields**: Both support JSON, but PostgreSQL has better performance
- **DateTime**: Both support ISO 8601 format
- **Constraints**: PostgreSQL enforces constraints more strictly

### Schema Updates

The Prisma schema has been updated to use PostgreSQL provider. Key changes:

```prisma
datasource db {
  provider = "postgresql"  // Changed from "sqlite"
  url      = env("DATABASE_URL")
}
```

## Testing

After migration, run the test suite to ensure everything works:

```bash
npm test
```

All tests should pass with PostgreSQL.

## Performance Considerations

PostgreSQL offers better performance for:
- Concurrent connections
- Complex queries
- Large datasets
- JSON operations

## Monitoring

Monitor the PostgreSQL database after migration:
- Connection pool usage
- Query performance
- Disk usage
- Backup status
# Database Setup & Migration Guide

This guide covers database configuration for the DevOps Roadmap application with **SQLite for development** and **PostgreSQL for production**.

## Database Strategy

- **Development**: SQLite (file-based, easy setup, no external dependencies)
- **Production**: PostgreSQL (scalable, concurrent, robust)

## Environment Configuration

### Development Setup

1. **Server `.env`** (SQLite):
   ```env
   DATABASE_URL="file:./prisma/dev.db"
   ```

2. **ML Service `.env`** (SQLite):
   ```env
   DATABASE_URL="file:../server/prisma/dev.db"
   ```

### Production Setup

1. **Server `.env`** (PostgreSQL):
   ```env
   DATABASE_URL="postgresql://username:password@host:5432/database"
   ```

2. **ML Service `.env`** (PostgreSQL):
   ```env
   DATABASE_URL="postgresql://username:password@host:5432/database"
   ```

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Push schema to SQLite
npx prisma db push

# Start development server
npm run dev
```

### Production Deployment

```bash
# Set production environment
export NODE_ENV=production
export DATABASE_URL="postgresql://..."

# Run automated deployment
npm run db:deploy
```

## Migration Scripts

### Automated Deployment (`db:deploy`)

The `deploy-database.js` script automatically handles:

- **Fresh Install**: Creates new PostgreSQL database with schema
- **Migration**: Migrates data from SQLite to PostgreSQL
- **Update**: Updates existing PostgreSQL schema
- **Rollback**: Automatic rollback on failure

```bash
npm run db:deploy
```

### Manual Migration Steps

If you need manual control:

1. **Backup SQLite**:
   ```bash
   npm run db:backup
   ```

2. **Migrate Data**:
   ```bash
   npm run db:migrate
   ```

3. **Verify Migration**:
   ```bash
   npm run db:verify
   ```

## Deployment Platforms

### Render

1. Add PostgreSQL database service
2. Set `DATABASE_URL` environment variable
3. Add deployment command: `npm run db:deploy`

### Railway

1. Add PostgreSQL plugin
2. Set `DATABASE_URL` environment variable
3. Use build command: `npm run build`
4. Use start command: `npm run db:deploy && npm start`

### Docker

```dockerfile
# Multi-stage build with database setup
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Run database deployment
RUN npm run db:deploy

EXPOSE 3001
CMD ["npm", "start"]
```

## Troubleshooting

### Common Issues

**Connection Refused**
- Verify `DATABASE_URL` format
- Check PostgreSQL server status
- Confirm network connectivity

**Migration Failures**
- Ensure SQLite database exists
- Check PostgreSQL permissions
- Review migration logs

**Schema Conflicts**
- Backup data before schema changes
- Use `prisma db push --force-reset` for development
- Create proper migrations for production

### Recovery

**Rollback Migration**:
```bash
# Script automatically creates backups
# Check ./backups/ directory for recovery options
```

**Reset Database**:
```bash
npx prisma db push --force-reset
```

## Schema Management

### Development (SQLite)

```bash
# Update schema
npx prisma db push

# View data
npx prisma studio
```

### Production (PostgreSQL)

```bash
# Create migration
npx prisma migrate dev --name your-migration

# Apply migration
npx prisma migrate deploy
```

## Monitoring

### Health Checks

```bash
# Run database health check
npm test -- health.test.ts
```

### Key Metrics

- Connection pool utilization
- Query performance
- Database size
- Backup status

## Security

- Never commit `.env` files
- Use strong passwords for PostgreSQL
- Enable SSL for production connections
- Regularly rotate database credentials

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
# Database Setup Guide

## Overview

The DevOps Roadmap application uses a **dual-database strategy**:

- **Development**: SQLite (simple, file-based, no external dependencies)
- **Production**: PostgreSQL (scalable, concurrent, enterprise-ready)

## Quick Setup

### Development (SQLite)

1. **Navigate to server directory**:
   ```bash
   cd server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Generate Prisma client**:
   ```bash
   npm run prisma:generate
   ```

4. **Setup database**:
   ```bash
   npx prisma db push
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```

### Production (PostgreSQL)

1. **Set environment variables**:
   ```bash
   export NODE_ENV=production
   export DATABASE_URL="postgresql://user:password@host:5432/dbname"
   ```

2. **Run automated deployment**:
   ```bash
   cd server
   npm run db:deploy
   ```

## Environment Variables

### Server (.env)

**Development**:
```env
DATABASE_URL="file:./prisma/dev.db"
NODE_ENV="development"
PORT=3001
JWT_SECRET="dev-secret-key-change-in-production"
```

**Production**:
```env
DATABASE_URL="postgresql://username:password@host:5432/database"
NODE_ENV="production"
PORT=3001
JWT_SECRET="your-super-secret-jwt-key"
```

### ML Service (.env)

**Development**:
```env
DATABASE_URL="file:../server/prisma/dev.db"
PORT=8000
```

**Production**:
```env
DATABASE_URL="postgresql://username:password@host:5432/database"
PORT=8000
```

## Database Commands

### Development Commands

```bash
# Generate Prisma client
npm run prisma:generate

# Push schema changes to database
npx prisma db push

# View database in browser
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma db push --force-reset
```

### Production Commands

```bash
# Automated deployment (recommended)
npm run db:deploy

# Manual migration from SQLite
npm run db:migrate

# Verify migration success
npm run db:verify

# Backup current database
npm run db:backup
```

## Deployment Platforms

### Render

1. **Add PostgreSQL database** in Render dashboard
2. **Set environment variables**:
   - `DATABASE_URL` (from Render's database page)
   - `NODE_ENV=production`
3. **Set build command**: `npm run build`
4. **Set start command**: `npm run db:deploy && npm start`

### Railway

1. **Add PostgreSQL plugin** in Railway project
2. **Set environment variables**:
   - `DATABASE_URL` (from Railway's database variables)
   - `NODE_ENV=production`
3. **Railway will automatically run** `npm run db:deploy` during deployment

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Run database deployment and start app
CMD ["sh", "-c", "npm run db:deploy && npm start"]
```

## Troubleshooting

### Common Issues

**"Database connection failed"**
- Check `DATABASE_URL` format
- Verify PostgreSQL server is running
- Confirm network connectivity

**"Migration script not found"**
- Ensure you're in the `server` directory
- Run `npm install` to install dependencies

**"Prisma client not generated"**
- Run `npm run prisma:generate`
- Check that `DATABASE_URL` is set correctly

### Recovery

**Reset development database**:
```bash
cd server
npx prisma db push --force-reset
```

**Rollback failed migration**:
- Check `server/backups/` directory
- Restore from latest backup file

## Schema Management

### Adding New Models

1. **Edit `server/prisma/schema.prisma`**
2. **Generate client**: `npm run prisma:generate`
3. **Push to database**: `npx prisma db push`

### Database Migrations

For production schema changes:

```bash
# Create migration
npx prisma migrate dev --name your-migration-name

# Apply migration
npx prisma migrate deploy
```

## Security Best Practices

- ✅ Never commit `.env` files
- ✅ Use strong, unique passwords
- ✅ Enable SSL for production connections
- ✅ Regularly rotate database credentials
- ✅ Use environment-specific database users
- ✅ Implement proper access controls

## Performance Monitoring

### Key Metrics to Monitor

- Database connection pool utilization
- Query execution times
- Database size growth
- Backup success/failure
- Error rates

### Health Checks

```bash
# Run database health check
npm test -- health.test.ts
```

## Support

For database-related issues:

1. Check this guide first
2. Review `server/DATABASE_MIGRATION.md` for detailed migration info
3. Check server logs for error details
4. Verify environment variables are correct

## File Structure

```
server/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── dev.db                 # SQLite database (dev only)
├── scripts/
│   ├── deploy-database.js     # Automated deployment
│   ├── migrate-to-postgres.js # Migration script
│   └── verify-migration.js    # Verification script
├── .env                       # Environment variables
└── DATABASE_MIGRATION.md      # Detailed migration guide
```</content>
<parameter name="filePath">c:\Users\ayode\Desktop\devops-roadmap-app\DATABASE_SETUP.md
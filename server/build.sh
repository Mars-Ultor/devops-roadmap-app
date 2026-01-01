#!/bin/bash
echo "Installing dependencies..."
npm install

echo "Installing type definitions..."
npm install @types/node @types/express @types/cors @types/jsonwebtoken @types/bcrypt @types/jest @types/supertest --save-dev --force

echo "Building application..."
npm run build

echo "Setting up database..."
npm run db:setup

echo "Build completed successfully!"
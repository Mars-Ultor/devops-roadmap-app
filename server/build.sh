#!/bin/bash
echo "Installing all dependencies (including dev dependencies)..."
NODE_ENV=development npm install

echo "Ensuring type definitions are available..."
npm install @types/node @types/express @types/cors @types/jsonwebtoken @types/bcrypt @types/jest @types/supertest @jest/globals --save-dev --force

echo "Building application..."
if ! npm run build; then
  echo "TypeScript compilation failed!"
  exit 1
fi

echo "Build completed successfully!"
#!/bin/bash
set -e

echo "Installing all dependencies (including dev dependencies)..."
npm install --include=dev

echo "Verifying type definitions are installed..."
npm list @types/node @types/express || echo "Some types may need to be installed"

echo "Force installing type definitions..."
npm install @types/node@latest @types/express@latest @types/cors@latest @types/jsonwebtoken@latest @types/bcrypt@latest --save-dev

echo "Building application..."
npm run build

echo "Build completed successfully!"
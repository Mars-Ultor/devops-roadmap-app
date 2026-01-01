#!/bin/bash
set -e

echo "Cleaning npm cache and ensuring fresh install..."
rm -rf node_modules package-lock.json

echo "Installing all dependencies (including dev dependencies)..."
npm install

echo "Verifying type definitions are installed..."
ls node_modules/@types/ || echo "Types directory missing"

echo "Building application..."
npm run build

echo "Build completed successfully!"
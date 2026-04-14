echo "Building project..."
npm run build

echo "Running tests..."
npm test

echo "Deploying to Vercel..."
vercel --prod

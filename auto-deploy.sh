#!/bin/bash

# Set working directory to frontend (adjust if different)
cd disclosure-frontend || { echo "Frontend folder not found"; exit 1; }

# Show current Git status
echo "📂 Checking for changes..."
git status

# Add all changes
git add .

# Prompt for a commit message
echo -n "📝 Enter a commit message: "
read commitMsg

# If no message provided, use a default
if [ -z "$commitMsg" ]; then
  commitMsg="Automated commit"
fi

# Commit and push
git commit -m "$commitMsg"
git push origin main

echo "🚀 Changes pushed to origin/main"

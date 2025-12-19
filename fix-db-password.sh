#!/bin/bash

# Quick fix script to set the correct password for syntropedia_user

echo "🔧 Fixing database password..."

# Get the password from .env
DB_PASSWORD=$(grep DATABASE_URL .env | cut -d':' -f3 | cut -d'@' -f1)

echo "Setting password for syntropedia_user..."

sudo -u postgres psql <<EOF
ALTER USER syntropedia_user WITH PASSWORD '$DB_PASSWORD';
EOF

echo "✅ Password updated!"
echo ""
echo "Testing connection..."

psql "postgresql://syntropedia_user:$DB_PASSWORD@localhost:5432/syntropedia" -c "\dt"

if [ $? -eq 0 ]; then
  echo "✅ Connection successful!"
  echo ""
  echo "Now running Prisma db push..."
  npx prisma db push
else
  echo "❌ Connection failed. Please check the credentials."
fi

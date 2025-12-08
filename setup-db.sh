#!/bin/bash

# Syntropedia Database Setup Script
# This script sets up PostgreSQL database for Syntropedia

set -e

echo "🔧 Setting up Syntropedia PostgreSQL database..."

# Generate a secure password
DB_PASSWORD=$(openssl rand -base64 24 | tr -d "=+/" | cut -c1-20)

# Database configuration
DB_NAME="syntropedia"
DB_USER="syntropedia_user"
DB_HOST="localhost"
DB_PORT="5432"

echo "📝 Database Configuration:"
echo "   Database: $DB_NAME"
echo "   User: $DB_USER"
echo "   Host: $DB_HOST"
echo "   Port: $DB_PORT"
echo ""

# Create PostgreSQL user and database using sudo
echo "🔐 Creating PostgreSQL user and database (requires sudo)..."

sudo -u postgres psql <<EOF
-- Create user if not exists
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '$DB_USER') THEN
    CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
  END IF;
END
\$\$;

-- Create database if not exists
SELECT 'CREATE DATABASE $DB_NAME OWNER $DB_USER'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;

-- Connect to the database and grant schema privileges
\c $DB_NAME
GRANT ALL ON SCHEMA public TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;
EOF

echo "✅ Database and user created successfully!"
echo ""

# Update .env file
ENV_FILE=".env"
NEW_DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME?schema=public"

echo "📝 Updating .env file..."

if [ -f "$ENV_FILE" ]; then
  # Backup existing .env
  cp "$ENV_FILE" "$ENV_FILE.backup.$(date +%s)"

  # Update DATABASE_URL in .env
  if grep -q "^DATABASE_URL=" "$ENV_FILE"; then
    sed -i "s|^DATABASE_URL=.*|DATABASE_URL=\"$NEW_DATABASE_URL\"|" "$ENV_FILE"
  else
    echo "DATABASE_URL=\"$NEW_DATABASE_URL\"" >> "$ENV_FILE"
  fi
else
  echo "DATABASE_URL=\"$NEW_DATABASE_URL\"" > "$ENV_FILE"
fi

echo "✅ .env file updated!"
echo ""

# Run Prisma commands to set up database schema
echo "🔨 Setting up database schema with Prisma..."

npx prisma db push

echo "✅ Database schema created!"
echo ""

echo "🎉 Database setup complete!"
echo ""
echo "📋 Summary:"
echo "   Database URL: postgresql://$DB_USER:****@$DB_HOST:$DB_PORT/$DB_NAME"
echo "   .env file has been updated with the new credentials"
echo ""
echo "💡 Next steps:"
echo "   1. Run 'npx prisma studio' to view your database"
echo "   2. Create your first species entry"
echo "   3. Test the search functionality"
echo ""

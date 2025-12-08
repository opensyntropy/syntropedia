# Syntropedia Database Setup Guide

This guide will help you set up the PostgreSQL database for Syntropedia.

## Option 1: Automated Setup (Recommended)

Run the provided setup script. It will automatically create the database, user, and configure your `.env` file:

```bash
./setup-db.sh
```

**Note**: You'll be prompted for your sudo password to create the PostgreSQL database and user.

The script will:
- Generate a secure random password
- Create a PostgreSQL user `syntropedia_user`
- Create a database named `syntropedia`
- Update your `.env` file with the new credentials
- Run Prisma migrations to create the database schema

## Option 2: Manual Setup

If you prefer to set up the database manually, follow these steps:

### Step 1: Create PostgreSQL User and Database

Open a PostgreSQL session as the postgres superuser:

```bash
sudo -u postgres psql
```

Then run the following SQL commands:

```sql
-- Create user (replace YOUR_SECURE_PASSWORD with a strong password)
CREATE USER syntropedia_user WITH PASSWORD 'YOUR_SECURE_PASSWORD';

-- Create database
CREATE DATABASE syntropedia OWNER syntropedia_user;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE syntropedia TO syntropedia_user;

-- Connect to the database
\c syntropedia

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO syntropedia_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO syntropedia_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO syntropedia_user;

-- Exit
\q
```

### Step 2: Update .env File

Update your `.env` file with the database connection URL:

```env
DATABASE_URL="postgresql://syntropedia_user:YOUR_SECURE_PASSWORD@localhost:5432/syntropedia?schema=public"
```

**Important**: Replace `YOUR_SECURE_PASSWORD` with the password you created in Step 1.

### Step 3: Run Prisma Migrations

Create the database schema:

```bash
npx prisma db push
```

This will create all the necessary tables based on the Prisma schema.

### Step 4: Generate Prisma Client

Generate the Prisma client for type-safe database access:

```bash
npx prisma generate
```

## Verifying the Setup

To verify your database is set up correctly:

1. **Check database connection**:
   ```bash
   npx prisma studio
   ```
   This will open Prisma Studio at `http://localhost:5555` where you can view and manage your database.

2. **Test the search API**:
   - Start your dev server: `npm run dev`
   - Try searching for a species (after adding some test data)

## Seeding Test Data

To add some test species data to your database for development:

```bash
npx prisma db seed
```

(Note: You'll need to create a seed script in `prisma/seed.ts` first)

## Troubleshooting

### Connection Refused

If you get a "connection refused" error:
- Check if PostgreSQL is running: `systemctl status postgresql`
- Start PostgreSQL if needed: `sudo systemctl start postgresql`

### Authentication Failed

If you get an authentication error:
- Verify your credentials in the `.env` file
- Make sure the password in `.env` matches the password you set for the user
- Check PostgreSQL authentication settings in `/etc/postgresql/*/main/pg_hba.conf`

### Database Does Not Exist

If you get a "database does not exist" error:
- Make sure you ran the `CREATE DATABASE` command
- Verify the database name in your `.env` file matches

## Database Schema Overview

The Syntropedia database includes the following main tables:

- **users**: User accounts with roles (USER, MODERATOR, ADMIN)
- **species**: Plant species with comprehensive botanical data
- **photos**: Species photos with metadata
- **change_history**: Audit trail of species data changes

Key features:
- Full-text search on scientific names, common names, and genus
- Indexed fields for fast filtering (stratum, successional stage, status)
- Support for multiple common names and synonyms per species
- Photo management with primary photo selection
- Complete audit trail for species data changes

## Next Steps

After setting up the database:

1. Create your first user account (through the app's sign-up flow)
2. Add species data (either manually or through seed script)
3. Test the search functionality on the home page
4. Explore the catalog and species detail pages

## Security Notes

- Never commit your `.env` file with real credentials
- Use strong, unique passwords for database users
- In production, use environment-specific credentials
- Consider using connection pooling (e.g., PgBouncer) for production

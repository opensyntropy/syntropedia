# Syntropedia Database Quick Start

This guide will get your Syntropedia database up and running in 3 simple steps.

## Prerequisites

- PostgreSQL 16 installed and running
- Node.js and npm installed
- Project dependencies installed (`npm install` already run)

## Quick Setup (3 Steps)

### Step 1: Run the Database Setup Script

```bash
./setup-db.sh
```

**What this does:**
- Creates a PostgreSQL database named `syntropedia`
- Creates a database user `syntropedia_user` with a secure random password
- Updates your `.env` file with the connection credentials
- Runs Prisma migrations to create all database tables

**Note:** You'll be prompted for your sudo password once.

### Step 2: Seed the Database with Test Data

```bash
npx prisma db seed
```

**What this adds:**
- 1 test admin user
- 8 test species with full botanical data:
  - Jatobá (Hymenaea courbaril)
  - Banana (Musa × paradisiaca)
  - Palmito-juçara (Euterpe edulis)
  - Café (Coffea arabica)
  - Acerola (Malpighia emarginata)
  - Ingá (Inga edulis)
  - Ipê-roxo (Handroanthus impetiginosus)
  - Mamão (Carica papaya)
- Photos for each species

### Step 3: Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` and test the search functionality!

---

## Verification

### Check Database with Prisma Studio

```bash
npx prisma studio
```

This opens a visual database browser at `http://localhost:5555` where you can:
- View all species data
- Edit records
- Check relationships
- Verify the seed data

### Test the Search Feature

1. Go to the home page (`http://localhost:3000`)
2. Type in the search bar (try "jatoba", "banana", "cafe", etc.)
3. Results should appear in a dropdown after 2+ characters
4. Click on a species to view its detail page
5. Click "View all results" to go to the catalog page

---

## Manual Setup (Alternative)

If you prefer to set up the database manually or the automated script doesn't work, see [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed step-by-step instructions.

---

## Troubleshooting

### "Role does not exist" or "Authentication failed"

Check your `.env` file and ensure the `DATABASE_URL` is correct:

```env
DATABASE_URL="postgresql://syntropedia_user:YOUR_PASSWORD@localhost:5432/syntropedia?schema=public"
```

### "Database does not exist"

Make sure you ran the setup script or manually created the database with:

```bash
sudo -u postgres psql -c "CREATE DATABASE syntropedia"
```

### PostgreSQL Not Running

Start PostgreSQL:

```bash
sudo systemctl start postgresql
```

Check status:

```bash
systemctl status postgresql
```

### Prisma Client Out of Sync

Regenerate the Prisma client:

```bash
npx prisma generate
```

---

## What's Next?

After setting up the database:

1. **Explore the catalog**: Browse all species at `/catalogo`
2. **Test search**: Try different search terms on the home page
3. **View species details**: Click on any species card
4. **Add your own species**: Create new entries through the admin interface
5. **Customize the seed data**: Edit `prisma/seed.ts` to add more species

---

## Database Schema Overview

Your database now includes:

### Tables

- **users**: User accounts with roles (USER, MODERATOR, ADMIN)
- **species**: Plant species with comprehensive botanical data
- **photos**: Species photos with metadata
- **change_history**: Audit trail of species data changes

### Key Features

- Full-text search on scientific names, common names, and genus
- Indexed fields for fast filtering (stratum, successional stage, status)
- Support for multiple common names and synonyms per species
- Photo management with primary photo selection
- Complete audit trail for species data changes

---

## Need Help?

- **Detailed Setup Instructions**: See [DATABASE_SETUP.md](./DATABASE_SETUP.md)
- **Prisma Documentation**: https://www.prisma.io/docs
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/

---

## Clean Slate (Reset Database)

If you need to start over:

```bash
# Drop and recreate the database
sudo -u postgres psql -c "DROP DATABASE syntropedia"
sudo -u postgres psql -c "CREATE DATABASE syntropedia OWNER syntropedia_user"

# Recreate schema and seed data
npx prisma db push
npx prisma db seed
```

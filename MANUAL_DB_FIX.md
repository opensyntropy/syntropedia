# Database Authentication Fix

The database `syntropedia` was created, but the password for `syntropedia_user` wasn't set correctly.

## Quick Fix

Run this single command in your terminal:

```bash
sudo -u postgres psql -c "ALTER USER syntropedia_user WITH PASSWORD '4k65bAefvSzEuGxvE4Tu';"
```

Then verify the connection works:

```bash
psql "postgresql://syntropedia_user:4k65bAefvSzEuGxvE4Tu@localhost:5432/syntropedia" -c "\dt"
```

## Complete Setup After Fix

Once the password is set correctly, run these commands to complete the setup:

```bash
# 1. Apply the Prisma schema (including new indexes)
npx prisma db push

# 2. Seed the database with 60 Brazilian species
npx tsx scripts/seed-species.ts

# 3. Restart the dev server
# (Kill any running npm run dev processes first)
npm run dev
```

## Expected Result

After running these commands:
- Database will have all tables with proper indexes
- 60 species will be populated with varied characteristics
- Catalog page will show pagination (50 items per page)
- Filters will work server-side with shareable URLs
- Example: `http://localhost:3000/catalogo?stratum=EMERGENT&edibleFruit=true`

## If You Still Have Issues

If the password fix doesn't work, you may need to check your PostgreSQL `pg_hba.conf` file to ensure password authentication is enabled for local connections.

Look for a line like:
```
# IPv4 local connections:
host    all             all             127.0.0.1/32            md5
```

The last column should be `md5` or `scram-sha-256` (not `trust` or `peer`).

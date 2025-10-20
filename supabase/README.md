# Supabase Database Setup

This folder contains SQL migration scripts for the NAKSH Astrology App database schema.

## Setup Instructions

### Option 1: Using Supabase Dashboard (Recommended for Quick Setup)

1. Log in to your Supabase project at https://supabase.com
2. Navigate to the **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the contents of `migrations/001_create_user_profiles.sql`
5. Paste into the SQL editor
6. Click **Run** to execute the migration

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Initialize Supabase in your project (if not already done)
supabase init

# Link to your remote project
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push
```

### Option 3: Manual Execution

You can also execute the SQL directly using any PostgreSQL client connected to your Supabase database.

## Migration Files

- `001_create_user_profiles.sql` - Creates the user_profiles table with RLS policies

## Database Schema

### user_profiles Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key, references auth.users |
| email | TEXT | User email address |
| birth_date | DATE | User's birth date |
| birth_time | TIME | User's birth time |
| birth_location | TEXT | Birth location (city name) |
| birth_latitude | DECIMAL | Birth location latitude |
| birth_longitude | DECIMAL | Birth location longitude |
| birth_timezone | TEXT | IANA timezone identifier |
| moon_sign | TEXT | Calculated Vedic moon sign |
| sun_sign | TEXT | Calculated Vedic sun sign |
| ascendant | TEXT | Calculated rising sign |
| nakshatra | TEXT | Calculated birth star |
| birth_chart | JSONB | Complete birth chart data |
| created_at | TIMESTAMP | Record creation timestamp |
| updated_at | TIMESTAMP | Record update timestamp |

## Row Level Security (RLS)

The table has RLS enabled with the following policies:

- **SELECT**: Users can only view their own profile
- **INSERT**: Users can only create their own profile
- **UPDATE**: Users can only update their own profile
- **DELETE**: Users can only delete their own profile

All policies use `auth.uid()` to ensure users can only access their own data.

## Verification

After running the migration, verify the setup:

```sql
-- Check if table exists
SELECT * FROM information_schema.tables WHERE table_name = 'user_profiles';

-- Check RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'user_profiles';

-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'user_profiles';
```

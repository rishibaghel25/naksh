# Fix Row Level Security (RLS) Error

## The Problem
You're getting this error:
```
"new row violates row-level security policy for table \"user_profiles\""
```

This happens because the RLS policies are blocking profile creation during signup.

## Solution - Apply the Fix

### Option 1: Using Supabase Dashboard (Recommended)

1. **Go to your Supabase Dashboard**
   - Open https://supabase.com
   - Select your project

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run this SQL:**

```sql
-- Fix RLS policies to allow profile creation during signup
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON user_profiles;

-- Recreate policies with proper authentication checks

-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile"
  ON user_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Allow authenticated users to insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow users to delete their own profile
CREATE POLICY "Users can delete their own profile"
  ON user_profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Grant necessary permissions
GRANT ALL ON user_profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
```

4. **Click "Run"**

5. **Verify it worked:**
   - You should see "Success. No rows returned"
   - Try signing up again in your app

### Option 2: Using Supabase CLI

If you have Supabase CLI installed:

```bash
# Apply the migration
supabase db push

# Or run the specific migration file
supabase db execute --file supabase/migrations/002_fix_rls_policies.sql
```

---

## What Changed?

### Before (Blocking):
```sql
CREATE POLICY "Users can insert their own profile"
  ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);
```

### After (Working):
```sql
CREATE POLICY "Users can insert their own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated  -- Added this!
  WITH CHECK (auth.uid() = id);
```

The key change is adding `TO authenticated` which explicitly grants permission to authenticated users.

---

## Test After Fixing

1. **Clear app data** (optional but recommended):
   - Close the app
   - Clear app cache/data
   - Restart the app

2. **Try signing up again:**
   - Enter email and password
   - Select birth date and time
   - Select location from map
   - Click "Sign Up"
   - Should work now! ✅

3. **Check the database:**
   - Go to Supabase Dashboard → Table Editor
   - Open `user_profiles` table
   - You should see your new profile with all data

---

## Other Warnings (Not Critical)

### Navigation Warning
```
Non-serializable values were found in the navigation state
```

This is just a warning about passing functions in navigation params. It doesn't break anything, but we can fix it later by using a different pattern for the location picker callback.

### Metro Bundler Errors
```
Error: ENOENT: no such file or directory, open 'InternalBytecode.js'
```

These are just Metro bundler warnings during development. They don't affect functionality. You can ignore them or restart the Metro bundler:

```bash
# Stop the current bundler (Ctrl+C)
# Clear cache and restart
npx expo start -c
```

---

## Quick Checklist

- [ ] Run the SQL fix in Supabase Dashboard
- [ ] Verify "Success" message appears
- [ ] Try signing up a new user
- [ ] Check if profile is created in database
- [ ] Verify horoscope displays after login

---

## If Still Not Working

If you still get RLS errors after applying the fix:

1. **Check if migration was applied:**
   - Go to Supabase Dashboard → Database → Policies
   - Look for the policies on `user_profiles` table
   - Verify they show "TO authenticated"

2. **Check authentication:**
   - Make sure your Supabase URL and anon key are correct in `.env`
   - Verify the user is actually being created in auth.users table

3. **Try disabling RLS temporarily (for testing only):**
   ```sql
   ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
   ```
   
   If this works, the issue is with the policies. Re-enable RLS and adjust policies:
   ```sql
   ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
   ```

4. **Check Supabase logs:**
   - Go to Supabase Dashboard → Logs
   - Look for any authentication or policy errors

---

## Need Help?

If you're still stuck, check:
1. Supabase project is active and not paused
2. Database connection is working
3. Auth is properly configured
4. User is being created in auth.users table before profile creation

The fix should work! The key is adding `TO authenticated` to the INSERT policy.

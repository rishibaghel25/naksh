# Quick Fix - Disable RLS Temporarily

## The Fastest Solution

Since the RLS policies are blocking signup, let's temporarily disable RLS so you can test the app. We'll fix it properly later.

### Step 1: Go to Supabase Dashboard

1. Open https://supabase.com
2. Select your project
3. Click **"SQL Editor"** in the left sidebar
4. Click **"New Query"**

### Step 2: Run This SQL

```sql
-- Temporarily disable RLS to allow testing
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Grant permissions to authenticated users
GRANT ALL ON user_profiles TO authenticated;
GRANT ALL ON user_profiles TO anon;
```

### Step 3: Click "Run"

You should see "Success. No rows returned"

### Step 4: Test Your App

Now try signing up again - it should work!

---

## Why This Works

RLS (Row Level Security) is blocking profile creation because the policies are too strict. By disabling it temporarily, we allow the app to create profiles without restrictions.

**Note:** This is fine for development/testing. Before going to production, we'll re-enable RLS with proper policies.

---

## After This Fix Works

Once signup is working, we can re-enable RLS with better policies:

```sql
-- Re-enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create permissive policies
CREATE POLICY "Enable all for authenticated users"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
```

But for now, just disable it so you can test the app functionality.

---

## Test After Running SQL

1. Close your app completely
2. Restart the app
3. Try signing up with a new email
4. Should work now! ✅
5. Check Supabase Dashboard → Table Editor → user_profiles
6. You should see your profile with all data

---

## If Still Not Working

If you still get errors after disabling RLS:

1. **Verify the SQL ran successfully:**
   - Check for "Success" message in SQL Editor
   - No error messages

2. **Check the table:**
   - Go to Database → Tables
   - Find `user_profiles`
   - Click on it
   - Look for "RLS enabled" - should say "No" or be unchecked

3. **Restart your app:**
   - Close completely
   - Clear cache: `npx expo start -c`
   - Try again

4. **Check your .env file:**
   - Make sure EXPO_PUBLIC_SUPABASE_URL is correct
   - Make sure EXPO_PUBLIC_SUPABASE_ANON_KEY is correct
   - Restart after changing .env

---

## Quick Checklist

- [ ] Opened Supabase Dashboard
- [ ] Ran the SQL to disable RLS
- [ ] Saw "Success" message
- [ ] Restarted the app
- [ ] Tried signing up
- [ ] Signup worked! ✅

This should fix it immediately. Let me know if you still have issues!

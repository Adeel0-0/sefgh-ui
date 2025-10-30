# Database Setup Guide

## Prerequisites
- A Supabase account
- A Supabase project created

## Setup Instructions

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and API keys

### 2. Run Database Schema
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `schema.sql`
4. Paste and run the SQL script

This will create:
- 8 tables (user_profiles, chat_sessions, chat_messages, shareable_links, link_analytics, link_permissions, user_settings)
- All necessary indexes
- Row Level Security (RLS) policies
- Triggers for automatic timestamps
- Auto-creation of user profiles on signup

### 3. Verify Setup
After running the schema, verify:
- All tables are created in the **Table Editor**
- RLS is enabled on all tables
- Policies are created and active

### 4. Configure Environment Variables
Update your `/server/.env` file with your Supabase credentials:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
```

You can find these values in:
- Project Settings > API
- SUPABASE_URL: Project URL
- SUPABASE_ANON_KEY: anon / public key
- SUPABASE_SERVICE_KEY: service_role / secret key

### 5. Test Connection
Start the server and test the health endpoint:

```bash
cd server
npm run dev

# In another terminal
curl http://localhost:3001/api/health
```

## Database Schema Overview

### Core Tables

#### user_profiles
Extended user information beyond Supabase Auth
- Personal details (name, bio, avatar)
- Social accounts
- Public profile settings
- ORCID integration

#### chat_sessions
Store conversation sessions
- Links to user
- Session title
- Timestamps

#### chat_messages
Individual messages within sessions
- User or assistant role
- Message content
- Metadata (JSON)

#### shareable_links
Create shareable links for content
- Unique file IDs
- Password protection
- View limits and expiration
- Analytics tracking

#### link_analytics
Track views and engagement
- View timestamps
- Referrer information
- User agent data
- Geographic information

#### link_permissions
Access control for links
- Email-based permissions
- Domain restrictions
- IP whitelist

#### user_settings
User preferences
- General settings
- Notifications
- Security
- Appearance
- Proxy configuration

## Row Level Security (RLS)

All tables have RLS enabled with policies ensuring:
- Users can only access their own data
- Public profiles are viewable by anyone
- Shareable links work as expected
- Analytics are tracked properly

## Automatic Features

### Auto-timestamps
Tables automatically update their `updated_at` field on modification.

### User Profile Creation
When a user signs up via Supabase Auth:
- A user profile is automatically created
- Default settings are initialized
- Primary email is set from auth

## Testing

Use the Supabase SQL Editor to test queries:

```sql
-- View all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check RLS policies
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

## Troubleshooting

### Error: "permission denied for table"
- Ensure RLS policies are created
- Verify you're using the correct Supabase keys
- Check that the user is authenticated

### Error: "relation does not exist"
- Verify the schema was executed successfully
- Check you're connected to the correct project

### Error: "duplicate key value"
- Ensure unique constraints are respected
- Check for existing data conflicts

## Maintenance

### Backup
Supabase automatically backs up your database daily. You can also:
1. Go to Database > Backups
2. Download manual backups as needed

### Migration
For schema changes:
1. Create a new SQL file with changes
2. Test in a development project first
3. Apply to production via SQL Editor

## Security Best Practices

1. **Never commit .env files** with real credentials
2. **Use service_role key** only on backend
3. **Use anon key** for client applications
4. **Enable RLS** on all tables
5. **Review policies** regularly
6. **Monitor analytics** for suspicious activity

## Support

For issues:
- Check Supabase documentation
- Review error logs in Supabase dashboard
- Check API logs in your Express server

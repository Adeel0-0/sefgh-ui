# SEFGH Application - Refactoring Blueprint

## Overview
This document outlines the strategic plan for transitioning the SEFGH application from a localStorage-based client-only app to a fullstack application with Express.js backend and PostgreSQL database.

---

## Phase 1: Backend API Development

### 1.1 Database Schema Setup
**Location:** Supabase SQL Editor

**Tables to Create:**
1. **users** (if not using Supabase Auth built-in table)
   - Additional profile fields

2. **chat_sessions**
   - `id` (uuid, primary key)
   - `user_id` (uuid, foreign key to auth.users)
   - `title` (text)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

3. **chat_messages**
   - `id` (uuid, primary key)
   - `session_id` (uuid, foreign key to chat_sessions)
   - `role` (text: 'user' or 'assistant')
   - `content` (text)
   - `metadata` (jsonb)
   - `created_at` (timestamp)

4. **shareable_links**
   - `id` (uuid, primary key)
   - `user_id` (uuid, foreign key)
   - `file_id` (text, unique)
   - `title` (text)
   - `description` (text)
   - `content` (jsonb)
   - `content_type` (text)
   - `expires_at` (timestamp)
   - `max_views` (integer)
   - `current_views` (integer, default 0)
   - `password_hash` (text, nullable)
   - `is_active` (boolean, default true)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

5. **link_analytics**
   - `id` (uuid, primary key)
   - `link_id` (uuid, foreign key to shareable_links)
   - `viewed_at` (timestamp)
   - `viewer_ip` (text, hashed)
   - `referrer` (text)
   - `user_agent` (text)
   - `location` (jsonb)

6. **link_permissions**
   - `id` (uuid, primary key)
   - `link_id` (uuid, foreign key)
   - `permission_type` (text)
   - `allowed_emails` (text[])
   - `allowed_domains` (text[])
   - `ip_whitelist` (text[])

7. **user_profiles**
   - `user_id` (uuid, primary key, foreign key to auth.users)
   - `full_name` (text)
   - `bio` (text)
   - `pronouns` (text)
   - `avatar_url` (text)
   - `website` (text)
   - `company` (text)
   - `location` (text)
   - `emails` (jsonb)
   - `social_accounts` (jsonb)
   - `orcid` (text)
   - `is_public` (boolean)
   - `public_link_id` (text, unique)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

8. **user_settings**
   - `user_id` (uuid, primary key)
   - `general_settings` (jsonb)
   - `notifications` (jsonb)
   - `security` (jsonb)
   - `appearance` (jsonb)
   - `proxy_config` (jsonb)
   - `updated_at` (timestamp)

### 1.2 API Routes to Implement

#### Chat Routes (`/routes/chat.routes.js`)
- `POST /api/chats` - Create new chat session
- `GET /api/chats` - Get all user chat sessions
- `GET /api/chats/:id` - Get specific chat session with messages
- `PUT /api/chats/:id` - Update chat session (title, etc.)
- `DELETE /api/chats/:id` - Delete chat session
- `POST /api/chats/:id/messages` - Add message to chat
- `PUT /api/chats/:id/messages/:messageId` - Edit message
- `DELETE /api/chats/:id/messages/:messageId` - Delete message

#### Profile Routes (`/routes/profile.routes.js`)
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `POST /api/profile/avatar` - Upload avatar
- `DELETE /api/profile/avatar` - Delete avatar
- `POST /api/profile/emails` - Add email
- `DELETE /api/profile/emails/:email` - Remove email
- `POST /api/profile/social` - Add social account
- `DELETE /api/profile/social/:id` - Remove social account
- `GET /api/profile/public/:linkId` - Get public profile

#### Share Routes (`/routes/share.routes.js`)
- `POST /api/share` - Create shareable link
- `GET /api/share` - Get user's shareable links
- `GET /api/share/:fileId` - Get shareable content (public)
- `PUT /api/share/:id` - Update shareable link
- `DELETE /api/share/:id` - Delete shareable link
- `POST /api/share/:id/toggle` - Enable/disable link
- `GET /api/share/:id/analytics` - Get link analytics

#### Settings Routes (`/routes/settings.routes.js`)
- `GET /api/settings` - Get user settings
- `PUT /api/settings/general` - Update general settings
- `PUT /api/settings/notifications` - Update notification settings
- `PUT /api/settings/security` - Update security settings
- `PUT /api/settings/appearance` - Update appearance settings
- `PUT /api/settings/proxy` - Update proxy configuration

#### Auth Middleware (`/middleware/auth.js`)
- Verify Supabase JWT token
- Attach user information to request

---

## Phase 2: Frontend Refactoring

### 2.1 Data Layer Migration

#### ChatService (`/client/services/chat-service.js`)
**Current State:** Uses localStorage for all operations

**Refactoring Plan:**
```javascript
// OLD: localStorage operations
getSessions() {
  const saved = localStorage.getItem(SESSIONS_STORAGE_KEY);
  return JSON.parse(saved);
}

// NEW: API calls
async getSessions() {
  const response = await fetch('/api/chats', {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return await response.json();
}
```

**Changes Required:**
1. Replace `getSessions()` with API call to `GET /api/chats`
2. Replace `saveSession()` with API call to `POST/PUT /api/chats/:id`
3. Replace `deleteSession()` with API call to `DELETE /api/chats/:id`
4. Replace `getSession()` with API call to `GET /api/chats/:id`
5. Keep `createNewSession()` for client-side session creation, then sync to API
6. Remove localStorage operations
7. Add error handling for network failures
8. Add loading states

#### AppContext (`/client/contexts/app-context.js`)
**Current State:** Manages chat sessions with localStorage

**Refactoring Plan:**
1. Add authentication state management
2. Update `loadSession()` to fetch from API
3. Update `createNewChat()` to call API
4. Update `saveActiveSession()` to call API
5. Add user profile state
6. Add settings state

### 2.2 Component Updates

#### HistoryPanel (`/client/components/panels/history-panel.jsx`)
**Refactoring Plan:**
```javascript
// OLD: Load from localStorage
useEffect(() => {
  const allSessions = ChatService.getSessions();
  setSessions(allSessions);
}, []);

// NEW: Load from API
useEffect(() => {
  const loadSessions = async () => {
    try {
      setLoading(true);
      const sessions = await ChatService.getSessions();
      setSessions(sessions);
    } catch (error) {
      showToast('Failed to load chat history', 'error');
    } finally {
      setLoading(false);
    }
  };
  loadSessions();
}, []);
```

**Changes Required:**
1. Add loading state
2. Add error handling
3. Update delete functionality to call API
4. Update rename functionality to call API
5. Add retry logic for failed requests

#### ChatInterface (`/client/components/core/chat/chat-interface.jsx`)
**Refactoring Plan:**
1. Update message submission to save to API
2. Add optimistic updates for better UX
3. Add real-time syncing (optional)
4. Add edit message functionality
5. Add delete message functionality
6. Add regenerate response functionality

### 2.3 New Components to Create

#### Authentication
- `LoginForm` - User login
- `SignupForm` - User registration
- `AuthProvider` - Manage auth state

#### Profile Page (`/client/app/profile/page.js`)
- `ProfilePage` - Main profile page
- `AvatarUpload` - Avatar upload component
- `PersonalInfo` - Personal information form
- `ContactInfo` - Email management
- `PublicProfile` - Public profile settings
- `SocialAccounts` - Social media links

#### Settings Page (`/client/app/settings/page.js`)
- `SettingsPage` - Main settings page
- `SettingsSidebar` - Navigation sidebar
- `GeneralSettings` - General preferences
- `NotificationSettings` - Notification preferences
- `SecuritySettings` - Security options
- `AppearanceSettings` - Theme and appearance
- `ProxySettings` - Proxy configuration

#### Shareable Links
- `ShareModal` - Create shareable link modal
- `ShareLinkManager` - Manage shareable links
- `ShareLinkCard` - Individual link card
- `ShareAnalytics` - Analytics dashboard

#### All Pages Overview
- `AllPagesPanel` - Navigation hub
- `PageCard` - Individual page card
- `QuickStats` - Statistics panel

---

## Phase 3: Feature Implementation

### 3.1 New Features to Add

#### Enhanced Chat Features
1. **Edit Messages**
   - Click message to edit
   - Remove subsequent messages
   - Re-send to AI
   
2. **Delete Messages**
   - Remove individual messages
   - Update database
   
3. **Regenerate Response**
   - Re-send previous user message
   - Remove old response
   
4. **Export Chat**
   - TXT format
   - Markdown format
   - PDF format
   - JSON format

5. **Share Chat**
   - Create shareable link
   - Copy to clipboard
   - Analytics tracking

#### Profile Features
1. Avatar upload with drag-and-drop
2. Multiple email management
3. Social account integration
4. Public profile with QR code
5. ORCID integration

#### Settings Features
1. Model selection
2. Virtual keys management
3. Usage statistics
4. Proxy configuration
5. Appearance customization

### 3.2 Animation & UX Enhancements

#### Install Framer Motion
```bash
cd client
npm install framer-motion
```

#### Add Animations
1. Page transitions
2. Card hover effects
3. Staggered list animations
4. Loading skeletons
5. Toast notifications
6. Modal animations

#### Install Toast System
```bash
cd client
npm install sonner
```

---

## Phase 4: Migration Strategy

### 4.1 Data Migration
1. Create migration script to move localStorage data to database
2. Run on first authenticated session
3. Preserve all existing chat history
4. Clean up localStorage after successful migration

### 4.2 Backward Compatibility
1. Keep localStorage as fallback for unauthenticated users
2. Allow guest mode with localStorage
3. Prompt to sign up to save permanently

### 4.3 Testing Strategy
1. Test each refactored component individually
2. Test API endpoints with Postman/Thunder Client
3. Test authentication flow
4. Test data migration
5. Test error scenarios
6. Test loading states

---

## Implementation Order

### Week 1: Foundation
- [x] Phase 0: Monorepo setup
- [ ] Database schema creation
- [ ] Authentication setup
- [ ] Basic API structure

### Week 2: Core Features
- [ ] Chat API endpoints
- [ ] Refactor ChatService
- [ ] Refactor HistoryPanel
- [ ] Add authentication to frontend

### Week 3: Profile & Settings
- [ ] Profile API endpoints
- [ ] Profile page implementation
- [ ] Settings API endpoints
- [ ] Settings page implementation

### Week 4: Advanced Features
- [ ] Shareable links system
- [ ] Analytics implementation
- [ ] Export functionality
- [ ] All Pages Overview

### Week 5: Polish & Testing
- [ ] Add animations
- [ ] Toast notifications
- [ ] Error handling
- [ ] Performance optimization
- [ ] Testing & bug fixes

---

## Success Criteria

✅ All localStorage operations replaced with API calls  
✅ Authentication working correctly  
✅ Chat history persisted to database  
✅ Profile page fully functional  
✅ Settings page fully functional  
✅ Shareable links working with analytics  
✅ All animations implemented  
✅ Toast notifications for user feedback  
✅ Zero TypeScript files in codebase  
✅ Express.js backend running smoothly  
✅ All tests passing  
✅ No console errors  
✅ Responsive on mobile and desktop  

---

**Status:** Phase 0 Complete - Ready for Phase 1
**Last Updated:** 2025-10-30

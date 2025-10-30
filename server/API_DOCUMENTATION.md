# SEFGH API Documentation

Base URL: `http://localhost:3001` (development)

## Authentication

Most endpoints require authentication using Supabase JWT tokens.

**Header Format:**
```
Authorization: Bearer <supabase_jwt_token>
```

## Health Check

### GET /api/health
Check server status (no auth required)

**Response:**
```json
{
  "status": "ok",
  "message": "SEFGH API Server is running",
  "timestamp": "2025-10-30T19:00:00.000Z"
}
```

---

## Chat Endpoints

### GET /api/chats
Get all chat sessions for authenticated user

**Auth:** Required

**Response:**
```json
{
  "sessions": [
    {
      "id": "uuid",
      "title": "Chat about React",
      "created_at": "2025-10-30T19:00:00.000Z",
      "updated_at": "2025-10-30T19:00:00.000Z"
    }
  ]
}
```

### GET /api/chats/:id
Get specific chat session with messages

**Auth:** Required

**Response:**
```json
{
  "session": {
    "id": "uuid",
    "title": "Chat about React",
    "created_at": "2025-10-30T19:00:00.000Z",
    "messages": [
      {
        "id": "uuid",
        "role": "user",
        "content": "Tell me about React",
        "created_at": "2025-10-30T19:00:00.000Z"
      }
    ]
  }
}
```

### POST /api/chats
Create new chat session

**Auth:** Required

**Body:**
```json
{
  "title": "New Chat",
  "messages": [
    {
      "role": "user",
      "content": "Hello",
      "metadata": {}
    }
  ]
}
```

**Response:**
```json
{
  "session": {
    "id": "uuid",
    "title": "New Chat",
    "created_at": "2025-10-30T19:00:00.000Z"
  }
}
```

### PUT /api/chats/:id
Update chat session

**Auth:** Required

**Body:**
```json
{
  "title": "Updated Title"
}
```

### DELETE /api/chats/:id
Delete chat session

**Auth:** Required

**Response:**
```json
{
  "message": "Chat deleted successfully"
}
```

### POST /api/chats/:id/messages
Add message to chat

**Auth:** Required

**Body:**
```json
{
  "role": "user",
  "content": "New message",
  "metadata": {}
}
```

### PUT /api/chats/:sessionId/messages/:messageId
Update a message

**Auth:** Required

**Body:**
```json
{
  "content": "Updated message content"
}
```

### DELETE /api/chats/:sessionId/messages/:messageId
Delete a message

**Auth:** Required

---

## Profile Endpoints

### GET /api/profile
Get user profile

**Auth:** Required

**Response:**
```json
{
  "profile": {
    "user_id": "uuid",
    "full_name": "John Doe",
    "bio": "Developer and designer",
    "pronouns": "he/him",
    "avatar_url": "https://...",
    "website": "https://example.com",
    "company": "Tech Corp",
    "location": "San Francisco",
    "emails": [
      {"email": "john@example.com", "primary": true}
    ],
    "social_accounts": [
      {"id": "1", "platform": "github", "username": "johndoe"}
    ],
    "orcid": "0000-0000-0000-0000",
    "is_public": false,
    "public_link_id": null
  }
}
```

### PUT /api/profile
Update user profile

**Auth:** Required

**Body:**
```json
{
  "full_name": "John Doe",
  "bio": "Updated bio",
  "website": "https://newsite.com",
  "is_public": true
}
```

### POST /api/profile/avatar
Upload avatar URL

**Auth:** Required

**Body:**
```json
{
  "avatar_url": "https://storage.supabase.co/..."
}
```

### DELETE /api/profile/avatar
Delete avatar

**Auth:** Required

### POST /api/profile/emails
Add email to profile

**Auth:** Required

**Body:**
```json
{
  "email": "newemail@example.com",
  "primary": false
}
```

### DELETE /api/profile/emails/:email
Remove email from profile

**Auth:** Required

**Note:** Cannot remove primary email or last email

### POST /api/profile/social
Add social account

**Auth:** Required

**Body:**
```json
{
  "platform": "github",
  "username": "johndoe"
}
```

### DELETE /api/profile/social/:id
Remove social account

**Auth:** Required

### GET /api/profile/public/:linkId
Get public profile (no auth required)

**Auth:** Optional

**Response:**
```json
{
  "profile": {
    "full_name": "John Doe",
    "bio": "Developer",
    "avatar_url": "https://...",
    "social_accounts": []
  }
}
```

---

## Share Endpoints

### POST /api/share
Create shareable link

**Auth:** Required

**Body:**
```json
{
  "title": "My Chat",
  "description": "Interesting conversation",
  "content": {"messages": []},
  "content_type": "chat",
  "expires_at": "2025-12-31T23:59:59Z",
  "max_views": 100,
  "password": "optional-password"
}
```

**Response:**
```json
{
  "link": {
    "id": "uuid",
    "file_id": "abc123",
    "title": "My Chat",
    "is_active": true,
    "current_views": 0
  }
}
```

### GET /api/share
Get all shareable links

**Auth:** Required

**Response:**
```json
{
  "links": [
    {
      "id": "uuid",
      "file_id": "abc123",
      "title": "My Chat",
      "content_type": "chat",
      "current_views": 5,
      "is_active": true
    }
  ]
}
```

### GET /api/share/:fileId
Get shareable content (public)

**Auth:** Optional

**Query Params:**
- `password` (optional): Password if link is protected

**Response:**
```json
{
  "content": {},
  "title": "My Chat",
  "description": "Description",
  "content_type": "chat"
}
```

**Error Responses:**
- 401: Password required / Incorrect password
- 403: View limit exceeded
- 404: Link not found or expired
- 410: Link disabled

### PUT /api/share/:id
Update shareable link

**Auth:** Required

**Body:**
```json
{
  "title": "Updated Title",
  "is_active": false,
  "max_views": 200
}
```

### DELETE /api/share/:id
Delete shareable link

**Auth:** Required

### POST /api/share/:id/toggle
Toggle link active status

**Auth:** Required

**Response:**
```json
{
  "link": {
    "id": "uuid",
    "is_active": false
  }
}
```

### GET /api/share/:id/analytics
Get link analytics

**Auth:** Required

**Response:**
```json
{
  "link": {
    "id": "uuid",
    "title": "My Chat",
    "current_views": 10
  },
  "analytics": [
    {
      "id": "uuid",
      "viewed_at": "2025-10-30T19:00:00.000Z",
      "referrer": "https://twitter.com",
      "user_agent": "Mozilla/5.0..."
    }
  ],
  "summary": {
    "total_views": 10,
    "analytics_records": 10
  }
}
```

---

## Settings Endpoints

### GET /api/settings
Get all user settings

**Auth:** Required

**Response:**
```json
{
  "settings": {
    "user_id": "uuid",
    "general_settings": {
      "default_model": "gpt-4",
      "auto_save": true,
      "theme": "dark"
    },
    "notifications": {
      "email": true,
      "push": false
    },
    "security": {
      "two_factor": false
    },
    "appearance": {
      "theme": "dark",
      "font_size": "medium"
    },
    "proxy_config": {
      "enabled": false,
      "address": "",
      "port": ""
    }
  }
}
```

### PUT /api/settings/general
Update general settings

**Auth:** Required

**Body:**
```json
{
  "general_settings": {
    "default_model": "gpt-3.5-turbo",
    "auto_save": true
  }
}
```

### PUT /api/settings/notifications
Update notification settings

**Auth:** Required

**Body:**
```json
{
  "notifications": {
    "email": false,
    "push": true
  }
}
```

### PUT /api/settings/security
Update security settings

**Auth:** Required

**Body:**
```json
{
  "security": {
    "two_factor": true,
    "session_timeout": 7200
  }
}
```

### PUT /api/settings/appearance
Update appearance settings

**Auth:** Required

**Body:**
```json
{
  "appearance": {
    "theme": "light",
    "font_size": "large"
  }
}
```

### PUT /api/settings/proxy
Update proxy configuration

**Auth:** Required

**Body:**
```json
{
  "proxy_config": {
    "enabled": true,
    "address": "proxy.example.com",
    "port": "8080",
    "requires_auth": true,
    "username": "user",
    "password": "pass"
  }
}
```

---

## Error Responses

### Standard Error Format
```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

### Common Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `410` - Gone (resource disabled)
- `500` - Internal Server Error

---

## Rate Limiting

Currently no rate limiting is implemented. This should be added in production.

## CORS

The server accepts requests from:
- `http://localhost:3000` (development)

Configure `CLIENT_URL` in `.env` for production.

## Testing

Use tools like:
- Postman
- Thunder Client (VS Code extension)
- curl
- HTTPie

**Example with curl:**
```bash
# Health check
curl http://localhost:3001/api/health

# Authenticated request
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3001/api/profile
```

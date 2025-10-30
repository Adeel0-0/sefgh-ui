# SEFGH AI - GitHub Search Engine

An AI-first, conversational GitHub search engine built with Next.js, Express.js, and Supabase.

## 🏗️ Architecture

This is a **fullstack monorepo** application:
- **Frontend:** Next.js 15 with React 19 (JavaScript only)
- **Backend:** Express.js API server
- **Database:** PostgreSQL (Supabase)
- **Authentication:** Supabase Auth

## ✨ Features

- 🤖 AI-powered conversational interface
- 🔍 GitHub repository search integration
- 💾 Persistent chat history with PostgreSQL
- 👤 User profiles with avatar upload
- 🔗 Shareable chat links with analytics
- ⚙️ Advanced settings and proxy configuration
- 🎨 Modern UI with shadcn/ui components
- 🌙 Dark mode by default
- 📊 Usage analytics and statistics
- 🔐 Authentication and authorization

## 🛠️ Tech Stack

### Frontend (`/client`)
- **Framework:** Next.js 15 (App Router)
- **Language:** JavaScript (.js/.jsx)
- **UI Components:** shadcn/ui
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Animations:** Framer Motion (to be added)

### Backend (`/server`)
- **Framework:** Express.js
- **Language:** JavaScript (ES Modules)
- **Database Client:** @supabase/supabase-js
- **Validation:** Zod
- **Middleware:** CORS, dotenv

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (for database and auth)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Adeel0-0/sefgh-ui.git
cd sefgh-ui
```

2. **Install Client Dependencies:**
```bash
cd client
npm install
```

3. **Install Server Dependencies:**
```bash
cd ../server
npm install
```

4. **Configure Environment Variables:**

Create `/server/.env` from the example file:
```bash
cd server
cp .env.example .env
# Edit .env with your Supabase credentials
```

### Running the Application

**Development Mode:**

1. Start the backend server:
```bash
cd server
npm run dev
```

2. In a new terminal, start the frontend:
```bash
cd client
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

The API server will be running on [http://localhost:3001](http://localhost:3001).

## 📁 Project Structure

```
sefgh-ui/
├── client/                   # Next.js Frontend Application
│   ├── app/                 # Next.js app directory
│   │   ├── layout.js       # Root layout
│   │   ├── page.js         # Main page
│   │   └── globals.css     # Global styles
│   ├── components/
│   │   ├── core/           # Core components (header, chat)
│   │   ├── panels/         # Panel components (history, search)
│   │   ├── views/          # View components (welcome, chat)
│   │   └── ui/             # shadcn/ui components
│   ├── contexts/           # React contexts
│   ├── services/           # API services
│   ├── lib/                # Utility functions
│   └── public/             # Static assets
│
├── server/                  # Express.js Backend API
│   ├── index.js            # Server entry point
│   ├── routes/             # API route handlers
│   ├── middleware/         # Custom middleware
│   ├── config/             # Configuration files
│   └── utils/              # Utility functions
│
└── README.md               # This file
```

## 🔄 API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Coming Soon
- `POST /api/chats` - Create new chat
- `GET /api/chats` - Get user's chat history
- `PUT /api/chats/:id` - Update chat
- `DELETE /api/chats/:id` - Delete chat
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `POST /api/share` - Create shareable link
- `GET /api/settings` - Get user settings

## 🗄️ Database Schema

See the documentation for complete schema details including:
- `shareable_links` - Store shareable chat links
- `link_analytics` - Track link views and analytics
- `link_permissions` - Manage link access permissions

## 📝 Development Guidelines

### Code Style
- **JavaScript Only** - No TypeScript files (.ts/.tsx)
- **ES Modules** - Use import/export syntax
- **Functional Components** - React functional components with hooks
- **Tailwind CSS** - Utility-first CSS framework

### Git Workflow
1. Create feature branch
2. Make changes
3. Test thoroughly
4. Commit with descriptive messages
5. Push and create PR

## 🧪 Testing

```bash
# Frontend tests
cd client
npm test

# Backend tests
cd server
npm test
```

## 📦 Building for Production

```bash
# Build frontend
cd client
npm run build

# Start production server
cd server
npm start
```

## 🤝 Contributing

Contributions are welcome! Please read the contributing guidelines before submitting PRs.

## 📄 License

MIT

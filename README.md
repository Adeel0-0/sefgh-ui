# SEFGH AI - GitHub Search Engine

An AI-first, conversational GitHub search engine built with Next.js and shadcn/ui.

## Features

- 🤖 AI-powered conversational interface
- 🔍 GitHub repository search integration
- 💾 Chat history persistence with localStorage
- 🎨 Modern UI with shadcn/ui components
- 🌙 Dark mode by default

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** JavaScript
- **UI Components:** shadcn/ui
- **Styling:** Tailwind CSS
- **Icons:** Lucide React

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Type a message in the chat interface asking to search for repositories (e.g., "search for react frameworks")
2. Click the "Show Relevant Repositories" button when it appears
3. Use the GitHub Search panel to find repositories
4. Your chat history is automatically saved to localStorage

## Project Structure

```
/
├── app/                     # Next.js app directory
│   ├── layout.js           # Root layout with dark theme
│   ├── page.js             # Main page component
│   └── globals.css         # Global styles
├── components/
│   ├── core/
│   │   ├── app-header.jsx      # Application header
│   │   └── chat/
│   │       └── chat-interface.jsx  # Main chat component
│   ├── panels/
│   │   └── github-search-panel.jsx  # GitHub search panel
│   └── ui/                 # shadcn/ui components
├── services/
│   └── chat-service.js     # localStorage service
└── lib/
    └── utils.js            # Utility functions
```

## License

MIT
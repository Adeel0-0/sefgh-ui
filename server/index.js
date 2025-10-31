import dotenv from 'dotenv';
dotenv.config(); // THIS MUST BE THE FIRST OR SECOND LINE

import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// NOW initialize Supabase, after dotenv has loaded the variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'SEFGH API Server is running',
    timestamp: new Date().toISOString()
  });
});

// Import route handlers
import profileRoutes from './routes/profile.routes.js';
import chatRoutes from './routes/chat.routes.js';
import shareRoutes from './routes/share.routes.js';
import settingsRoutes from './routes/settings.routes.js';

// Use route handlers
app.use('/api/profile', profileRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/share', shareRoutes);
app.use('/api/settings', settingsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SEFGH API Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});

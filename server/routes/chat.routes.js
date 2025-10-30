import express from 'express';
import { supabase } from '../index.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateUser);

/**
 * GET /api/chats
 * Get all chat sessions for the authenticated user
 */
router.get('/', async (req, res) => {
  try {
    const { data: sessions, error } = await supabase
      .from('chat_sessions')
      .select('id, title, created_at, updated_at')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ sessions });
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch chats',
      message: error.message 
    });
  }
});

/**
 * GET /api/chats/:id
 * Get a specific chat session with all messages
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get session
    const { data: session, error: sessionError } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.userId)
      .single();

    if (sessionError) throw sessionError;

    if (!session) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    // Get messages
    const { data: messages, error: messagesError } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', id)
      .order('created_at', { ascending: true });

    if (messagesError) throw messagesError;

    res.json({ 
      session: {
        ...session,
        messages: messages || []
      }
    });
  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch chat',
      message: error.message 
    });
  }
});

/**
 * POST /api/chats
 * Create a new chat session
 */
router.post('/', async (req, res) => {
  try {
    const { title, messages = [] } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Create session
    const { data: session, error: sessionError } = await supabase
      .from('chat_sessions')
      .insert({
        user_id: req.userId,
        title
      })
      .select()
      .single();

    if (sessionError) throw sessionError;

    // Add messages if provided
    if (messages.length > 0) {
      const messagesWithSessionId = messages.map(msg => ({
        session_id: session.id,
        role: msg.role,
        content: msg.content,
        metadata: msg.metadata || {}
      }));

      const { error: messagesError } = await supabase
        .from('chat_messages')
        .insert(messagesWithSessionId);

      if (messagesError) throw messagesError;
    }

    res.status(201).json({ session });
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({ 
      error: 'Failed to create chat',
      message: error.message 
    });
  }
});

/**
 * PUT /api/chats/:id
 * Update a chat session
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const { data: session, error } = await supabase
      .from('chat_sessions')
      .update({ title })
      .eq('id', id)
      .eq('user_id', req.userId)
      .select()
      .single();

    if (error) throw error;

    if (!session) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    res.json({ session });
  } catch (error) {
    console.error('Update chat error:', error);
    res.status(500).json({ 
      error: 'Failed to update chat',
      message: error.message 
    });
  }
});

/**
 * DELETE /api/chats/:id
 * Delete a chat session and all its messages
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', id)
      .eq('user_id', req.userId);

    if (error) throw error;

    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({ 
      error: 'Failed to delete chat',
      message: error.message 
    });
  }
});

/**
 * POST /api/chats/:id/messages
 * Add a message to a chat session
 */
router.post('/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;
    const { role, content, metadata = {} } = req.body;

    if (!role || !content) {
      return res.status(400).json({ error: 'Role and content are required' });
    }

    if (!['user', 'assistant'].includes(role)) {
      return res.status(400).json({ error: 'Role must be "user" or "assistant"' });
    }

    // Verify session belongs to user
    const { data: session, error: sessionError } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('id', id)
      .eq('user_id', req.userId)
      .single();

    if (sessionError || !session) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    // Add message
    const { data: message, error: messageError } = await supabase
      .from('chat_messages')
      .insert({
        session_id: id,
        role,
        content,
        metadata
      })
      .select()
      .single();

    if (messageError) throw messageError;

    res.status(201).json({ message });
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({ 
      error: 'Failed to add message',
      message: error.message 
    });
  }
});

/**
 * PUT /api/chats/:sessionId/messages/:messageId
 * Update a message in a chat session
 */
router.put('/:sessionId/messages/:messageId', async (req, res) => {
  try {
    const { sessionId, messageId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    // Verify session belongs to user
    const { data: session, error: sessionError } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('id', sessionId)
      .eq('user_id', req.userId)
      .single();

    if (sessionError || !session) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    // Update message
    const { data: message, error: messageError } = await supabase
      .from('chat_messages')
      .update({ content })
      .eq('id', messageId)
      .eq('session_id', sessionId)
      .select()
      .single();

    if (messageError) throw messageError;

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({ message });
  } catch (error) {
    console.error('Update message error:', error);
    res.status(500).json({ 
      error: 'Failed to update message',
      message: error.message 
    });
  }
});

/**
 * DELETE /api/chats/:sessionId/messages/:messageId
 * Delete a message from a chat session
 */
router.delete('/:sessionId/messages/:messageId', async (req, res) => {
  try {
    const { sessionId, messageId } = req.params;

    // Verify session belongs to user
    const { data: session, error: sessionError } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('id', sessionId)
      .eq('user_id', req.userId)
      .single();

    if (sessionError || !session) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    // Delete message
    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('id', messageId)
      .eq('session_id', sessionId);

    if (error) throw error;

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ 
      error: 'Failed to delete message',
      message: error.message 
    });
  }
});

export default router;

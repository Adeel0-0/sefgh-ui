const SESSIONS_STORAGE_KEY = 'sefgh-chat-sessions';
const ACTIVE_SESSION_KEY = 'sefgh-active-session-id';

const ChatService = {
  /**
   * Generate a concise title from message content (max 5 words)
   * @param {string} messageContent - The message to generate title from
   * @returns {string} Generated title
   */
  generateTitle(messageContent) {
    if (!messageContent) return 'New Chat';
    
    // Remove extra whitespace and split into words
    const words = messageContent.trim().split(/\s+/);
    
    // Take first 5 words
    const titleWords = words.slice(0, 5);
    let title = titleWords.join(' ');
    
    // Add ellipsis if there were more words
    if (words.length > 5) {
      title += '...';
    }
    
    // Capitalize first letter
    title = title.charAt(0).toUpperCase() + title.slice(1);
    
    return title;
  },

  /**
   * Get all chat sessions from localStorage
   * @returns {Array} Array of ChatSession objects
   */
  getSessions() {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(SESSIONS_STORAGE_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
    return [];
  },

  /**
   * Save or update a chat session
   * @param {Object} session - ChatSession object {id, title, createdAt, messages}
   */
  saveSession(session) {
    try {
      if (typeof window !== 'undefined') {
        const sessions = this.getSessions();
        const existingIndex = sessions.findIndex(s => s.id === session.id);
        
        if (existingIndex >= 0) {
          // Update existing session
          sessions[existingIndex] = session;
        } else {
          // Add new session
          sessions.push(session);
        }
        
        localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
      }
    } catch (error) {
      console.error('Error saving session:', error);
    }
  },

  /**
   * Delete a chat session
   * @param {string} sessionId - ID of the session to delete
   */
  deleteSession(sessionId) {
    try {
      if (typeof window !== 'undefined') {
        const sessions = this.getSessions();
        const filtered = sessions.filter(s => s.id !== sessionId);
        localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(filtered));
        
        // Clear active session if it was deleted
        const activeId = this.getActiveSessionId();
        if (activeId === sessionId) {
          this.clearActiveSessionId();
        }
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  },

  /**
   * Update session title
   * @param {string} sessionId - ID of the session
   * @param {string} newTitle - New title for the session
   */
  updateSessionTitle(sessionId, newTitle) {
    try {
      if (typeof window !== 'undefined') {
        const sessions = this.getSessions();
        const session = sessions.find(s => s.id === sessionId);
        
        if (session) {
          session.title = newTitle;
          this.saveSession(session);
        }
      }
    } catch (error) {
      console.error('Error updating session title:', error);
    }
  },

  /**
   * Get a specific session by ID
   * @param {string} sessionId - ID of the session
   * @returns {Object|null} ChatSession object or null
   */
  getSession(sessionId) {
    const sessions = this.getSessions();
    return sessions.find(s => s.id === sessionId) || null;
  },

  /**
   * Create a new empty session
   * @returns {Object} New ChatSession object
   */
  createNewSession() {
    return {
      id: Date.now().toString(),
      title: 'New Chat',
      createdAt: new Date().toISOString(),
      messages: []
    };
  },

  /**
   * Get active session ID
   * @returns {string|null} Active session ID or null
   */
  getActiveSessionId() {
    try {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(ACTIVE_SESSION_KEY);
      }
    } catch (error) {
      console.error('Error getting active session ID:', error);
    }
    return null;
  },

  /**
   * Set active session ID
   * @param {string} sessionId - ID of the session to set as active
   */
  setActiveSessionId(sessionId) {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(ACTIVE_SESSION_KEY, sessionId);
      }
    } catch (error) {
      console.error('Error setting active session ID:', error);
    }
  },

  /**
   * Clear active session ID
   */
  clearActiveSessionId() {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(ACTIVE_SESSION_KEY);
      }
    } catch (error) {
      console.error('Error clearing active session ID:', error);
    }
  },

  /**
   * Legacy method for backward compatibility - deprecated
   * @deprecated Use getSessions() instead
   */
  loadChatSession() {
    const activeId = this.getActiveSessionId();
    if (activeId) {
      const session = this.getSession(activeId);
      if (session) {
        return session.messages;
      }
    }
    return [];
  },

  /**
   * Legacy method for backward compatibility - deprecated
   * @deprecated Use saveSession() instead
   */
  saveChatSession(messages) {
    // For backward compatibility, save to active session if exists
    const activeId = this.getActiveSessionId();
    if (activeId) {
      const session = this.getSession(activeId);
      if (session) {
        session.messages = messages;
        this.saveSession(session);
      }
    }
  },

  /**
   * Legacy method for backward compatibility - deprecated
   * @deprecated No longer needed
   */
  clearChatSession() {
    this.clearActiveSessionId();
  }
};

export default ChatService;

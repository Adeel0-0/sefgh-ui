const STORAGE_KEY = 'sefgh_chat_session';

const ChatService = {
  /**
   * Save chat session to localStorage
   * @param {Array} messages - Array of message objects {role, content}
   */
  saveChatSession(messages) {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      }
    } catch (error) {
      console.error('Error saving chat session:', error);
    }
  },

  /**
   * Load chat session from localStorage
   * @returns {Array} Array of message objects or initial welcome message
   */
  loadChatSession() {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      }
    } catch (error) {
      console.error('Error loading chat session:', error);
    }
    
    // Return initial welcome message if no session found
    return [
      {
        role: 'assistant',
        content: 'Welcome to SEFGH AI! I can help you search for GitHub repositories. Just ask me to find or search for something, and I\'ll show you relevant results.'
      }
    ];
  },

  /**
   * Clear chat session from localStorage
   */
  clearChatSession() {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error clearing chat session:', error);
    }
  }
};

export default ChatService;

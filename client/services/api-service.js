import { supabase } from '@/lib/supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Get authentication token from Supabase session
 */
const getAuthToken = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
};

/**
 * Make authenticated API request
 */
const apiRequest = async (endpoint, options = {}) => {
  const token = await getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || 'API request failed');
  }

  return data;
};

/**
 * API Service
 */
const ApiService = {
  // ============================================
  // CHAT ENDPOINTS
  // ============================================

  /**
   * Get all chat sessions
   */
  async getChats() {
    return apiRequest('/api/chats');
  },

  /**
   * Get specific chat session with messages
   */
  async getChat(sessionId) {
    return apiRequest(`/api/chats/${sessionId}`);
  },

  /**
   * Create new chat session
   */
  async createChat(title, messages = []) {
    return apiRequest('/api/chats', {
      method: 'POST',
      body: JSON.stringify({ title, messages }),
    });
  },

  /**
   * Update chat session
   */
  async updateChat(sessionId, title) {
    return apiRequest(`/api/chats/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify({ title }),
    });
  },

  /**
   * Delete chat session
   */
  async deleteChat(sessionId) {
    return apiRequest(`/api/chats/${sessionId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Add message to chat
   */
  async addMessage(sessionId, role, content, metadata = {}) {
    return apiRequest(`/api/chats/${sessionId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ role, content, metadata }),
    });
  },

  /**
   * Update message
   */
  async updateMessage(sessionId, messageId, content) {
    return apiRequest(`/api/chats/${sessionId}/messages/${messageId}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  },

  /**
   * Delete message
   */
  async deleteMessage(sessionId, messageId) {
    return apiRequest(`/api/chats/${sessionId}/messages/${messageId}`, {
      method: 'DELETE',
    });
  },

  // ============================================
  // PROFILE ENDPOINTS
  // ============================================

  /**
   * Get user profile
   */
  async getProfile() {
    return apiRequest('/api/profile');
  },

  /**
   * Update user profile
   */
  async updateProfile(profileData) {
    return apiRequest('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  /**
   * Upload avatar
   */
  async uploadAvatar(avatarUrl) {
    return apiRequest('/api/profile/avatar', {
      method: 'POST',
      body: JSON.stringify({ avatar_url: avatarUrl }),
    });
  },

  /**
   * Delete avatar
   */
  async deleteAvatar() {
    return apiRequest('/api/profile/avatar', {
      method: 'DELETE',
    });
  },

  /**
   * Add email to profile
   */
  async addEmail(email, primary = false) {
    return apiRequest('/api/profile/emails', {
      method: 'POST',
      body: JSON.stringify({ email, primary }),
    });
  },

  /**
   * Remove email from profile
   */
  async removeEmail(email) {
    return apiRequest(`/api/profile/emails/${email}`, {
      method: 'DELETE',
    });
  },

  /**
   * Add social account
   */
  async addSocialAccount(platform, username) {
    return apiRequest('/api/profile/social', {
      method: 'POST',
      body: JSON.stringify({ platform, username }),
    });
  },

  /**
   * Remove social account
   */
  async removeSocialAccount(accountId) {
    return apiRequest(`/api/profile/social/${accountId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get public profile
   */
  async getPublicProfile(linkId) {
    return apiRequest(`/api/profile/public/${linkId}`);
  },

  // ============================================
  // SHARE ENDPOINTS
  // ============================================

  /**
   * Create shareable link
   */
  async createShareableLink(data) {
    return apiRequest('/api/share', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get all shareable links
   */
  async getShareableLinks() {
    return apiRequest('/api/share');
  },

  /**
   * Get shareable content by file ID
   */
  async getShareableContent(fileId, password = null) {
    const query = password ? `?password=${encodeURIComponent(password)}` : '';
    return apiRequest(`/api/share/${fileId}${query}`);
  },

  /**
   * Update shareable link
   */
  async updateShareableLink(linkId, updates) {
    return apiRequest(`/api/share/${linkId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  /**
   * Delete shareable link
   */
  async deleteShareableLink(linkId) {
    return apiRequest(`/api/share/${linkId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Toggle link active status
   */
  async toggleShareableLink(linkId) {
    return apiRequest(`/api/share/${linkId}/toggle`, {
      method: 'POST',
    });
  },

  /**
   * Get link analytics
   */
  async getLinkAnalytics(linkId) {
    return apiRequest(`/api/share/${linkId}/analytics`);
  },

  // ============================================
  // SETTINGS ENDPOINTS
  // ============================================

  /**
   * Get all settings
   */
  async getSettings() {
    return apiRequest('/api/settings');
  },

  /**
   * Update general settings
   */
  async updateGeneralSettings(generalSettings) {
    return apiRequest('/api/settings/general', {
      method: 'PUT',
      body: JSON.stringify({ general_settings: generalSettings }),
    });
  },

  /**
   * Update notification settings
   */
  async updateNotificationSettings(notifications) {
    return apiRequest('/api/settings/notifications', {
      method: 'PUT',
      body: JSON.stringify({ notifications }),
    });
  },

  /**
   * Update security settings
   */
  async updateSecuritySettings(security) {
    return apiRequest('/api/settings/security', {
      method: 'PUT',
      body: JSON.stringify({ security }),
    });
  },

  /**
   * Update appearance settings
   */
  async updateAppearanceSettings(appearance) {
    return apiRequest('/api/settings/appearance', {
      method: 'PUT',
      body: JSON.stringify({ appearance }),
    });
  },

  /**
   * Update proxy configuration
   */
  async updateProxyConfig(proxyConfig) {
    return apiRequest('/api/settings/proxy', {
      method: 'PUT',
      body: JSON.stringify({ proxy_config: proxyConfig }),
    });
  },

  // ============================================
  // AUTHENTICATION
  // ============================================

  /**
   * Check if user is authenticated
   */
  async isAuthenticated() {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  },

  /**
   * Get current user
   */
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  /**
   * Sign in with email and password
   */
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  /**
   * Sign up with email and password
   */
  async signUp(email, password, metadata = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    if (error) throw error;
    return data;
  },

  /**
   * Sign out
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
};

export default ApiService;

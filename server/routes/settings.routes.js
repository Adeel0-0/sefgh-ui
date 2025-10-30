import express from 'express';
import { supabase } from '../index.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateUser);

/**
 * GET /api/settings
 * Get all user settings
 */
router.get('/', async (req, res) => {
  try {
    const { data: settings, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', req.userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    // If settings don't exist, create default settings
    if (!settings) {
      const defaultSettings = {
        user_id: req.userId,
        general_settings: {
          default_model: 'gpt-4',
          auto_save: true,
          theme: 'dark'
        },
        notifications: {
          email: true,
          push: false,
          desktop: false
        },
        security: {
          two_factor: false,
          session_timeout: 3600
        },
        appearance: {
          theme: 'dark',
          font_size: 'medium',
          layout: 'default'
        },
        proxy_config: {
          enabled: false,
          address: '',
          port: '',
          requires_auth: false
        }
      };

      const { data: newSettings, error: createError } = await supabase
        .from('user_settings')
        .insert(defaultSettings)
        .select()
        .single();

      if (createError) throw createError;
      return res.json({ settings: newSettings });
    }

    res.json({ settings });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch settings',
      message: error.message 
    });
  }
});

/**
 * PUT /api/settings/general
 * Update general settings
 */
router.put('/general', async (req, res) => {
  try {
    const { general_settings } = req.body;

    if (!general_settings) {
      return res.status(400).json({ error: 'General settings are required' });
    }

    const { data: settings, error } = await supabase
      .from('user_settings')
      .update({ general_settings })
      .eq('user_id', req.userId)
      .select()
      .single();

    if (error) throw error;

    res.json({ settings });
  } catch (error) {
    console.error('Update general settings error:', error);
    res.status(500).json({ 
      error: 'Failed to update general settings',
      message: error.message 
    });
  }
});

/**
 * PUT /api/settings/notifications
 * Update notification settings
 */
router.put('/notifications', async (req, res) => {
  try {
    const { notifications } = req.body;

    if (!notifications) {
      return res.status(400).json({ error: 'Notification settings are required' });
    }

    const { data: settings, error } = await supabase
      .from('user_settings')
      .update({ notifications })
      .eq('user_id', req.userId)
      .select()
      .single();

    if (error) throw error;

    res.json({ settings });
  } catch (error) {
    console.error('Update notification settings error:', error);
    res.status(500).json({ 
      error: 'Failed to update notification settings',
      message: error.message 
    });
  }
});

/**
 * PUT /api/settings/security
 * Update security settings
 */
router.put('/security', async (req, res) => {
  try {
    const { security } = req.body;

    if (!security) {
      return res.status(400).json({ error: 'Security settings are required' });
    }

    const { data: settings, error } = await supabase
      .from('user_settings')
      .update({ security })
      .eq('user_id', req.userId)
      .select()
      .single();

    if (error) throw error;

    res.json({ settings });
  } catch (error) {
    console.error('Update security settings error:', error);
    res.status(500).json({ 
      error: 'Failed to update security settings',
      message: error.message 
    });
  }
});

/**
 * PUT /api/settings/appearance
 * Update appearance settings
 */
router.put('/appearance', async (req, res) => {
  try {
    const { appearance } = req.body;

    if (!appearance) {
      return res.status(400).json({ error: 'Appearance settings are required' });
    }

    const { data: settings, error } = await supabase
      .from('user_settings')
      .update({ appearance })
      .eq('user_id', req.userId)
      .select()
      .single();

    if (error) throw error;

    res.json({ settings });
  } catch (error) {
    console.error('Update appearance settings error:', error);
    res.status(500).json({ 
      error: 'Failed to update appearance settings',
      message: error.message 
    });
  }
});

/**
 * PUT /api/settings/proxy
 * Update proxy configuration
 */
router.put('/proxy', async (req, res) => {
  try {
    const { proxy_config } = req.body;

    if (!proxy_config) {
      return res.status(400).json({ error: 'Proxy configuration is required' });
    }

    const { data: settings, error } = await supabase
      .from('user_settings')
      .update({ proxy_config })
      .eq('user_id', req.userId)
      .select()
      .single();

    if (error) throw error;

    res.json({ settings });
  } catch (error) {
    console.error('Update proxy settings error:', error);
    res.status(500).json({ 
      error: 'Failed to update proxy settings',
      message: error.message 
    });
  }
});

export default router;

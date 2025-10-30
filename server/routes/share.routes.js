import express from 'express';
import { supabase } from '../index.js';
import { authenticateUser, optionalAuth } from '../middleware/auth.js';
import crypto from 'crypto';

const router = express.Router();

/**
 * Generate a unique file ID for shareable links
 */
const generateFileId = () => {
  return crypto.randomBytes(8).toString('hex');
};

/**
 * POST /api/share
 * Create a shareable link
 */
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { 
      title, 
      description, 
      content, 
      content_type, 
      expires_at, 
      max_views, 
      password 
    } = req.body;

    if (!title || !content || !content_type) {
      return res.status(400).json({ 
        error: 'Title, content, and content_type are required' 
      });
    }

    const fileId = generateFileId();
    const password_hash = password ? crypto.createHash('sha256').update(password).digest('hex') : null;

    const { data: link, error } = await supabase
      .from('shareable_links')
      .insert({
        user_id: req.userId,
        file_id: fileId,
        title,
        description,
        content,
        content_type,
        expires_at,
        max_views,
        password_hash
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ link });
  } catch (error) {
    console.error('Create shareable link error:', error);
    res.status(500).json({ 
      error: 'Failed to create shareable link',
      message: error.message 
    });
  }
});

/**
 * GET /api/share
 * Get all shareable links for authenticated user
 */
router.get('/', authenticateUser, async (req, res) => {
  try {
    const { data: links, error } = await supabase
      .from('shareable_links')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ links });
  } catch (error) {
    console.error('Get shareable links error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch shareable links',
      message: error.message 
    });
  }
});

/**
 * GET /api/share/:fileId
 * Get shareable content by file ID (public access)
 */
router.get('/:fileId', optionalAuth, async (req, res) => {
  try {
    const { fileId } = req.params;
    const { password } = req.query;

    const { data: link, error } = await supabase
      .from('shareable_links')
      .select('*')
      .eq('file_id', fileId)
      .single();

    if (error || !link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    // Check if link is active
    if (!link.is_active) {
      return res.status(410).json({ error: 'This link has been disabled' });
    }

    // Check expiration
    if (link.expires_at && new Date(link.expires_at) < new Date()) {
      return res.status(404).json({ error: 'This link has expired' });
    }

    // Check view limit
    if (link.max_views && link.current_views >= link.max_views) {
      return res.status(403).json({ error: 'View limit exceeded' });
    }

    // Check password if required
    if (link.password_hash) {
      if (!password) {
        return res.status(401).json({ 
          error: 'Password required',
          requiresPassword: true 
        });
      }

      const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
      if (passwordHash !== link.password_hash) {
        return res.status(401).json({ error: 'Incorrect password' });
      }
    }

    // Increment view count
    await supabase
      .from('shareable_links')
      .update({ current_views: link.current_views + 1 })
      .eq('id', link.id);

    // Track analytics
    await supabase
      .from('link_analytics')
      .insert({
        link_id: link.id,
        viewer_ip: req.ip ? crypto.createHash('sha256').update(req.ip).digest('hex') : null,
        referrer: req.headers.referer || null,
        user_agent: req.headers['user-agent'] || null
      });

    res.json({ 
      content: link.content,
      title: link.title,
      description: link.description,
      content_type: link.content_type
    });
  } catch (error) {
    console.error('Get shareable content error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch shareable content',
      message: error.message 
    });
  }
});

/**
 * PUT /api/share/:id
 * Update a shareable link
 */
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, expires_at, max_views, is_active } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (expires_at !== undefined) updates.expires_at = expires_at;
    if (max_views !== undefined) updates.max_views = max_views;
    if (is_active !== undefined) updates.is_active = is_active;

    const { data: link, error } = await supabase
      .from('shareable_links')
      .update(updates)
      .eq('id', id)
      .eq('user_id', req.userId)
      .select()
      .single();

    if (error) throw error;

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    res.json({ link });
  } catch (error) {
    console.error('Update shareable link error:', error);
    res.status(500).json({ 
      error: 'Failed to update shareable link',
      message: error.message 
    });
  }
});

/**
 * DELETE /api/share/:id
 * Delete a shareable link
 */
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('shareable_links')
      .delete()
      .eq('id', id)
      .eq('user_id', req.userId);

    if (error) throw error;

    res.json({ message: 'Link deleted successfully' });
  } catch (error) {
    console.error('Delete shareable link error:', error);
    res.status(500).json({ 
      error: 'Failed to delete shareable link',
      message: error.message 
    });
  }
});

/**
 * POST /api/share/:id/toggle
 * Toggle link active status
 */
router.post('/:id/toggle', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    // Get current link
    const { data: currentLink, error: fetchError } = await supabase
      .from('shareable_links')
      .select('is_active')
      .eq('id', id)
      .eq('user_id', req.userId)
      .single();

    if (fetchError || !currentLink) {
      return res.status(404).json({ error: 'Link not found' });
    }

    // Toggle status
    const { data: link, error: updateError } = await supabase
      .from('shareable_links')
      .update({ is_active: !currentLink.is_active })
      .eq('id', id)
      .eq('user_id', req.userId)
      .select()
      .single();

    if (updateError) throw updateError;

    res.json({ link });
  } catch (error) {
    console.error('Toggle link error:', error);
    res.status(500).json({ 
      error: 'Failed to toggle link',
      message: error.message 
    });
  }
});

/**
 * GET /api/share/:id/analytics
 * Get analytics for a shareable link
 */
router.get('/:id/analytics', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    // Verify link belongs to user
    const { data: link, error: linkError } = await supabase
      .from('shareable_links')
      .select('id, title, current_views, created_at')
      .eq('id', id)
      .eq('user_id', req.userId)
      .single();

    if (linkError || !link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    // Get analytics data
    const { data: analytics, error: analyticsError } = await supabase
      .from('link_analytics')
      .select('*')
      .eq('link_id', id)
      .order('viewed_at', { ascending: false });

    if (analyticsError) throw analyticsError;

    res.json({ 
      link,
      analytics: analytics || [],
      summary: {
        total_views: link.current_views,
        analytics_records: analytics?.length || 0
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch analytics',
      message: error.message 
    });
  }
});

export default router;

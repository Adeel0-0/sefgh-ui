import express from 'express';
import { supabase } from '../index.js';
import { authenticateUser, optionalAuth } from '../middleware/auth.js';
import { z } from 'zod';

const router = express.Router();

// Validation schemas
const profileUpdateSchema = z.object({
  full_name: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  pronouns: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  company: z.string().max(100).optional(),
  location: z.string().max(100).optional(),
  orcid: z.string().optional(),
  is_public: z.boolean().optional()
});

const emailSchema = z.object({
  email: z.string().email(),
  primary: z.boolean().optional()
});

const socialAccountSchema = z.object({
  platform: z.string(),
  username: z.string()
});

/**
 * GET /api/profile
 * Get authenticated user's profile
 */
router.get('/', authenticateUser, async (req, res) => {
  try {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', req.userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    // If profile doesn't exist, create one
    if (!profile) {
      const { data: newProfile, error: createError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: req.userId,
          emails: [{ email: req.user.email, primary: true }]
        })
        .select()
        .single();

      if (createError) throw createError;
      return res.json({ profile: newProfile });
    }

    res.json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch profile',
      message: error.message 
    });
  }
});

/**
 * PUT /api/profile
 * Update user profile
 */
router.put('/', authenticateUser, async (req, res) => {
  try {
    // Validate request body
    const validatedData = profileUpdateSchema.parse(req.body);

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .update(validatedData)
      .eq('user_id', req.userId)
      .select()
      .single();

    if (error) throw error;

    res.json({ profile });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation error',
        details: error.errors 
      });
    }

    console.error('Update profile error:', error);
    res.status(500).json({ 
      error: 'Failed to update profile',
      message: error.message 
    });
  }
});

/**
 * POST /api/profile/avatar
 * Upload avatar (placeholder - actual upload would use Supabase Storage)
 */
router.post('/avatar', authenticateUser, async (req, res) => {
  try {
    const { avatar_url } = req.body;

    if (!avatar_url) {
      return res.status(400).json({ error: 'Avatar URL is required' });
    }

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .update({ avatar_url })
      .eq('user_id', req.userId)
      .select()
      .single();

    if (error) throw error;

    res.json({ profile });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ 
      error: 'Failed to upload avatar',
      message: error.message 
    });
  }
});

/**
 * DELETE /api/profile/avatar
 * Delete avatar
 */
router.delete('/avatar', authenticateUser, async (req, res) => {
  try {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .update({ avatar_url: null })
      .eq('user_id', req.userId)
      .select()
      .single();

    if (error) throw error;

    res.json({ profile });
  } catch (error) {
    console.error('Delete avatar error:', error);
    res.status(500).json({ 
      error: 'Failed to delete avatar',
      message: error.message 
    });
  }
});

/**
 * POST /api/profile/emails
 * Add email to profile
 */
router.post('/emails', authenticateUser, async (req, res) => {
  try {
    const validatedEmail = emailSchema.parse(req.body);

    // Get current profile
    const { data: profile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('emails')
      .eq('user_id', req.userId)
      .single();

    if (fetchError) throw fetchError;

    // Check if email already exists
    const emails = profile.emails || [];
    if (emails.some(e => e.email === validatedEmail.email)) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Add new email
    const updatedEmails = [...emails, validatedEmail];

    const { data: updatedProfile, error: updateError } = await supabase
      .from('user_profiles')
      .update({ emails: updatedEmails })
      .eq('user_id', req.userId)
      .select()
      .single();

    if (updateError) throw updateError;

    res.json({ profile: updatedProfile });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation error',
        details: error.errors 
      });
    }

    console.error('Add email error:', error);
    res.status(500).json({ 
      error: 'Failed to add email',
      message: error.message 
    });
  }
});

/**
 * DELETE /api/profile/emails/:email
 * Remove email from profile
 */
router.delete('/emails/:email', authenticateUser, async (req, res) => {
  try {
    const emailToRemove = req.params.email;

    // Get current profile
    const { data: profile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('emails')
      .eq('user_id', req.userId)
      .single();

    if (fetchError) throw fetchError;

    const emails = profile.emails || [];
    
    // Don't allow removing the last email
    if (emails.length <= 1) {
      return res.status(400).json({ error: 'Cannot remove the last email' });
    }

    // Don't allow removing primary email
    const emailObj = emails.find(e => e.email === emailToRemove);
    if (emailObj && emailObj.primary) {
      return res.status(400).json({ error: 'Cannot remove primary email' });
    }

    // Remove email
    const updatedEmails = emails.filter(e => e.email !== emailToRemove);

    const { data: updatedProfile, error: updateError } = await supabase
      .from('user_profiles')
      .update({ emails: updatedEmails })
      .eq('user_id', req.userId)
      .select()
      .single();

    if (updateError) throw updateError;

    res.json({ profile: updatedProfile });
  } catch (error) {
    console.error('Remove email error:', error);
    res.status(500).json({ 
      error: 'Failed to remove email',
      message: error.message 
    });
  }
});

/**
 * POST /api/profile/social
 * Add social account to profile
 */
router.post('/social', authenticateUser, async (req, res) => {
  try {
    const validatedSocial = socialAccountSchema.parse(req.body);

    // Get current profile
    const { data: profile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('social_accounts')
      .eq('user_id', req.userId)
      .single();

    if (fetchError) throw fetchError;

    const socialAccounts = profile.social_accounts || [];
    
    // Add new social account with ID
    const newAccount = {
      id: Date.now().toString(),
      ...validatedSocial
    };
    const updatedSocialAccounts = [...socialAccounts, newAccount];

    const { data: updatedProfile, error: updateError } = await supabase
      .from('user_profiles')
      .update({ social_accounts: updatedSocialAccounts })
      .eq('user_id', req.userId)
      .select()
      .single();

    if (updateError) throw updateError;

    res.json({ profile: updatedProfile });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation error',
        details: error.errors 
      });
    }

    console.error('Add social account error:', error);
    res.status(500).json({ 
      error: 'Failed to add social account',
      message: error.message 
    });
  }
});

/**
 * DELETE /api/profile/social/:id
 * Remove social account from profile
 */
router.delete('/social/:id', authenticateUser, async (req, res) => {
  try {
    const accountId = req.params.id;

    // Get current profile
    const { data: profile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('social_accounts')
      .eq('user_id', req.userId)
      .single();

    if (fetchError) throw fetchError;

    const socialAccounts = profile.social_accounts || [];
    const updatedSocialAccounts = socialAccounts.filter(acc => acc.id !== accountId);

    const { data: updatedProfile, error: updateError } = await supabase
      .from('user_profiles')
      .update({ social_accounts: updatedSocialAccounts })
      .eq('user_id', req.userId)
      .select()
      .single();

    if (updateError) throw updateError;

    res.json({ profile: updatedProfile });
  } catch (error) {
    console.error('Remove social account error:', error);
    res.status(500).json({ 
      error: 'Failed to remove social account',
      message: error.message 
    });
  }
});

/**
 * GET /api/profile/public/:linkId
 * Get public profile by link ID (no auth required)
 */
router.get('/public/:linkId', optionalAuth, async (req, res) => {
  try {
    const { linkId } = req.params;

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('full_name, bio, pronouns, avatar_url, website, company, location, social_accounts, orcid')
      .eq('public_link_id', linkId)
      .eq('is_public', true)
      .single();

    if (error || !profile) {
      return res.status(404).json({ error: 'Public profile not found' });
    }

    res.json({ profile });
  } catch (error) {
    console.error('Get public profile error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch public profile',
      message: error.message 
    });
  }
});

export default router;

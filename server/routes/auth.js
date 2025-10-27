const express = require('express');
const axios = require('axios');
const { db } = require('../index');
const router = express.Router();

/**
 * Initiates Meta OAuth flow
 * Redirects user to Meta login screen
 */
router.get('/meta/connect_start', (req, res) => {
  const { uid } = req.query;
  
  if (!uid) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const metaAppId = process.env.META_APP_ID;
  const redirectUri = encodeURIComponent(process.env.META_REDIRECT_URI);
  const scope = encodeURIComponent('pages_show_list,pages_manage_posts,instagram_basic,instagram_content_publish,pages_read_engagement');
  const state = uid; // Pass uid as state to retrieve it in callback

  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${metaAppId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;

  res.redirect(authUrl);
});

/**
 * Meta OAuth callback
 * Exchanges short-lived token for long-lived token
 * Saves token and Instagram Business ID to Firestore
 */
router.get('/meta/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    const uid = state; // uid was passed as state

    if (!code || !uid) {
      return res.status(400).send('Authorization failed. Missing code or user ID.');
    }

    // Exchange code for short-lived access token
    const tokenResponse = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
      params: {
        client_id: process.env.META_APP_ID,
        client_secret: process.env.META_APP_SECRET,
        redirect_uri: process.env.META_REDIRECT_URI,
        code: code,
      },
    });

    const shortLivedToken = tokenResponse.data.access_token;

    // Exchange short-lived token for long-lived token
    const longLivedTokenResponse = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
      params: {
        grant_type: 'fb_exchange_token',
        client_id: process.env.META_APP_ID,
        client_secret: process.env.META_APP_SECRET,
        fb_exchange_token: shortLivedToken,
      },
    });

    const longLivedToken = longLivedTokenResponse.data.access_token;

    // Get user's Facebook pages
    const pagesResponse = await axios.get('https://graph.facebook.com/v18.0/me/accounts', {
      params: {
        access_token: longLivedToken,
      },
    });

    const pages = pagesResponse.data.data;
    
    if (!pages || pages.length === 0) {
      return res.status(400).send('No Facebook pages found. Please create a Facebook page first.');
    }

    // Use the first page (you can enhance this to let user choose)
    const page = pages[0];
    const pageAccessToken = page.access_token;
    const pageId = page.id;

    // Get Instagram Business Account ID linked to this page
    let instagramBusinessId = null;
    try {
      const igResponse = await axios.get(`https://graph.facebook.com/v18.0/${pageId}`, {
        params: {
          fields: 'instagram_business_account',
          access_token: pageAccessToken,
        },
      });

      if (igResponse.data.instagram_business_account) {
        instagramBusinessId = igResponse.data.instagram_business_account.id;
      }
    } catch (igError) {
      console.warn('Instagram account not found for this page:', igError.message);
    }

    // Save tokens to Firestore
    await db.collection('users').doc(uid).set(
      {
        metaAccessToken: pageAccessToken,
        pageId: pageId,
        pageName: page.name,
        instagramBusinessId: instagramBusinessId,
        metaConnectedAt: new Date(),
      },
      { merge: true }
    );

    // Redirect back to client dashboard
    res.redirect(`${process.env.CLIENT_URL}/dashboard?connected=true`);
  } catch (error) {
    console.error('Meta OAuth callback error:', error.response?.data || error.message);
    res.status(500).send('Error connecting to Meta. Please try again.');
  }
});

module.exports = router;

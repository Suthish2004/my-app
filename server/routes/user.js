const express = require('express');
const { verifyToken } = require('../middleware/auth');
const { db } = require('../index');
const router = express.Router();

/**
 * Create or update user document in Firestore
 */
router.post('/create', verifyToken, async (req, res) => {
  try {
    const uid = req.uid;
    const { email, displayName } = req.body;

    await db.collection('users').doc(uid).set(
      {
        email: email || req.user.email,
        displayName: displayName || req.user.name || null,
        createdAt: new Date(),
      },
      { merge: true }
    );

    res.json({ 
      success: true, 
      message: 'User document created successfully' 
    });
  } catch (error) {
    console.error('Error creating user document:', error);
    res.status(500).json({ 
      error: 'Failed to create user document',
      details: error.message
    });
  }
});

/**
 * Get user profile and connection status
 */
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const uid = req.uid;

    const userDoc = await db.collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    
    // Don't send sensitive tokens to client
    const { metaAccessToken, ...safeUserData } = userData;
    
    res.json({ 
      success: true,
      user: {
        uid,
        ...safeUserData,
        isMetaConnected: !!userData.metaAccessToken,
        isInstagramConnected: !!userData.instagramBusinessId,
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user profile',
      details: error.message
    });
  }
});

module.exports = router;

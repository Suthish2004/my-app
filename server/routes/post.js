const express = require('express');
const axios = require('axios');
const { verifyToken } = require('../middleware/auth');
const { db } = require('../index');
const router = express.Router();

/**
 * Get all posts for the authenticated user
 */
router.get('/my-posts', verifyToken, async (req, res) => {
  try {
    const uid = req.uid;

    const postsSnapshot = await db
      .collection('posts')
      .where('userId', '==', uid)
      .orderBy('createdAt', 'desc')
      .get();

    const posts = [];
    postsSnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });

    res.json({ success: true, posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ 
      error: 'Failed to fetch posts',
      details: error.message
    });
  }
});

/**
 * Update a post (e.g., add image URL, update status)
 */
router.patch('/:postId', verifyToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const uid = req.uid;
    const updates = req.body;

    // Verify the post belongs to the user
    const postRef = db.collection('posts').doc(postId);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (postDoc.data().userId !== uid) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Update the post
    await postRef.update({
      ...updates,
      updatedAt: new Date(),
    });

    res.json({ success: true, message: 'Post updated successfully' });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ 
      error: 'Failed to update post',
      details: error.message
    });
  }
});

/**
 * Post to Facebook and Instagram
 */
router.post('/now', verifyToken, async (req, res) => {
  try {
    const { postId } = req.body;
    const uid = req.uid;

    if (!postId) {
      return res.status(400).json({ error: 'Post ID is required' });
    }

    // Get user's Meta credentials from Firestore
    const userDoc = await db.collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    const { metaAccessToken, pageId, instagramBusinessId } = userData;

    if (!metaAccessToken || !pageId) {
      return res.status(400).json({ 
        error: 'Facebook not connected',
        message: 'Please connect your Facebook account first'
      });
    }

    // Get post data from Firestore
    const postDoc = await db.collection('posts').doc(postId).get();
    
    if (!postDoc.exists) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const postData = postDoc.data();

    if (postData.userId !== uid) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (!postData.imageUrl) {
      return res.status(400).json({ 
        error: 'No image uploaded',
        message: 'Please upload an image before posting'
      });
    }

    const message = `${postData.caption}\n\n${postData.hashtags.join(' ')}`;
    const results = { facebook: null, instagram: null };

    // Post to Facebook
    try {
      const fbResponse = await axios.post(
        `https://graph.facebook.com/v18.0/${pageId}/photos`,
        {
          url: postData.imageUrl,
          caption: message,
          access_token: metaAccessToken,
        }
      );

      results.facebook = {
        success: true,
        postId: fbResponse.data.id,
      };
    } catch (fbError) {
      console.error('Facebook posting error:', fbError.response?.data || fbError.message);
      results.facebook = {
        success: false,
        error: fbError.response?.data?.error?.message || fbError.message,
      };
    }

    // Post to Instagram (if connected)
    if (instagramBusinessId) {
      try {
        // Step 1: Create container
        const containerResponse = await axios.post(
          `https://graph.facebook.com/v18.0/${instagramBusinessId}/media`,
          {
            image_url: postData.imageUrl,
            caption: message,
            access_token: metaAccessToken,
          }
        );

        const creationId = containerResponse.data.id;

        // Step 2: Publish container (wait a moment for processing)
        await new Promise(resolve => setTimeout(resolve, 2000));

        const publishResponse = await axios.post(
          `https://graph.facebook.com/v18.0/${instagramBusinessId}/media_publish`,
          {
            creation_id: creationId,
            access_token: metaAccessToken,
          }
        );

        results.instagram = {
          success: true,
          postId: publishResponse.data.id,
        };
      } catch (igError) {
        console.error('Instagram posting error:', igError.response?.data || igError.message);
        results.instagram = {
          success: false,
          error: igError.response?.data?.error?.message || igError.message,
        };
      }
    } else {
      results.instagram = {
        success: false,
        error: 'Instagram not connected to Facebook page',
      };
    }

    // Update post status
    await db.collection('posts').doc(postId).update({
      status: 'posted',
      postedAt: new Date(),
      postResults: results,
    });

    res.json({
      success: true,
      message: 'Post published',
      results,
    });
  } catch (error) {
    console.error('Post publishing error:', error);
    res.status(500).json({ 
      error: 'Failed to publish post',
      details: error.message
    });
  }
});

/**
 * Delete a post
 */
router.delete('/:postId', verifyToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const uid = req.uid;

    const postRef = db.collection('posts').doc(postId);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (postDoc.data().userId !== uid) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await postRef.delete();

    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ 
      error: 'Failed to delete post',
      details: error.message
    });
  }
});

module.exports = router;

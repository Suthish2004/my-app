const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { verifyToken } = require('../middleware/auth');
const { db } = require('../index');
const router = express.Router();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate a 7-day content calendar using Gemini AI
 */
router.post('/generate-calendar', verifyToken, async (req, res) => {
  try {
    const { businessIdea } = req.body;
    const uid = req.uid;

    if (!businessIdea) {
      return res.status(400).json({ error: 'Business idea is required' });
    }

    // Create prompt for Gemini
    const prompt = `You are a social media marketing expert. Create a 7-day content calendar for the following business idea: "${businessIdea}"

Generate EXACTLY 7 social media posts (one for each day). For each post, provide:
- day: Day number (1-7)
- idea: A brief one-line content idea
- caption: An engaging caption (2-3 sentences, conversational tone)
- hashtags: Array of 5-8 relevant hashtags (including the #)

Return ONLY valid JSON in this exact format, no additional text:
{
  "posts": [
    {
      "day": 1,
      "idea": "content idea here",
      "caption": "engaging caption here",
      "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"]
    }
  ]
}`;

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean the response - remove markdown code blocks if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Parse JSON
    let contentData;
    try {
      contentData = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Raw response:', text);
      return res.status(500).json({ 
        error: 'Failed to parse AI response',
        details: 'The AI returned invalid JSON format'
      });
    }

    if (!contentData.posts || !Array.isArray(contentData.posts)) {
      return res.status(500).json({ 
        error: 'Invalid response format',
        details: 'Expected posts array in response'
      });
    }

    // Save posts to Firestore
    const batch = db.batch();
    const savedPosts = [];

    for (const post of contentData.posts) {
      const postRef = db.collection('posts').doc();
      const postData = {
        userId: uid,
        day: post.day,
        idea: post.idea,
        caption: post.caption,
        hashtags: post.hashtags || [],
        status: 'draft',
        imageUrl: null,
        postDate: null,
        createdAt: new Date(),
      };
      
      batch.set(postRef, postData);
      savedPosts.push({ id: postRef.id, ...postData });
    }

    await batch.commit();

    res.json({
      success: true,
      message: `Generated ${savedPosts.length} posts`,
      posts: savedPosts,
    });
  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({ 
      error: 'Failed to generate content calendar',
      details: error.message
    });
  }
});

module.exports = router;

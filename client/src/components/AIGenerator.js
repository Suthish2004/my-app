import React, { useState } from 'react';
import api from '../api/axios';
import { Sparkles, Loader } from 'lucide-react';
import './AIGenerator.css';

const AIGenerator = ({ onComplete }) => {
  const [businessIdea, setBusinessIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!businessIdea.trim()) {
      setError('Please enter a business idea');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/gemini/generate-calendar', {
        businessIdea: businessIdea.trim(),
      });

      setSuccess(`Successfully generated ${response.data.posts.length} posts!`);
      setBusinessIdea('');
      
      // Wait a moment to show success message, then close
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 2000);
    } catch (err) {
      console.error('Generation error:', err);
      setError(err.response?.data?.error || 'Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-generator">
      <div className="generator-header">
        <Sparkles size={32} color="#667eea" />
        <h2>AI Content Generator</h2>
        <p>Describe your business and let AI create a 7-day content plan</p>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      <form onSubmit={handleGenerate} className="generator-form">
        <div className="form-group">
          <label className="form-label">Business Idea</label>
          <textarea
            className="form-textarea"
            value={businessIdea}
            onChange={(e) => setBusinessIdea(e.target.value)}
            placeholder="e.g., A new coffee shop in Chennai that specializes in organic, locally-sourced beans and offers a cozy workspace for freelancers..."
            rows="5"
            disabled={loading}
          />
          <p className="form-hint">
            Be specific! Include details about your target audience, unique selling points, and location.
          </p>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading || !businessIdea.trim()}
        >
          {loading ? (
            <>
              <Loader size={20} className="spinner-icon" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Generate Content Calendar
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AIGenerator;

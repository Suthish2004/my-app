import React, { useState } from 'react';
import api from '../api/axios';
import { X, Upload, Send, Trash2, Calendar, CheckCircle } from 'lucide-react';
import './PostModal.css';

const PostModal = ({ post, onClose }) => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(post.imageUrl || null);
  const [uploading, setUploading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [postStatus, setPostStatus] = useState(post.status);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size must be less than 10MB');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleUploadImage = async () => {
    if (!imageFile) {
      setError('Please select an image first');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update post with image URL
      await api.patch(`/post/${post.id}`, {
        imageUrl: response.data.imageUrl,
      });

      setImagePreview(response.data.imageUrl);
      setSuccess('Image uploaded successfully!');
      setImageFile(null);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handlePostNow = async () => {
    if (!imagePreview) {
      setError('Please upload an image before posting');
      return;
    }

    setPosting(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/post/now', {
        postId: post.id,
      });

      setSuccess('Post published successfully!');
      setPostStatus('posted');

      // Show success message then close
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Posting error:', err);
      setError(err.response?.data?.error || 'Failed to publish post');
    } finally {
      setPosting(false);
    }
  };

  const handleSchedule = async () => {
    try {
      await api.patch(`/post/${post.id}`, {
        status: 'scheduled',
        postDate: new Date(),
      });
      setSuccess('Post scheduled!');
      setPostStatus('scheduled');
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setError('Failed to schedule post');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await api.delete(`/post/${post.id}`);
      onClose();
    } catch (err) {
      setError('Failed to delete post');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Post Details - Day {post.day}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="post-info">
            <div className="info-row">
              <span className="info-label">Status:</span>
              <span className={`badge badge-${postStatus}`}>
                {postStatus.toUpperCase()}
              </span>
            </div>

            <div className="info-section">
              <h3>Content Idea</h3>
              <p>{post.idea}</p>
            </div>

            <div className="info-section">
              <h3>Caption</h3>
              <p className="caption-text">{post.caption}</p>
            </div>

            <div className="info-section">
              <h3>Hashtags</h3>
              <div className="hashtags">
                {post.hashtags && post.hashtags.map((tag, index) => (
                  <span key={index} className="hashtag">{tag}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="image-section">
            <h3>Post Image</h3>
            
            {imagePreview ? (
              <div className="image-preview">
                <img src={imagePreview} alt="Post preview" />
                {imageFile && (
                  <button 
                    className="btn btn-primary"
                    onClick={handleUploadImage}
                    disabled={uploading}
                  >
                    <Upload size={18} />
                    {uploading ? 'Uploading...' : 'Save Image'}
                  </button>
                )}
              </div>
            ) : (
              <div className="image-upload">
                <input
                  type="file"
                  id="image-input"
                  accept="image/*"
                  onChange={handleImageSelect}
                  style={{ display: 'none' }}
                />
                <label htmlFor="image-input" className="upload-label">
                  <Upload size={32} />
                  <p>Click to select an image</p>
                  <span>(Max 10MB)</span>
                </label>
              </div>
            )}

            {imagePreview && !imageFile && (
              <div className="change-image">
                <input
                  type="file"
                  id="change-image-input"
                  accept="image/*"
                  onChange={handleImageSelect}
                  style={{ display: 'none' }}
                />
                <label htmlFor="change-image-input" className="btn btn-secondary">
                  Change Image
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button 
            className="btn btn-danger"
            onClick={handleDelete}
          >
            <Trash2 size={18} />
            Delete
          </button>

          <div className="footer-actions">
            {postStatus === 'draft' && (
              <button 
                className="btn btn-secondary"
                onClick={handleSchedule}
                disabled={!imagePreview}
              >
                <Calendar size={18} />
                Schedule
              </button>
            )}

            {postStatus !== 'posted' && (
              <button 
                className="btn btn-success"
                onClick={handlePostNow}
                disabled={posting || !imagePreview}
              >
                {postStatus === 'posted' ? (
                  <>
                    <CheckCircle size={18} />
                    Posted
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    {posting ? 'Publishing...' : 'Post Now'}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;

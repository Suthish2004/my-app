import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import AIGenerator from '../components/AIGenerator';
import Calendar from '../components/Calendar';
import { Facebook, Instagram, AlertCircle, CheckCircle } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { currentUser, userProfile, refreshProfile } = useAuth();
  const [showGenerator, setShowGenerator] = useState(false);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user just connected Meta
    const params = new URLSearchParams(location.search);
    if (params.get('connected') === 'true') {
      setNotification({
        type: 'success',
        message: 'Successfully connected to Facebook/Instagram!',
      });
      refreshProfile();
      // Clear the query parameter
      navigate('/dashboard', { replace: true });
    }
  }, [location, navigate, refreshProfile]);

  const handleConnectMeta = () => {
    if (currentUser) {
      window.location.href = `http://localhost:5000/api/auth/meta/connect_start?uid=${currentUser.uid}`;
    }
  };

  return (
    <div className="dashboard">
      <Navbar />
      
      <div className="dashboard-container">
        {notification && (
          <div className={`alert alert-${notification.type}`}>
            {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            {notification.message}
          </div>
        )}

        {/* Connection Status Card */}
        {userProfile && !userProfile.isMetaConnected && (
          <div className="connection-card">
            <div className="connection-header">
              <AlertCircle size={48} color="#f59e0b" />
              <h2>Connect Your Social Media Accounts</h2>
              <p>Connect Facebook and Instagram to start posting AI-generated content</p>
            </div>
            <button className="btn btn-primary btn-large" onClick={handleConnectMeta}>
              <Facebook size={20} />
              Connect Facebook & Instagram
            </button>
            <div className="connection-info">
              <p><strong>Note:</strong> This app works in Developer Mode. Make sure you're added as a Tester in the Meta App Dashboard.</p>
            </div>
          </div>
        )}

        {userProfile && userProfile.isMetaConnected && (
          <div className="connected-status">
            <div className="status-badge">
              <CheckCircle size={20} color="#10b981" />
              <span>Connected Accounts:</span>
            </div>
            <div className="connected-accounts">
              <div className="account-item">
                <Facebook size={20} color="#1877f2" />
                <span>{userProfile.pageName || 'Facebook Page'}</span>
              </div>
              {userProfile.isInstagramConnected && (
                <div className="account-item">
                  <Instagram size={20} color="#e4405f" />
                  <span>Instagram Business</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* AI Generator Section */}
        {userProfile && userProfile.isMetaConnected && (
          <>
            <div className="generator-section">
              <button 
                className="btn btn-primary"
                onClick={() => setShowGenerator(!showGenerator)}
              >
                {showGenerator ? 'Hide Generator' : 'Generate Content Calendar'}
              </button>
            </div>

            {showGenerator && <AIGenerator onComplete={() => setShowGenerator(false)} />}

            {/* Calendar Section */}
            <div className="calendar-section">
              <h2>Content Calendar</h2>
              <Calendar />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

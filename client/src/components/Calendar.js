import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import PostModal from './PostModal';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    // Real-time listener for posts
    const q = query(
      collection(db, 'posts'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = [];
      snapshot.forEach((doc) => {
        postsData.push({ id: doc.id, ...doc.data() });
      });
      setPosts(postsData);

      // Convert posts to calendar events
      const calendarEvents = postsData.map((post, index) => {
        // Create dates for the next 7 days starting from today
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + (post.day - 1));
        startDate.setHours(10, 0, 0, 0); // Set to 10 AM

        return {
          id: post.id,
          title: post.idea || `Post ${post.day}`,
          start: startDate,
          end: startDate,
          resource: post,
        };
      });

      setEvents(calendarEvents);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleSelectEvent = (event) => {
    setSelectedPost(event.resource);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPost(null);
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = '#667eea';
    
    if (event.resource.status === 'posted') {
      backgroundColor = '#10b981';
    } else if (event.resource.status === 'scheduled') {
      backgroundColor = '#f59e0b';
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '6px',
        opacity: 0.9,
        color: 'white',
        border: 'none',
        display: 'block',
      },
    };
  };

  return (
    <div className="calendar-wrapper">
      {posts.length === 0 ? (
        <div className="empty-state">
          <p>No posts yet. Generate a content calendar to get started!</p>
        </div>
      ) : (
        <>
          <div className="calendar-legend">
            <div className="legend-item">
              <span className="legend-color" style={{ background: '#667eea' }}></span>
              <span>Draft</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ background: '#f59e0b' }}></span>
              <span>Scheduled</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ background: '#10b981' }}></span>
              <span>Posted</span>
            </div>
          </div>

          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
            views={['month', 'week', 'day']}
            defaultView="month"
          />
        </>
      )}

      {showModal && selectedPost && (
        <PostModal post={selectedPost} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Calendar;

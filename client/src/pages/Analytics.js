import React from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Navbar from '../components/Navbar';
import { TrendingUp, Users, Heart, Share2 } from 'lucide-react';
import './Analytics.css';

// Mock data for demonstration
const followerData = [
  { month: 'Jan', followers: 1200 },
  { month: 'Feb', followers: 1450 },
  { month: 'Mar', followers: 1890 },
  { month: 'Apr', followers: 2340 },
  { month: 'May', followers: 2890 },
  { month: 'Jun', followers: 3520 },
  { month: 'Jul', followers: 4200 },
];

const engagementData = [
  { day: 'Mon', likes: 245, comments: 45, shares: 23 },
  { day: 'Tue', likes: 312, comments: 67, shares: 34 },
  { day: 'Wed', likes: 289, comments: 54, shares: 28 },
  { day: 'Thu', likes: 398, comments: 89, shares: 45 },
  { day: 'Fri', likes: 456, comments: 102, shares: 56 },
  { day: 'Sat', likes: 521, comments: 134, shares: 67 },
  { day: 'Sun', likes: 478, comments: 98, shares: 52 },
];

const platformData = [
  { name: 'Facebook', value: 65 },
  { name: 'Instagram', value: 35 },
];

const COLORS = ['#1877f2', '#e4405f'];

const StatCard = ({ icon: Icon, title, value, change, color }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ background: color }}>
      <Icon size={24} color="white" />
    </div>
    <div className="stat-content">
      <p className="stat-title">{title}</p>
      <h3 className="stat-value">{value}</h3>
      <p className="stat-change">
        <TrendingUp size={16} /> {change} from last month
      </p>
    </div>
  </div>
);

const Analytics = () => {
  return (
    <div className="analytics">
      <Navbar />
      
      <div className="analytics-container">
        <div className="analytics-header">
          <h1>Analytics Dashboard</h1>
          <p>Track your social media performance (Demo Data)</p>
        </div>

        {/* Stats Overview */}
        <div className="stats-grid">
          <StatCard
            icon={Users}
            title="Total Followers"
            value="4,200"
            change="+19% increase"
            color="#667eea"
          />
          <StatCard
            icon={Heart}
            title="Total Likes"
            value="2,699"
            change="+12% increase"
            color="#f59e0b"
          />
          <StatCard
            icon={Share2}
            title="Total Shares"
            value="305"
            change="+8% increase"
            color="#10b981"
          />
          <StatCard
            icon={TrendingUp}
            title="Engagement Rate"
            value="4.8%"
            change="+0.5% increase"
            color="#ef4444"
          />
        </div>

        {/* Charts */}
        <div className="charts-grid">
          {/* Follower Growth */}
          <div className="chart-card">
            <h3>Follower Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={followerData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    background: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="followers" 
                  stroke="#667eea" 
                  strokeWidth={3}
                  dot={{ fill: '#667eea', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Platform Distribution */}
          <div className="chart-card">
            <h3>Platform Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Engagement Chart */}
        <div className="chart-card full-width">
          <h3>Weekly Engagement</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  background: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }} 
              />
              <Legend />
              <Bar dataKey="likes" fill="#667eea" radius={[8, 8, 0, 0]} />
              <Bar dataKey="comments" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              <Bar dataKey="shares" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

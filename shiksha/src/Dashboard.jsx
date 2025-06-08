import React, { useState } from 'react';
import './Dashboard.css';
import {
  Package,
  Users,
  DollarSign,
  Bell,
  Search,
  Plus,
  TrendingUp,
  ShoppingCart,
  AlertTriangle,
  FileText,
  BarChart3
} from 'lucide-react';

const Dashboard = ({ user, onLogout }) => {
  const [activeSection, setActiveSection] = useState('home');

  const stats = [
    { title: 'Today Sales', value: '$1,240', icon: DollarSign, color: 'green', change: '+12%' },
    { title: 'Total Medicines', value: '248', icon: Package, color: 'blue', change: '+3%' },
    { title: 'Customers', value: '45', icon: Users, color: 'purple', change: '+8%' },
    { title: 'Low Stock Items', value: '12', icon: AlertTriangle, color: 'orange', change: '-2%' }
  ];

  const renderStatsCard = (stat, index) => (
    <div key={index} className={`stats-card stats-card-${stat.color}`}>
      <div className="stats-card-header">
        <div className={`icon-bg icon-bg-${stat.color}`}>
          <stat.icon size={24} />
        </div>
        <span className={`stat-change ${stat.change.startsWith('+') ? 'positive' : 'negative'}`}>{stat.change}</span>
      </div>
      <div className="stats-card-body">
        <p className="stat-title">{stat.title}</p>
        <p className="stat-value">{stat.value}</p>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-title-group">
          <h1 className="dashboard-title">Medico Plus</h1>
          <div className="dashboard-subtitle">{user?.pharmacyName && `| ${user.pharmacyName}`}</div>
        </div>
        <div className="dashboard-user-controls">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search medicines, customers..." className="search-input" />
          </div>
          <div className="notifications">
            <Bell size={20} />
            <span className="notification-badge">3</span>
          </div>
          <div className="user-info">
            <div className="user-initial">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
            <div className="user-details">
              <div className="user-name">{user?.name || 'User'}</div>
              <div className="user-role">{user?.role || 'Pharmacist'}</div>
            </div>
            <button onClick={onLogout} className="logout-button">Logout</button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-welcome">
          <h2>Welcome back, {user?.name || 'Pharmacist'}!</h2>
          <p>Here's what's happening with your pharmacy today.</p>
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => renderStatsCard(stat, index))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
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
  BarChart3,
  Calendar,
  Clock,
  Settings,
  Home,
  Pill,
  Activity,
  ChevronRight,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const Dashboard = ({ user: propUser, onLogout }) => {
  const [activeSection, setActiveSection] = useState('home');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const user = propUser || {
    name: 'Sumison',
    role: 'Pharmacy Manager',
    pharmacyName: 'MediCare Plus'
  };

  const stats = [
    { 
      title: 'Today Sales', 
      value: '$2,485', 
      icon: DollarSign, 
      color: 'emerald', 
      change: '+18.2%',
      trend: 'up',
      subtitle: 'vs yesterday'
    },
    { 
      title: 'Total Medicines', 
      value: '1,248', 
      icon: Package, 
      color: 'blue', 
      change: '+5.1%',
      trend: 'up',
      subtitle: 'in stock'
    },
    { 
      title: 'Active Customers', 
      value: '346', 
      icon: Users, 
      color: 'purple', 
      change: '+12.5%',
      trend: 'up',
      subtitle: 'this month'
    },
    { 
      title: 'Low Stock Alert', 
      value: '23', 
      icon: AlertTriangle, 
      color: 'amber', 
      change: '-8.3%',
      trend: 'down',
      subtitle: 'items need reorder'
    }
  ];

  const recentActivities = [
    { type: 'sale', customer: 'John Doe', item: 'Paracetamol 500mg', amount: '$12.50', time: '2 min ago' },
    { type: 'stock', item: 'Amoxicillin received', quantity: '50 units', time: '15 min ago' },
    { type: 'alert', message: 'Low stock: Vitamin D3', time: '30 min ago' },
    { type: 'sale', customer: 'Sarah Wilson', item: 'Cough Syrup', amount: '$8.75', time: '45 min ago' }
  ];

  const quickActions = [
    { title: 'Add New Medicine', icon: Plus, color: 'action-blue' },
    { title: 'New Sale', icon: ShoppingCart, color: 'action-green' },
    { title: 'Generate Report', icon: FileText, color: 'action-purple' },
    { title: 'Manage Inventory', icon: Package, color: 'action-orange' }
  ];

  const topMedicines = [
    { name: 'Paracetamol 500mg', sales: 145, revenue: '$435.00' },
    { name: 'Amoxicillin 250mg', sales: 89, revenue: '$267.00' },
    { name: 'Vitamin D3', sales: 76, revenue: '$228.00' },
    { name: 'Omeprazole 20mg', sales: 65, revenue: '$195.00' }
  ];

  const navigationItems = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'medicines', label: 'Medicines', icon: Pill },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'sales', label: 'Sales', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: BarChart3 }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'sale':
        return <DollarSign className="activity-icon activity-icon-sale" />;
      case 'stock':
        return <Package className="activity-icon activity-icon-stock" />;
      case 'alert':
        return <AlertTriangle className="activity-icon activity-icon-alert" />;
      default:
        return <Activity className="activity-icon" />;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Enhanced Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            {/* Logo and Title */}
            <div className="logo-section">
              <div className="logo-icon">
                <Package className="logo-icon-svg" />
              </div>
              <div className="logo-text">
                <h1 className="dashboard-title">MEDICO</h1>
                <p className="pharmacy-name">{user.pharmacyName}</p>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="main-navigation">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`nav-item ${activeSection === item.id ? 'nav-item-active' : ''}`}
                >
                  <item.icon className="nav-icon" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Right Side Controls */}
          <div className="header-right">
            {/* Enhanced Search */}
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search medicines, customers..."
                className="search-input"
              />
            </div>

            {/* Time Display */}
            <div className="time-display">
              <Clock className="time-icon" />
              <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>

            {/* Notifications */}
            <div className="notifications">
              <button className="notification-button">
                <Bell className="notification-icon" />
                <span className="notification-badge">5</span>
              </button>
            </div>

            {/* User Profile */}
            <div className="user-profile">
              <div className="user-avatar">
                <span>{user.name.charAt(0)}</span>
              </div>
              <div className="user-info">
                <p className="user-name">{user.name}</p>
                <p className="user-role">{user.role}</p>
              </div>
              <button className="profile-chevron">
                <ChevronRight className="chevron-icon" />
              </button>
              {onLogout && (
                <button onClick={onLogout} className="logout-button">
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-card">
            <div className="welcome-background-decoration"></div>
            <div className="welcome-content">
              <h2 className="welcome-title">Welcome back, {user.name}! 🎓</h2>
              <p className="welcome-subtitle">Here's your pharmacy performance overview for today.</p>
              <div className="welcome-info">
                <div className="info-item">
                  <Calendar className="info-icon" />
                  <span>{currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="info-item">
                  <Activity className="info-icon" />
                  <span>System Status: All Good</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className={`stats-card stats-${stat.color}`}>
              <div className="stats-header">
                <div className={`stats-icon stats-icon-${stat.color}`}>
                  <stat.icon className="icon" />
                </div>
                <div className={`stats-change ${stat.trend === 'up' ? 'change-positive' : 'change-negative'}`}>
                  {stat.trend === 'up' ? <ArrowUp className="trend-icon" /> : <ArrowDown className="trend-icon" />}
                  <span>{stat.change}</span>
                </div>
              </div>
              <div className="stats-content">
                <p className="stats-value">{stat.value}</p>
                <p className="stats-title">{stat.title}</p>
                <p className="stats-subtitle">{stat.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <h3 className="section-title">Quick Actions</h3>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <button key={index} className="quick-action-card">
                <div className={`action-icon ${action.color}`}>
                  <action.icon className="icon" />
                </div>
                <p className="action-title">{action.title}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="content-grid">
          {/* Recent Activities */}
          <div className="activities-card">
            <div className="card-header">
              <h3 className="card-title">Recent Activities</h3>
            </div>
            <div className="card-content">
              {recentActivities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className={`activity-icon-container activity-${activity.type}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="activity-details">
                    <p className="activity-description">
                      {activity.customer ? `${activity.customer} - ${activity.item}` : 
                       activity.item || activity.message}
                    </p>
                    <p className="activity-time">{activity.time}</p>
                  </div>
                  {activity.amount && (
                    <span className="activity-amount">{activity.amount}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Top Medicines */}
          <div className="medicines-card">
            <div className="card-header">
              <h3 className="card-title">Top Medicines</h3>
            </div>
            <div className="card-content">
              {topMedicines.map((medicine, index) => (
                <div key={index} className="medicine-item">
                  <div className="medicine-rank">
                    <span>{index + 1}</span>
                  </div>
                  <div className="medicine-details">
                    <p className="medicine-name">{medicine.name}</p>
                    <p className="medicine-sales">{medicine.sales} units sold</p>
                  </div>
                  <span className="medicine-revenue">{medicine.revenue}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
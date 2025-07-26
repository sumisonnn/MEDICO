import React, { useState, useEffect } from "react";
import './UserDashboard.css';
import Logout from './components/Logout';

const sections = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'browse', label: 'Browse Medicines' },
  { key: 'cart', label: 'Cart' },
  { key: 'orders', label: 'Orders' },
  { key: 'profile', label: 'Profile' },
];

export default function UserDashboard() {
  const [active, setActive] = useState('dashboard');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="user-dashboard">
      <aside className="user-sidebar">
        <div className="user-logo">MEDICO</div>
        <nav>
          {sections.map(s => (
            <div
              key={s.key}
              className={"user-nav-link" + (active === s.key ? " active" : "")}
              onClick={() => setActive(s.key)}
            >
              {s.label}
            </div>
          ))}
        </nav>
      </aside>
      <div className="user-content-area">
        <header className="user-header">
          <div className="user-header-title">User Dashboard</div>
          <div className="user-header-profile">
            👤 User
            <Logout />
          </div>
        </header>
        <main className="user-main">
          {active === 'dashboard' && (
            <div className="user-section">
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                <span style={{ fontWeight: 600, color: '#2e7d32', fontSize: 18 }}>
                  {now.toLocaleDateString()} {now.toLocaleTimeString()}
                </span>
              </div>
              <h2>Welcome!</h2>
              <p>Quick links and stats will appear here.</p>
            </div>
          )}
          {active === 'browse' && <div className="user-section"><h2>Browse Medicines</h2><p>Search and browse medicines.</p></div>}
          {active === 'cart' && <div className="user-section"><h2>Your Cart</h2><p>View and manage your cart.</p></div>}
          {active === 'orders' && <div className="user-section"><h2>Your Orders</h2><p>Order history and status.</p></div>}
          {active === 'profile' && <div className="user-section"><h2>User Profile</h2><p>Profile management.</p></div>}
        </main>
      </div>
    </div>
  );
} 
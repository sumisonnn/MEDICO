import React, { useState, useEffect } from "react";
import './UserDashboard.css';
import Logout from './components/Logout';
import medicineService from './services/medicineService.js';

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
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load medicines from API
  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const data = await medicineService.getAllMedicines();
      setMedicines(data);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('userCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('userCart', JSON.stringify(cart));
  }, [cart]);

  // Filter medicines based on search and category
  const filteredMedicines = medicines.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         med.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || med.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter
  const categories = ['all', ...new Set(medicines.map(med => med.category))];

  const addToCart = (medicine) => {
    const existingItem = cart.find(item => item.id === medicine.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === medicine.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...medicine, quantity: 1 }]);
    }
  };

  const removeFromCart = (medicineId) => {
    setCart(cart.filter(item => item.id !== medicineId));
  };

  const updateCartQuantity = (medicineId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(medicineId);
    } else {
      setCart(cart.map(item => 
        item.id === medicineId 
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  };

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
          {active === 'browse' && (
            <div className="user-section">
              <h2>Browse Medicines</h2>
              <div style={{ marginBottom: 20 }}>
                <input
                  type="text"
                  placeholder="Search medicines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ 
                    padding: '8px 12px', 
                    marginRight: '10px', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px',
                    width: '200px'
                  }}
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{ 
                    padding: '8px 12px', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px'
                  }}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>
              {loading ? (
                <p style={{ textAlign: 'center', color: '#666' }}>Loading medicines...</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                  {filteredMedicines.map(medicine => (
                    <div key={medicine.id} style={{
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      padding: '16px',
                      backgroundColor: '#fff'
                    }}>
                      <h3 style={{ margin: '0 0 8px 0', color: '#2e7d32' }}>{medicine.name}</h3>
                      <p style={{ margin: '4px 0', color: '#666' }}>Category: {medicine.category}</p>
                      <p style={{ margin: '4px 0', fontWeight: 'bold' }}>Price: ${parseFloat(medicine.price).toFixed(2)}</p>
                      <p style={{ margin: '4px 0', color: medicine.stock < 10 ? '#d32f2f' : '#2e7d32' }}>
                        Stock: {medicine.stock} {medicine.stock < 10 && '(Low Stock)'}
                      </p>
                      <button
                        onClick={() => addToCart(medicine)}
                        disabled={medicine.stock === 0}
                        style={{
                          backgroundColor: '#2e7d32',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          cursor: medicine.stock > 0 ? 'pointer' : 'not-allowed',
                          opacity: medicine.stock > 0 ? 1 : 0.6
                        }}
                      >
                        {medicine.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {!loading && filteredMedicines.length === 0 && (
                <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>
                  No medicines found matching your search criteria.
                </p>
              )}
            </div>
          )}
          {active === 'cart' && (
            <div className="user-section">
              <h2>Your Cart</h2>
              {cart.length === 0 ? (
                <p>Your cart is empty.</p>
              ) : (
                <div>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #ddd' }}>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Medicine</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Price</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Quantity</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Total</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map(item => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '12px' }}>{item.name}</td>
                          <td style={{ padding: '12px' }}>${parseFloat(item.price).toFixed(2)}</td>
                          <td style={{ padding: '12px' }}>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateCartQuantity(item.id, parseInt(e.target.value))}
                              style={{ width: '60px', padding: '4px' }}
                            />
                          </td>
                          <td style={{ padding: '12px' }}>${(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
                          <td style={{ padding: '12px' }}>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              style={{
                                backgroundColor: '#d32f2f',
                                color: 'white',
                                border: 'none',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                cursor: 'pointer'
                              }}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{ marginTop: '20px', textAlign: 'right' }}>
                    <h3>Total: ${getTotalPrice().toFixed(2)}</h3>
                    <button
                      style={{
                        backgroundColor: '#2e7d32',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '16px'
                      }}
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {active === 'orders' && <div className="user-section"><h2>Your Orders</h2><p>Order history and status.</p></div>}
          {active === 'profile' && <div className="user-section"><h2>User Profile</h2><p>Profile management.</p></div>}
        </main>
      </div>
    </div>
  );
} 
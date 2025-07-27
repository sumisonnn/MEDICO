import React, { useState, useEffect } from "react";
import './UserDashboard.css';
import Logout from './components/Logout';
import medicineService from './services/medicineService.js';
import cartService from './services/cartService.js';
import logoIcon from './assets/logo.png';

const sections = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'browse', label: 'Browse Medicines' },
  { key: 'cart', label: 'Cart' },
  { key: 'checkout', label: 'Checkout' },
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
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

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

  // Load cart from backend
  const fetchCart = async () => {
    try {
      console.log('Fetching cart in UserDashboard...');
      const cartData = await cartService.getCart();
      console.log('Cart data received:', cartData);
      setCart(cartData.items || []);
      console.log('Cart state updated:', cartData.items || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart([]);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Filter medicines based on search and category
  const filteredMedicines = medicines.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         med.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || med.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter
  const categories = ['all', ...new Set(medicines.map(med => med.category))];

  const addToCart = async (medicine) => {
    try {
      await cartService.addToCart(medicine.id, 1);
      
      // Refresh cart from backend
      await fetchCart();
      
      // Switch to cart tab to show the added item
      setActive('cart');
      
      // Show popup notification
      setPopupMessage('Added to cart successfully!');
      setShowPopup(true);
      
      // Hide popup after 3 seconds
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setPopupMessage(error.response?.data?.error || 'Failed to add to cart');
      setShowPopup(true);
      
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    }
  };

  const removeFromCart = async (medicineId) => {
    try {
      await cartService.removeFromCart(medicineId);
      await fetchCart(); // Refresh cart from backend
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateCartQuantity = async (medicineId, quantity) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(medicineId);
      } else {
        await cartService.updateCartItem(medicineId, quantity);
        await fetchCart(); // Refresh cart from backend
      }
    } catch (error) {
      console.error('Error updating cart quantity:', error);
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  };

  return (
    <div className="user-dashboard">
      <aside className="user-sidebar">
        <div className="user-logo">
          <img src={logoIcon} alt="MEDICO Logo" className="user-logo-image" />
          <span>MEDICO</span>
        </div>
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
              <div className="search-filter-container">
                <input
                  type="text"
                  placeholder="Search medicines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="category-select"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>
              {loading ? (
                <div className="loading-state">Loading medicines...</div>
              ) : (
                <div className="medicine-grid">
                  {filteredMedicines.map(medicine => (
                    <div key={medicine.id} className="medicine-card">
                      {/* Medicine Image */}
                      <div>
                        {medicine.image ? (
                          <img 
                            src={`http://localhost:5000${medicine.image}`} 
                            alt={medicine.name}
                            className="medicine-image"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className="medicine-image-placeholder"
                          style={{ display: medicine.image ? 'none' : 'flex' }}
                        >
                          {medicine.image ? 'Loading...' : 'No Image'}
                        </div>
                      </div>
                      
                      <div className="medicine-content">
                        <h3 className="medicine-name">{medicine.name}</h3>
                        <p className="medicine-category">Category: {medicine.category}</p>
                        <p className="medicine-price">Rs {parseFloat(medicine.price).toFixed(2)}</p>
                        <p className={`medicine-stock ${medicine.stock === 0 ? 'out-of-stock' : medicine.stock < 10 ? 'low-stock' : 'in-stock'}`}>
                          Stock: {medicine.stock} {medicine.stock < 10 && medicine.stock > 0 && '(Low Stock)'}
                        </p>
                        <button
                          onClick={() => addToCart(medicine)}
                          disabled={medicine.stock === 0}
                          className="add-to-cart-btn"
                        >
                          {medicine.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {!loading && filteredMedicines.length === 0 && (
                <div className="empty-state">
                  <h3>No medicines found</h3>
                  <p>No medicines found matching your search criteria.</p>
                </div>
              )}
            </div>
          )}
          {active === 'cart' && (
            <div className="user-section">
              <h2>Your Cart</h2>
              {cart.length === 0 ? (
                <div className="empty-state">
                  <h3>Your cart is empty</h3>
                  <p>Add some medicines to get started.</p>
                </div>
              ) : (
                <div>
                  <table className="cart-table">
                    <thead>
                      <tr>
                        <th>Medicine</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map(item => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>Rs. {parseFloat(item.price).toFixed(2)}</td>
                          <td>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateCartQuantity(item.id, parseInt(e.target.value))}
                              className="quantity-input"
                            />
                          </td>
                          <td>Rs. {(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
                          <td>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="remove-btn"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                                      <div className="cart-total">
                      <h3>Total: Rs. {getTotalPrice().toFixed(2)}</h3>
                      <div className="cart-actions">
                        <button 
                          onClick={() => {
                            if (cart.length === 0) {
                              setPopupMessage('Your cart is empty!');
                              setShowPopup(true);
                              setTimeout(() => setShowPopup(false), 3000);
                              return;
                            }
                            setPopupMessage(`Order placed successfully! Total: Rs. ${getTotalPrice().toFixed(2)}. Your order is being processed.`);
                            setShowPopup(true);
                            setTimeout(() => setShowPopup(false), 3000);
                            // Clear cart after successful checkout
                            cartService.clearCart().then(() => {
                              fetchCart();
                            });
                          }}
                          className="checkout-btn"
                          disabled={cart.length === 0}
                        >
                          Checkout
                        </button>
                        <button 
                          onClick={() => {
                            cartService.clearCart().then(() => {
                              fetchCart();
                            });
                          }}
                          className="clear-cart-btn"
                        >
                          Clear Cart
                        </button>
                      </div>
                    </div>
                </div>
              )}
            </div>
          )}
          {active === 'checkout' && (
            <div className="user-section">
              <h2>Checkout</h2>
              {cart.length === 0 ? (
                <div className="empty-state">
                  <h3>Your cart is empty</h3>
                  <p>Add some medicines to your cart before checkout.</p>
                  <button 
                    onClick={() => setActive('browse')}
                    className="browse-btn"
                  >
                    Browse Medicines
                  </button>
                </div>
              ) : (
                <div className="checkout-container">
                  <div className="order-summary">
                    <h3>Order Summary</h3>
                    <div className="order-items">
                      {cart.map(item => (
                        <div key={item.id} className="order-item">
                          <div className="item-info">
                            <h4>{item.name}</h4>
                            <p>Category: {item.category}</p>
                            <p>Quantity: {item.quantity}</p>
                            <p>Price: Rs. {parseFloat(item.price).toFixed(2)} each</p>
                          </div>
                          <div className="item-total">
                            <h4>Rs. {(parseFloat(item.price) * item.quantity).toFixed(2)}</h4>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="order-total">
                      <h3>Total: Rs. {getTotalPrice().toFixed(2)}</h3>
                    </div>
                  </div>
                  
                  <div className="shipping-form">
                    <h3>Shipping Information</h3>
                    <form className="checkout-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="firstName">First Name</label>
                          <input type="text" id="firstName" required />
                        </div>
                        <div className="form-group">
                          <label htmlFor="lastName">Last Name</label>
                          <input type="text" id="lastName" required />
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" required />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input type="tel" id="phone" required />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="address">Delivery Address</label>
                        <textarea id="address" rows="3" required></textarea>
                      </div>
                      
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="city">City</label>
                          <input type="text" id="city" required />
                        </div>
                        <div className="form-group">
                          <label htmlFor="postalCode">Postal Code</label>
                          <input type="text" id="postalCode" required />
                        </div>
                      </div>
                    </form>
                  </div>
                  
                  <div className="payment-section">
                    <h3>Payment Method</h3>
                    <div className="payment-options">
                      <label className="payment-option">
                        <input type="radio" name="payment" value="cod" defaultChecked />
                        <span>Cash on Delivery</span>
                      </label>
                      <label className="payment-option">
                        <input type="radio" name="payment" value="card" />
                        <span>Credit/Debit Card</span>
                      </label>
                      <label className="payment-option">
                        <input type="radio" name="payment" value="upi" />
                        <span>UPI Payment</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="checkout-actions">
                    <button 
                      onClick={() => {
                        setPopupMessage(`Order placed successfully! Total: Rs. ${getTotalPrice().toFixed(2)}. Your order is being processed.`);
                        setShowPopup(true);
                        setTimeout(() => setShowPopup(false), 3000);
                        // Clear cart after successful checkout
                        cartService.clearCart().then(() => {
                          fetchCart();
                          setActive('dashboard');
                        });
                      }}
                      className="place-order-btn"
                    >
                      Place Order
                    </button>
                    <button 
                      onClick={() => setActive('cart')}
                      className="back-to-cart-btn"
                    >
                      Back to Cart
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
      
      {/* Popup Notification */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-notification">
            <div className="popup-icon">✓</div>
            <div className="popup-message">{popupMessage}</div>
          </div>
        </div>
      )}
    </div>
  );
} 
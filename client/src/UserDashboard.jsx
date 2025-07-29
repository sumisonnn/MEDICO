import React, { useState, useEffect } from "react";
import './UserDashboard.css';
import Logout from './components/Logout';
import medicineService from './services/medicineService.js';
import cartService from './services/cartService.js';
import orderService from './services/orderService.js';
import logoIcon from './assets/logo.png';

const sections = [
  { key: 'dashboard', label: 'Home' },
  { key: 'cart', label: 'Cart' },
  { key: 'checkout', label: 'Checkout' },
  { key: 'orders', label: 'Orders' },
  { key: 'profile', label: 'Profile' },
];

export default function UserDashboard() {
  const [active, setActive] = useState('dashboard');
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [checkoutForm, setCheckoutForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });

  // Profile state
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    phone: ''
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    username: '',
    email: '',
    phone: ''
  });

  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);

  const showSlide = (index) => {
    setCurrentSlide(index);
  };

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
    const initializeDashboard = async () => {
      setDashboardLoading(true);
      try {
        await Promise.all([
          fetchCart(),
          fetchOrders(),
          fetchProfile()
        ]);
      } catch (error) {
        console.error('Error initializing dashboard:', error);
      } finally {
        setDashboardLoading(false);
    }
    };
    
    initializeDashboard();
  }, []);

  // Fetch orders when orders tab is activated
  useEffect(() => {
    if (active === 'orders') {
      fetchOrders();
    }
  }, [active]);

  // Fetch profile when profile tab is activated
  useEffect(() => {
    if (active === 'profile') {
      fetchProfile();
    }
  }, [active]);

  // Load orders from API
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await orderService.getUserOrders();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

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
      alert('Added to cart successfully!');
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(error.response?.data?.error || 'Failed to add to cart');
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

  const handleCheckoutFormChange = (e) => {
    setCheckoutForm({
      ...checkoutForm,
      [e.target.name]: e.target.value
    });
  };

  // Profile functions
  const fetchProfile = async () => {
    try {
      // Get user info from localStorage or API
      const userInfo = JSON.parse(localStorage.getItem('user'));
      if (userInfo) {
        setProfile({
          username: userInfo.username || '',
          email: userInfo.email || '',
          phone: userInfo.phone || ''
        });
        setProfileForm({
          username: userInfo.username || '',
          email: userInfo.email || '',
          phone: userInfo.phone || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleProfileFormChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value
    });
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async () => {
    try {
      // Update profile logic here
      setProfile(profileForm);
      setIsEditingProfile(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleCancelEdit = () => {
    setProfileForm({
      username: profile.username,
      email: profile.email,
      phone: profile.phone
    });
    setIsEditingProfile(false);
  };

  const handlePlaceOrder = async () => {
    try {
      // Validate form
      if (!checkoutForm.firstName || !checkoutForm.lastName || !checkoutForm.email || 
          !checkoutForm.phone || !checkoutForm.address || !checkoutForm.city || !checkoutForm.postalCode) {
        alert('Please fill in all delivery information');
        return;
      }

      // Create order data
      const orderData = {
        deliveryAddress: `${checkoutForm.firstName} ${checkoutForm.lastName}\n${checkoutForm.address}\n${checkoutForm.city}, ${checkoutForm.postalCode}`,
        deliveryPhone: checkoutForm.phone,
        deliveryEmail: checkoutForm.email
      };

      // Create order
      await orderService.createOrder(orderData);
      
      // Clear cart
      await cartService.clearCart();
      
      // Refresh cart, orders, and medicines
      await fetchCart();
      await fetchOrders();
      await fetchMedicines();
      
      // Reset form
      setCheckoutForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: ''
      });
      
      // Show success message
      alert(`Order placed successfully! Total: Rs. ${getTotalPrice().toFixed(2)}`);
      
      // Reset checkout state and go to orders
      setShowCheckout(false);
      setActive('orders');
      
    } catch (error) {
      console.error('Error placing order:', error);
      alert(error.response?.data?.error || 'Failed to place order');
    }
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
          <div className="user-header-title">
            Welcome, {profile.username || 'User'}
          </div>
          <div className="user-header-profile">
            👤 {profile.username || 'User'}
            <Logout />
          </div>
        </header>
        <main className="user-main">
          {active === 'dashboard' && (
            <div className="user-section">
              <div className="home-container">
                {/* New Banner Image */}
                <div className="dashboard-banner">
                  <img 
                    src="/src/assets/medicine.png" 
                    alt="Healthcare Banner" 
                    className="dashboard-banner-image"
                  />
                </div>
                
                {/* Browse Medicines Section */}
                <div className="browse-medicines-home">
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
              </div>
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
                              alert('Your cart is empty!');
                              return;
                            }
                            setShowCheckout(true);
                            setActive('checkout');
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
                </div>
              ) : (
                <div className="simple-checkout">
                  <div className="order-summary-simple">
                    <h3>Order Summary</h3>
                    <div className="cart-items-simple">
                      {cart.map(item => (
                        <div key={item.id} className="cart-item-simple">
                          <div className="item-details-simple">
                            <h4>{item.name}</h4>
                            <p>Qty: {item.quantity} × Rs. {parseFloat(item.price).toFixed(2)}</p>
                          </div>
                          <div className="item-total-simple">
                            Rs. {(parseFloat(item.price) * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="total-simple">
                      <strong>Total: Rs. {getTotalPrice().toFixed(2)}</strong>
                    </div>
                  </div>
                  
                  <div className="checkout-form-simple">
                    <h3>Delivery Information</h3>
                    <form>
                      <div className="form-row-simple">
                        <input 
                          type="text" 
                          name="firstName"
                          placeholder="First Name" 
                          value={checkoutForm.firstName}
                          onChange={handleCheckoutFormChange}
                          required 
                        />
                        <input 
                          type="text" 
                          name="lastName"
                          placeholder="Last Name" 
                          value={checkoutForm.lastName}
                          onChange={handleCheckoutFormChange}
                          required 
                        />
                      </div>
                      <input 
                        type="email" 
                        name="email"
                        placeholder="Email" 
                        value={checkoutForm.email}
                        onChange={handleCheckoutFormChange}
                        required 
                      />
                      <input 
                        type="tel" 
                        name="phone"
                        placeholder="Phone Number" 
                        value={checkoutForm.phone}
                        onChange={handleCheckoutFormChange}
                        required 
                      />
                      <textarea 
                        name="address"
                        placeholder="Delivery Address" 
                        rows="3" 
                        value={checkoutForm.address}
                        onChange={handleCheckoutFormChange}
                        required
                      ></textarea>
                      <div className="form-row-simple">
                        <input 
                          type="text" 
                          name="city"
                          placeholder="City" 
                          value={checkoutForm.city}
                          onChange={handleCheckoutFormChange}
                          required 
                        />
                        <input 
                          type="text" 
                          name="postalCode"
                          placeholder="Postal Code" 
                          value={checkoutForm.postalCode}
                          onChange={handleCheckoutFormChange}
                          required 
                        />
                      </div>
                    </form>
                    
                    <div className="payment-simple">
                      <h3>Payment Method</h3>
                      <div className="payment-options-simple">
                        <label>
                          <input type="radio" name="payment" value="cod" defaultChecked />
                          Cash on Delivery
                        </label>
                      </div>
                    </div>
                    
                    <div className="checkout-actions-simple">
                      <button 
                        onClick={handlePlaceOrder}
                        className="place-order-btn-simple"
                      >
                        Place Order
                      </button>
                      <button 
                        onClick={() => {
                          setShowCheckout(false);
                          setActive('cart');
                        }}
                        className="back-btn-simple"
                      >
                        Back to Cart
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {active === 'orders' && (
            <div className="user-section">
              <h2>Your Orders</h2>
              {loadingOrders ? (
                <div className="loading-state">
                  <p>Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="empty-state">
                  <h3>No orders yet</h3>
                  <p>You haven't placed any orders yet. Start shopping to see your order history here.</p>
                  <button onClick={() => setActive('browse')} className="browse-btn">
                    Browse Medicines
                  </button>
                </div>
              ) : (
                <div className="orders-container">
                  {orders.map(order => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <div className="order-info">
                          <h3>Order #{order.orderNumber}</h3>
                          <p className="order-date">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <span className={`order-status order-status-${order.status}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <div className="order-total">
                          <strong>Rs. {parseFloat(order.totalAmount).toFixed(2)}</strong>
                        </div>
                      </div>
                      
                      <div className="order-items">
                        {order.OrderItems && order.OrderItems.map(item => (
                          <div key={item.id} className="order-item">
                            <div className="item-info">
                              <h4>{item.Medicine ? item.Medicine.name : 'Unknown Medicine'}</h4>
                              <p>Qty: {item.quantity} × Rs. {parseFloat(item.price).toFixed(2)}</p>
                            </div>
                            <div className="item-total">
                              Rs. {(parseFloat(item.price) * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="order-delivery">
                        <h4>Delivery Information</h4>
                        <p><strong>Address:</strong> {order.deliveryAddress}</p>
                        <p><strong>Phone:</strong> {order.deliveryPhone}</p>
                        <p><strong>Email:</strong> {order.deliveryEmail}</p>
                        <p><strong>Payment:</strong> {order.paymentMethod}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {active === 'profile' && (
            <div className="user-section">
              <div className="profile-container simple-profile">
                <div className="profile-header">
                  <h2>User Profile</h2>
                </div>
                <div className="profile-form">
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    {isEditingProfile ? (
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={profileForm.username}
                        onChange={handleProfileFormChange}
                        className="form-input"
                        placeholder="Enter username"
                      />
                    ) : (
                      <div className="profile-value">{profile.username || ''}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    {isEditingProfile ? (
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={profileForm.email}
                        onChange={handleProfileFormChange}
                        className="form-input"
                        placeholder="Enter email"
                      />
                    ) : (
                      <div className="profile-value">{profile.email || ''}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    {isEditingProfile ? (
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={profileForm.phone}
                        onChange={handleProfileFormChange}
                        className="form-input"
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <div className="profile-value">{profile.phone || ''}</div>
                    )}
                  </div>
                  <div className="profile-actions">
                    {isEditingProfile ? (
                      <>
                        <button 
                          onClick={handleSaveProfile}
                          className="profile-btn primary"
                        >
                          Save
                        </button>
                        <button 
                          onClick={handleCancelEdit}
                          className="profile-btn secondary"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={handleEditProfile}
                        className="profile-btn primary"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      
      {/* Popup Notification */}
      {/* Removed popup notification */}
    </div>
  );
} 
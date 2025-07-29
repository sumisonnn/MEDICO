import React, { useState, useEffect } from "react";
import './AdminDashboard.css';
import Logout from './components/Logout';
import medicineService from './services/medicineService.js';
import orderService from './services/orderService.js';
import logoIcon from './assets/MEDICOOO.jpg';
import whyImage from './assets/why.png';
import ok2Image from './assets/ok2.jpg';
import bannerImage from './assets/banner.jpg';

const sections = [
  { key: 'manage-medicine', label: 'Manage Medicine' },
  { key: 'sales-history', label: 'Sales History' },
];

export default function AdminDashboard() {
  const [active, setActive] = useState('manage-medicine');
  const [medicines, setMedicines] = useState([]);
  const [form, setForm] = useState({ name: '', category: '', price: '', stock: '' });
  const [selectedImage, setSelectedImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Carousel functions
  const showSlide = (index) => {
    setCurrentSlide(index);
  };

  // Load medicines from API
  const fetchMedicines = async () => {
    try {
      const data = await medicineService.getAllMedicines();
      setMedicines(data);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  // Load all orders from API
  const fetchAllOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await orderService.getAllOrders();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch orders when sales history tab is activated
  useEffect(() => {
    if (active === 'sales-history') {
      fetchAllOrders();
    }
  }, [active]);

  // Live stats
  const totalMedicines = medicines.length;
  const totalStock = medicines.reduce((sum, m) => sum + Number(m.stock), 0);
  const lowStockCount = medicines.filter(m => Number(m.stock) < 10).length;

  // CRUD Handlers
  const handleFormChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const clearForm = () => {
    setForm({ name: '', category: '', price: '', stock: '' });
    setSelectedImage(null);
    setEditingId(null);
  };

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    if (!form.name || !form.category || !form.price || !form.stock) return;
    
    setLoading(true);
    try {
      const medicineData = {
        ...form,
        image: selectedImage
      };
      
      // Debug: Log what we're sending
      console.log('Sending medicine data:', medicineData);
      
      await medicineService.createMedicine(medicineData);
      await fetchMedicines(); // Refresh the list
      clearForm();
    } catch (error) {
      alert(error.message || 'Failed to add medicine');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = med => {
    setEditingId(med.id);
    setForm({ name: med.name, category: med.category, price: med.price, stock: med.stock });
  };

  const handleUpdateMedicine = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const medicineData = {
        ...form,
        image: selectedImage
      };
      
      await medicineService.updateMedicine(editingId, medicineData);
      await fetchMedicines(); // Refresh the list
      clearForm();
    } catch (error) {
      alert(error.message || 'Failed to update medicine');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleteConfirmId(id);
  };
  const confirmDelete = async () => {
    try {
      await medicineService.deleteMedicine(deleteConfirmId);
      await fetchMedicines(); // Refresh the list
      setShowDeletePopup(true);
      setTimeout(() => setShowDeletePopup(false), 1500);
    } catch (error) {
      alert(error.message || 'Failed to delete medicine');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <img src={logoIcon} alt="MEDICO Logo" className="admin-logo-image" />
          <span>MEDICO</span>
        </div>
        <nav>
          {sections.map(s => (
            <div
              key={s.key}
              className={"admin-nav-link" + (active === s.key ? " active" : "")}
              onClick={() => { setActive(s.key); clearForm(); }}
            >
              {s.label}
            </div>
          ))}
        </nav>
      </aside>
      <div className="admin-content-area">
        <header className="admin-header">
          <div className="admin-header-title">Admin Dashboard</div>
          <div className="admin-header-profile">
            👤 Admin
            <Logout />
          </div>
        </header>
        <main className="admin-main">
          {active === 'manage-medicine' && (
            <div className="admin-section">
              <h2>Manage Medicine</h2>
              <table className="medicine-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {medicines.map(med => (
                    <tr key={med.id}>
                      <td>
                        {med.image ? (
                          <img 
                            src={`http://localhost:5000${med.image}`} 
                            alt={med.name}
                            style={{ 
                              width: '50px', 
                              height: '50px', 
                              objectFit: 'cover',
                              borderRadius: '4px'
                            }} 
                          />
                        ) : (
                          <div style={{ 
                            width: '50px', 
                            height: '50px', 
                            backgroundColor: '#f0f0f0',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#999'
                          }}>
                            No img
                          </div>
                        )}
                      </td>
                      <td>{med.name}</td>
                      <td>{med.category}</td>
                      <td>${parseFloat(med.price).toFixed(2)}</td>
                      <td>{med.stock}</td>
                      <td>
                        <button className="action-btn edit" onClick={() => handleEdit(med)} style={{ marginRight: 4 }}>
                          Edit
                        </button>
                        <button className="action-btn delete" onClick={() => handleDelete(med.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <button onClick={() => { clearForm(); setShowAddForm(true); }} style={{ padding: '8px 20px', fontSize: '1rem' }}>
                  Add Medicine
                </button>
              </div>
            </div>
          )}
          {active === 'sales-history' && (
            <div className="admin-section">
              <h2>Sales History</h2>
              {loadingOrders ? (
                <div className="loading-state">
                  <p>Loading sales history...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="empty-state">
                  <h3>No orders yet</h3>
                  <p>No sales have been recorded yet.</p>
                </div>
              ) : (
                <div className="sales-container">
                  <div className="orders-list">
                    {orders.map(order => (
                      <div key={order.id} className="order-card-admin">
                        <div className="order-header-admin">
                          <div className="order-info-admin">
                            <h3>Order #{order.orderNumber}</h3>
                            <p className="order-date-admin">
                              {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                            <p className="customer-info">
                              Customer: {order.User ? order.User.email : 'Unknown'}
                            </p>
                            <span className={`order-status-admin order-status-${order.status}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                          <div className="order-total-admin">
                            <strong>Rs. {parseFloat(order.totalAmount).toFixed(2)}</strong>
                          </div>
                        </div>
                        
                        <div className="order-items-admin">
                          {order.OrderItems && order.OrderItems.map(item => (
                            <div key={item.id} className="order-item-admin">
                              <div className="item-info-admin">
                                <h4>{item.Medicine ? item.Medicine.name : 'Unknown Medicine'}</h4>
                                <p>Qty: {item.quantity} × Rs. {parseFloat(item.price).toFixed(2)}</p>
                              </div>
                              <div className="item-total-admin">
                                Rs. {(parseFloat(item.price) * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="order-delivery-admin">
                          <h4>Delivery Information</h4>
                          <p><strong>Address:</strong> {order.deliveryAddress}</p>
                          <p><strong>Phone:</strong> {order.deliveryPhone}</p>
                          <p><strong>Email:</strong> {order.deliveryEmail}</p>
                          <p><strong>Payment:</strong> {order.paymentMethod}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
        <footer className="admin-footer">
          &copy; {new Date().getFullYear()} MEDICO Admin. All rights reserved.
        </footer>
      </div>
      {(showAddForm || editingId) && (
        <div className="modal-overlay" onClick={() => { clearForm(); setShowAddForm(false); }}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              {editingId ? 'Edit Medicine' : 'Add Medicine'}
              <button className="modal-close-btn" onClick={() => { clearForm(); setShowAddForm(false); }} title="Close">&times;</button>
            </div>
            <form className="medicine-form" onSubmit={editingId ? handleUpdateMedicine : handleAddMedicine}>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '12px 16px', alignItems: 'center', maxWidth: 400 }}>
                <label htmlFor="med-name">Name</label>
                <input id="med-name" name="name" value={form.name} onChange={handleFormChange} required />
                <label htmlFor="med-category">Category</label>
                <input id="med-category" name="category" value={form.category} onChange={handleFormChange} required />
                <label htmlFor="med-price">Price</label>
                <input id="med-price" name="price" value={form.price} onChange={handleFormChange} type="number" min="0" step="0.01" required />
                <label htmlFor="med-stock">Stock</label>
                <input id="med-stock" name="stock" value={form.stock} onChange={handleFormChange} type="number" min="0" required />
              </div>
              <div style={{ marginTop: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Medicine Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ marginBottom: '8px' }}
                />
              </div>
              <div style={{ marginTop: '16px' }}>
                <button type="submit" disabled={loading}>
                  {loading ? 'Processing...' : (editingId ? 'Update' : 'Add')}
                </button>
                <button type="button" onClick={() => { clearForm(); setShowAddForm(false); }} style={{ marginLeft: '8px' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showDeletePopup && (
        <div className="modal-overlay" style={{ zIndex: 10000 }}>
          <div className="modal-content" style={{ minWidth: 260, textAlign: 'center', padding: '32px 24px' }}>
            <div className="modal-header" style={{ justifyContent: 'center', marginBottom: 0 }}>
              <span style={{ color: '#e53e3e', fontWeight: 700, fontSize: '1.2rem' }}>Medicine deleted!</span>
              <button className="modal-close-btn" onClick={() => setShowDeletePopup(false)} title="Close">&times;</button>
            </div>
          </div>
        </div>
      )}
      {deleteConfirmId && (
        <div className="modal-overlay" style={{ zIndex: 10000 }}>
          <div className="delete-modal-content" onClick={e => e.stopPropagation()}>
            <div className="delete-modal-header">
              Are you sure you want to delete this medicine?
              <button className="modal-close-btn" onClick={() => setDeleteConfirmId(null)} title="Close">&times;</button>
            </div>
            <div className="delete-modal-actions">
              <button className="delete-modal-btn cancel" onClick={() => setDeleteConfirmId(null)}>Cancel</button>
              <button className="delete-modal-btn delete" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
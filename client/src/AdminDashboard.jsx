import React, { useState, useEffect } from "react";
import './AdminDashboard.css';
import Logout from './components/Logout';
import medicineService from './services/medicineService.js';
import logoIcon from './assets/MEDICOOO.jpg';

const sections = [
  { key: 'home', label: 'Home' },
  { key: 'manage-medicine', label: 'Manage Medicine' },
  { key: 'sales-history', label: 'Sales History' },
];

export default function AdminDashboard() {
  const [active, setActive] = useState('home');
  const [medicines, setMedicines] = useState([]);
  const [form, setForm] = useState({ name: '', category: '', price: '', stock: '' });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

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
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearForm = () => {
    setForm({ name: '', category: '', price: '', stock: '' });
    setSelectedImage(null);
    setImagePreview(null);
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
    setImagePreview(med.image ? `http://localhost:5000${med.image}` : null);
    setSelectedImage(null);
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
    if (!window.confirm('Are you sure you want to delete this medicine?')) return;
    
    try {
      await medicineService.deleteMedicine(id);
      await fetchMedicines(); // Refresh the list
    } catch (error) {
      alert(error.message || 'Failed to delete medicine');
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
          {active === 'home' && (
            <div className="admin-section">
              <div className="admin-stats-row">
                <div className="admin-stat-card">
                  <div className="admin-stat-label">Total Medicines</div>
                  <div className="admin-stat-value">{totalMedicines}</div>
                </div>
                <div className="admin-stat-card">
                  <div className="admin-stat-label">Total Stock</div>
                  <div className="admin-stat-value">{totalStock}</div>
                </div>
                <div className="admin-stat-card">
                  <div className="admin-stat-label">Low Stock (&lt; 10)</div>
                  <div className="admin-stat-value" style={{ color: lowStockCount > 0 ? '#d32f2f' : '#2e7d32' }}>{lowStockCount}</div>
                </div>
              </div>
              <h2>Welcome, Admin!</h2>
              <p>Overview and stats will appear here.</p>
            </div>
          )}
          {active === 'manage-medicine' && (
            <div className="admin-section">
              <h2>Manage Medicine</h2>
              <form className="medicine-form" onSubmit={editingId ? handleUpdateMedicine : handleAddMedicine} style={{ marginBottom: 24 }}>
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
                
                {/* Image Upload Section */}
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
                  {imagePreview && (
                    <div style={{ marginTop: '8px' }}>
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        style={{ 
                          maxWidth: '200px', 
                          maxHeight: '200px', 
                          border: '1px solid #ddd',
                          borderRadius: '4px'
                        }} 
                      />
                    </div>
                  )}
                </div>
                
                <div style={{ marginTop: '16px' }}>
                  <button type="submit" disabled={loading}>
                    {loading ? 'Processing...' : (editingId ? 'Update' : 'Add')}
                  </button>
                  {editingId && (
                    <button type="button" onClick={clearForm} style={{ marginLeft: '8px' }}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
              
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
                        <button onClick={() => handleEdit(med)}>Edit</button>
                        <button onClick={() => handleDelete(med.id)} className="delete-btn">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {active === 'sales-history' && (
            <div className="admin-section">
              <h2>Sales History</h2>
              <p>View and manage sales records and analytics.</p>
              <div style={{ marginTop: 20 }}>
                <h3>Recent Sales</h3>
                <p>Sales data and reports will be displayed here.</p>
              </div>
            </div>
          )}
        </main>
        <footer className="admin-footer">
          &copy; {new Date().getFullYear()} MEDICO Admin. All rights reserved.
        </footer>
      </div>
    </div>
  );
} 
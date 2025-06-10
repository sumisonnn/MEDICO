import React, { useState, useEffect } from "react";
import './AdminDashboard.css';

const sections = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'medicines', label: 'Medicines' },
  { key: 'users', label: 'Users' },
  { key: 'inventory', label: 'Inventory' },
  { key: 'sales', label: 'Sales Reports' },
  { key: 'profile', label: 'Profile' },
];

const initialMedicines = [
  { id: 1, name: 'Paracetamol', category: 'Pain Relief', price: 2.5, stock: 100, expiry: '2025-12-31' },
  { id: 2, name: 'Amoxicillin', category: 'Antibiotic', price: 5.0, stock: 50, expiry: '2024-10-15' },
  { id: 3, name: 'Cetirizine', category: 'Allergy', price: 1.5, stock: 8, expiry: '2024-08-01' },
];

export default function AdminDashboard() {
  const [active, setActive] = useState('dashboard');
  const [medicines, setMedicines] = useState(initialMedicines);
  const [form, setForm] = useState({ name: '', category: '', price: '', stock: '', expiry: '' });
  const [editingId, setEditingId] = useState(null);

  // Live stats
  const totalMedicines = medicines.length;
  const totalStock = medicines.reduce((sum, m) => sum + Number(m.stock), 0);
  const lowStockCount = medicines.filter(m => Number(m.stock) < 10).length;

  // CRUD Handlers
  const handleFormChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleAddMedicine = e => {
    e.preventDefault();
    if (!form.name || !form.category || !form.price || !form.stock || !form.expiry) return;
    setMedicines(meds => [
      ...meds,
      { ...form, id: Date.now(), price: parseFloat(form.price), stock: parseInt(form.stock) }
    ]);
    setForm({ name: '', category: '', price: '', stock: '', expiry: '' });
  };

  const handleEdit = med => {
    setEditingId(med.id);
    setForm({ name: med.name, category: med.category, price: med.price, stock: med.stock, expiry: med.expiry });
  };

  const handleUpdateMedicine = e => {
    e.preventDefault();
    setMedicines(meds => meds.map(m => m.id === editingId ? { ...m, ...form, price: parseFloat(form.price), stock: parseInt(form.stock) } : m));
    setEditingId(null);
    setForm({ name: '', category: '', price: '', stock: '', expiry: '' });
  };

  const handleDelete = id => {
    setMedicines(meds => meds.filter(m => m.id !== id));
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-logo">MEDICO Admin</div>
        <nav>
          {sections.map(s => (
            <div
              key={s.key}
              className={"admin-nav-link" + (active === s.key ? " active" : "")}
              onClick={() => { setActive(s.key); setEditingId(null); setForm({ name: '', category: '', price: '', stock: '', expiry: '' }); }}
            >
              {s.label}
            </div>
          ))}
        </nav>
      </aside>
      <div className="admin-content-area">
        <header className="admin-header">
          <div className="admin-header-title">Admin Dashboard</div>
          <div className="admin-header-profile">👤 Admin</div>
        </header>
        <main className="admin-main">
          {active === 'dashboard' && (
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
          {active === 'medicines' && (
            <div className="admin-section">
              <h2>Medicines Management</h2>
              <form className="medicine-form" onSubmit={editingId ? handleUpdateMedicine : handleAddMedicine} style={{ marginBottom: 24 }}>
                <input name="name" value={form.name} onChange={handleFormChange} placeholder="Name" required />
                <input name="category" value={form.category} onChange={handleFormChange} placeholder="Category" required />
                <input name="price" value={form.price} onChange={handleFormChange} placeholder="Price" type="number" min="0" step="0.01" required />
                <input name="stock" value={form.stock} onChange={handleFormChange} placeholder="Stock" type="number" min="0" required />
                <input name="expiry" value={form.expiry} onChange={handleFormChange} placeholder="Expiry Date" type="date" required />
                <button type="submit">{editingId ? 'Update' : 'Add'}</button>
                {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', category: '', price: '', stock: '', expiry: '' }); }}>Cancel</button>}
              </form>
              <table className="medicine-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Expiry</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {medicines.map(med => (
                    <tr key={med.id}>
                      <td>{med.name}</td>
                      <td>{med.category}</td>
                      <td>${med.price.toFixed(2)}</td>
                      <td>{med.stock}</td>
                      <td>{med.expiry}</td>
                      <td>
                        <button onClick={() => handleEdit(med)}>Edit</button>
                        <button onClick={() => handleDelete(med.id)} style={{ marginLeft: 8, color: 'red' }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {active === 'users' && <div className="admin-section"><h2>Users Management</h2><p>CRUD for users.</p></div>}
          {active === 'inventory' && <div className="admin-section"><h2>Inventory Management</h2><p>Stock and alerts.</p></div>}
          {active === 'sales' && <div className="admin-section"><h2>Sales Reports</h2><p>Analytics and reports.</p></div>}
          {active === 'profile' && <div className="admin-section"><h2>Admin Profile</h2><p>Profile management.</p></div>}
        </main>
        <footer className="admin-footer">
          &copy; {new Date().getFullYear()} MEDICO Admin. All rights reserved.
        </footer>
      </div>
    </div>
  );
} 
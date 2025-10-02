import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Icons } from '../components/Icons';
import ConfirmModal from '../components/ConfirmModal';
import Spinner from '../components/Spinner';
import api from '../services/api';
import './Items.css';

const Items = () => {
  const { isAdmin, isStaff } = useAuth();
  const { showSuccess, showError } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showLowStock, setShowLowStock] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: '',
    price: ''
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await api.get('/items');
      setItems(response.data.data.items);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let url = '/items/search?';
      if (searchQuery) url += `query=${searchQuery}&`;
      if (minPrice) url += `minPrice=${minPrice}&`;
      if (maxPrice) url += `maxPrice=${maxPrice}&`;
      
      const response = await api.get(url);
      setItems(response.data.data.items);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLowStock = async () => {
    try {
      setLoading(true);
      const response = await api.get('/items/low-stock?threshold=10');
      setItems(response.data.data.items);
      setShowLowStock(true);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch low stock items');
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setShowLowStock(false);
    fetchItems();
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await api.post('/items', formData);
      setShowAddModal(false);
      setFormData({ name: '', description: '', quantity: '', price: '' });
      fetchItems();
      showSuccess('Item created successfully!');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to create item');
    }
  };

  const handleEditClick = (item) => {
    setSelectedItem(item);
    if (isStaff()) {
      setFormData({ quantity: item.quantity });
    } else {
      setFormData({
        name: item.name,
        description: item.description,
        quantity: item.quantity,
        price: item.price
      });
    }
    setShowEditModal(true);
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/items/${selectedItem.id}`, formData);
      setShowEditModal(false);
      setSelectedItem(null);
      setFormData({ name: '', description: '', quantity: '', price: '' });
      fetchItems();
      showSuccess('Item updated successfully!');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update item');
    }
  };

  const handleDeleteItem = async (id) => {
    setItemToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteItem = async () => {
    try {
      await api.delete(`/items/${itemToDelete}`);
      setShowDeleteConfirm(false);
      setItemToDelete(null);
      fetchItems();
      showSuccess('Item deleted successfully!');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to delete item');
    }
  };

  const cancelDeleteItem = () => {
    setShowDeleteConfirm(false);
    setItemToDelete(null);
  };

  if (loading && items.length === 0) {
    return (
      <div className="items-container">
        <div className="loading" style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="items-container">
      <div className="items-header">
        <h1><Icons.Items style={{marginRight:8}}/> Inventory Items</h1>
        {isAdmin() && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            Add New Item
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="filters-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="price-input"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="price-input"
          />
          <button type="submit" className="btn btn-search">
            Search
          </button>
        </form>
        
        <div className="filter-actions">
          <button 
            className="btn btn-warning"
            onClick={handleLowStock}
          >
            Low Stock
          </button>
          <button 
            className="btn btn-secondary"
            onClick={handleClearFilters}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      {showLowStock && (
        <div className="alert alert-warning">
          Showing items with quantity ≤ 10
        </div>
      )}

      {/* Items Table */}
      <div className="items-table-container">
        <table className="items-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">
                  No items found
                </td>
              </tr>
            ) : (
              items.map(item => (
                <tr key={item.id} className={item.quantity <= 10 ? 'low-stock-row' : ''}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>
                    <span className={`quantity-badge ${item.quantity <= 10 ? 'low' : ''}`}>
                      {item.quantity}
                    </span>
                  </td>
                  <td>${parseFloat(item.price).toFixed(2)}</td>
                  <td className="actions-cell">
                    <button 
                      className="btn-icon btn-edit"
                      onClick={() => handleEditClick(item)}
                      title="Edit"
                    >
                      <Icons.Edit />
                    </button>
                    {isAdmin() && (
                      <button 
                        className="btn-icon btn-delete"
                        onClick={() => handleDeleteItem(item.id)}
                        title="Delete"
                      >
                        <Icons.Delete />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Item</h2>
              <button 
                className="close-btn"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddItem}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Quantity *</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Item</h2>
              <button 
                className="close-btn"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleUpdateItem}>
              {isAdmin() ? (
                <>
                  <div className="form-group">
                    <label>Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows="3"
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Quantity *</label>
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        required
                        min="0"
                      />
                    </div>
                    <div className="form-group">
                      <label>Price *</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="form-group">
                  <label>Quantity *</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    min="0"
                  />
                  <small className="form-hint">
                    As STAFF, you can only update quantity
                  </small>
                </div>
              )}
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        onConfirm={confirmDeleteItem}
        onCancel={cancelDeleteItem}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default Items;
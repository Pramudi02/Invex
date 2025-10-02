import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';
import Spinner from '../components/Spinner';
import api from '../services/api';
import './Users.css';
import { Icons } from '../components/Icons';

const Users = () => {
  const { user, isAdmin } = useAuth();
  const { showSuccess, showError, showWarning } = useToast();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'staff'
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: ''
  });

  useEffect(() => {
    // Check if user is admin
    if (!isAdmin()) {
      navigate('/forbidden');
      return;
    }
    fetchUsers();
  }, [user, navigate, isAdmin]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data.data.users);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      setShowAddModal(false);
      setFormData({ username: '', password: '', role: 'staff' });
      fetchUsers();
      showSuccess('User created successfully!');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleEditClick = (userItem) => {
    if (userItem.id === user.id) {
      showWarning('You cannot edit your own role');
      return;
    }
    setSelectedUser(userItem);
    setFormData({ role: (userItem.role || '').toLowerCase() });
    setShowEditModal(true);
  };

  const handleUpdateRole = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/users/${selectedUser.id}/role`, { role: formData.role });
      setShowEditModal(false);
      setSelectedUser(null);
      setFormData({ username: '', password: '', role: 'staff' });
      fetchUsers();
      showSuccess('User role updated successfully!');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handlePasswordClick = (userItem) => {
    setSelectedUser(userItem);
    setPasswordData({ newPassword: '' });
    setShowPasswordModal(true);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/users/${selectedUser.id}/password`, passwordData);
      setShowPasswordModal(false);
      setSelectedUser(null);
      setPasswordData({ newPassword: '' });
      showSuccess('Password updated successfully!');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update password');
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (userId === user.id) {
      showWarning('You cannot delete your own account');
      return;
    }

    setUserToDelete({ userId, username });
    setShowDeleteConfirm(true);
  };

  const confirmDeleteUser = async () => {
    try {
      await api.delete(`/users/${userToDelete.userId}`);
      setShowDeleteConfirm(false);
      setUserToDelete(null);
      fetchUsers();
      showSuccess('User deleted successfully!');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const cancelDeleteUser = () => {
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  const getRoleBadgeClass = (role) => {
    return role?.toLowerCase() === 'admin' ? 'role-badge admin' : 'role-badge staff';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && users.length === 0) {
    return (
      <div className="users-container">
        <div className="loading" style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="users-container">
      <div className="users-header">
        <div>
          <h1><Icons.Users style={{marginRight:8}}/> User Management</h1>
          <p className="subtitle">Manage system users and their roles</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          Add New User
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Users Stats */}
      <div className="users-stats">
        <div className="stat-card">
          <div className="stat-icon"><Icons.Users /></div>
          <div className="stat-info">
            <div className="stat-value">{users.length}</div>
            <div className="stat-label">Total Users</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Icons.Admin /></div>
          <div className="stat-info">
            <div className="stat-value">
              {users.filter(u => u.role?.toLowerCase() === 'admin').length}
            </div>
            <div className="stat-label">Admins</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Icons.Staff /></div>
          <div className="stat-info">
            <div className="stat-value">
              {users.filter(u => u.role?.toLowerCase() === 'staff').length}
            </div>
            <div className="stat-label">Staff Members</div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">
                  No users found
                </td>
              </tr>
            ) : (
              users.map(userItem => (
                <tr 
                  key={userItem.id}
                  className={userItem.id === user.id ? 'current-user-row' : ''}
                >
                  <td>{userItem.id}</td>
                  <td>
                    <div className="username-cell">
                      {userItem.username}
                      {userItem.id === user.id && (
                        <span className="you-badge">You</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={getRoleBadgeClass(userItem.role)}>
                      {(userItem.role || '').toLowerCase() === 'admin' ? <Icons.Admin style={{marginRight:6}}/> : <Icons.User style={{marginRight:6}}/>}
                      {(userItem.role || '').charAt(0).toUpperCase() + (userItem.role || '').slice(1)}
                    </span>
                  </td>
                  <td>{formatDate(userItem.createdAt)}</td>
                  <td>{formatDate(userItem.updatedAt)}</td>
                  <td className="actions-cell">
                    <button
                      className="btn-icon btn-edit"
                      onClick={() => handleEditClick(userItem)}
                      title="Edit Role"
                      disabled={userItem.id === user.id}
                    >
                      <Icons.Edit />
                    </button>

                    <button
                      className="btn-icon btn-reset"
                      onClick={() => handlePasswordClick(userItem)}
                      title="Reset Password"
                      disabled={userItem.id === user.id}
                    >
                      <Icons.Key />
                    </button>

                    <button
                      className="btn-icon btn-delete"
                      onClick={() => handleDeleteUser(userItem.id, userItem.username)}
                      title="Delete User"
                      disabled={userItem.id === user.id}
                    >
                      <Icons.Delete />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New User</h2>
              <button 
                className="close-btn"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddUser}>
              <div className="form-group">
                <label>Username *</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  minLength="3"
                  placeholder="Enter username (min 3 characters)"
                />
              </div>
              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength="6"
                  placeholder="Enter password (min 6 characters)"
                />
              </div>
              <div className="form-group">
                <label>Role *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="role-info">
                <strong>Role Permissions:</strong>
                <ul>
                  <li><strong>Admin:</strong> Full access to all features</li>
                  <li><strong>Staff:</strong> Can view items and update quantities only</li>
                </ul>
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
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {showEditModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit User Role</h2>
              <button 
                className="close-btn"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>
            <div className="user-info-box">
              <p><strong>Username:</strong> {selectedUser.username}</p>
              <p><strong>Current Role:</strong> 
                <span className={getRoleBadgeClass(selectedUser.role)}>
                  {selectedUser.role}
                </span>
              </p>
            </div>
            <form onSubmit={handleUpdateRole}>
              <div className="form-group">
                <label>New Role *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showPasswordModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Reset User Password</h2>
              <button 
                className="close-btn"
                onClick={() => setShowPasswordModal(false)}
              >
                ×
              </button>
            </div>
            <div className="user-info-box">
              <p><strong>Username:</strong> {selectedUser.username}</p>
              <p className="warning-text">
                The user will need to use this new password to login
              </p>
            </div>
            <form onSubmit={handleUpdatePassword}>
              <div className="form-group">
                <label>New Password *</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                  placeholder="Enter new password (min 6 characters)"
                />
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete User"
        message={`Are you sure you want to delete user "${userToDelete?.username}"? This action cannot be undone.`}
        onConfirm={confirmDeleteUser}
        onCancel={cancelDeleteUser}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default Users;
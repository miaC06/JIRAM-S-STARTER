import React, { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import API from '../../config/api';
import {
  Users,
  Search,
  Shield,
  Ban,
  CheckCircle,
  Trash2,
  AlertCircle,
  UserCheck,
  UserX,
  RefreshCw,
  Edit
} from 'lucide-react';

export default function UserManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [user]);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, roleFilter, statusFilter, users]);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await API.api.get(`/users/all?registrar_email=${user.email}`);
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError(err.response?.data?.detail || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        u =>
          u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== 'ALL') {
      filtered = filtered.filter(u => u.role === roleFilter);
    }

    // Status filter
    if (statusFilter === 'ACTIVE') {
      filtered = filtered.filter(u => u.is_active);
    } else if (statusFilter === 'DISABLED') {
      filtered = filtered.filter(u => !u.is_active);
    }

    setFilteredUsers(filtered);
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    setActionLoading(userId);
    setError('');
    setSuccess('');

    try {
      const response = await API.api.put(
        `/users/${userId}/toggle-status?registrar_email=${user.email}`
      );
      setSuccess(response.data.message);
      await fetchUsers();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update user status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId, userEmail) => {
    if (!window.confirm(`Are you sure you want to permanently delete user: ${userEmail}?\n\nThis will delete all their data including cases and cannot be undone!`)) {
      return;
    }

    setActionLoading(userId);
    setError('');
    setSuccess('');

    try {
      const response = await API.api.delete(
        `/users/${userId}?registrar_email=${user.email}`
      );
      setSuccess(response.data.message);
      await fetchUsers();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete user');
    } finally {
      setActionLoading(null);
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      CIVILIAN: 'bg-blue-100 text-blue-800 border-blue-200',
      PROSECUTOR: 'bg-purple-100 text-purple-800 border-purple-200',
      JUDGE: 'bg-red-100 text-red-800 border-red-200',
      REGISTRAR: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[role] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
          <Users className="w-7 h-7" />
          <span>User Management</span>
        </h1>
        <p className="text-gray-600 mt-1">
          Manage all system users, roles, and access
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-green-800">{success}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">
                {users.filter(u => u.is_active).length}
              </p>
            </div>
            <UserCheck className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Disabled</p>
              <p className="text-2xl font-bold text-red-600">
                {users.filter(u => !u.is_active).length}
              </p>
            </div>
            <UserX className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Civilians</p>
              <p className="text-2xl font-bold text-blue-600">
                {users.filter(u => u.role === 'CIVILIAN').length}
              </p>
            </div>
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by username or email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="ALL">All Roles</option>
            <option value="CIVILIAN">Civilian</option>
            <option value="PROSECUTOR">Prosecutor</option>
            <option value="JUDGE">Judge</option>
            <option value="REGISTRAR">Registrar</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active Only</option>
            <option value="DISABLED">Disabled Only</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cases
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No users found matching your filters
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{u.username}</div>
                        <div className="text-sm text-gray-500">{u.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor(u.role)}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {u.created_cases_count} cases
                    </td>
                    <td className="px-6 py-4">
                      {u.is_active ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
                          <CheckCircle className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 border border-red-200">
                          <Ban className="w-3 h-3" />
                          <span>Disabled</span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {u.email !== user.email && (
                        <>
                          <button
                            onClick={() => handleToggleStatus(u.id, u.is_active)}
                            disabled={actionLoading === u.id}
                            className={`inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                              u.is_active
                                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                            } disabled:opacity-50`}
                          >
                            {actionLoading === u.id ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : u.is_active ? (
                              <>
                                <Ban className="w-3 h-3" />
                                <span>Disable</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-3 h-3" />
                                <span>Enable</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id, u.email)}
                            disabled={actionLoading === u.id}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-100 text-red-800 hover:bg-red-200 transition-colors disabled:opacity-50"
                          >
                            {actionLoading === u.id ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : (
                              <>
                                <Trash2 className="w-3 h-3" />
                                <span>Delete</span>
                              </>
                            )}
                          </button>
                        </>
                      )}
                      {u.email === user.email && (
                        <span className="text-xs text-gray-500 italic">(You)</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Showing {filteredUsers.length}</strong> of <strong>{users.length}</strong> total users
        </p>
      </div>
    </div>
  );
}

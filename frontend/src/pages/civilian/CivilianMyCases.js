import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import API from '../../config/api';
import {
  FolderOpen,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle,
  Search,
  Filter
} from 'lucide-react';

export default function CivilianMyCases() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchCases();
  }, [user]);

  useEffect(() => {
    filterAndSearchCases();
  }, [cases, searchTerm, filterStatus]);

  const fetchCases = async () => {
    try {
      const response = await API.api.get(`/cases/mine/${user.email}`);
      setCases(response.data || []);
    } catch (err) {
      console.error('Failed to fetch cases:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSearchCases = () => {
    let filtered = cases;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(c => c.status === filterStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCases(filtered);
  };

  const handleDelete = async (caseId) => {
    try {
      await API.api.delete(`/cases/${caseId}?user_email=${user.email}`);
      setCases(prev => prev.filter(c => c.id !== caseId));
      setDeleteConfirm(null);
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to delete case');
    }
  };

  const handleEditSave = async (caseId) => {
    try {
      await API.api.put(
        `/cases/${caseId}/civilian?user_email=${user.email}`,
        editData
      );
      await fetchCases();
      setEditMode(null);
      setEditData({});
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update case');
    }
  };

  const startEdit = (caseItem) => {
    setEditMode(caseItem.id);
    setEditData({
      title: caseItem.title,
      description: caseItem.description,
      category: caseItem.category,
      notes: caseItem.notes,
    });
  };

  const canEdit = (status) => {
    return status === 'PENDING' || status === 'Filed';
  };

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      Filed: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      Reviewed: 'bg-green-100 text-green-800 border-green-200',
      'Under Review': 'bg-blue-100 text-blue-800 border-blue-200',
      Closed: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return styles[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Cases</h1>
              <p className="text-gray-500">View and manage your submitted cases</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/civilian/new-case')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            + New Case
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search cases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="Filed">Filed</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Under Review">Under Review</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cases List */}
      {filteredCases.length === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No cases found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterStatus !== 'all'
              ? 'Try adjusting your filters'
              : 'You haven\'t filed any cases yet'}
          </p>
          <button
            onClick={() => navigate('/civilian/new-case')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
          >
            File Your First Case
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCases.map((caseItem) => (
            <div key={caseItem.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
              {editMode === caseItem.id ? (
                /* Edit Mode */
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) => setEditData({...editData, title: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Case Title"
                  />
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData({...editData, description: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    rows={3}
                    placeholder="Description"
                  />
                  <div className="flex items-center justify-end space-x-3">
                    <button
                      onClick={() => setEditMode(null)}
                      className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleEditSave(caseItem.id)}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {caseItem.title}
                        </h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadge(caseItem.status)}`}>
                          {caseItem.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{caseItem.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Case #{caseItem.id}</span>
                        <span>•</span>
                        <span>{caseItem.category || 'General'}</span>
                        <span>•</span>
                        <span>
                          Filed: {caseItem.created_at ? new Date(caseItem.created_at).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => navigate(`/civilian/cases/${caseItem.id}`)}
                      className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                    
                    {canEdit(caseItem.status) && (
                      <>
                        <button
                          onClick={() => startEdit(caseItem)}
                          className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        
                        <button
                          onClick={() => setDeleteConfirm(caseItem.id)}
                          className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </>
                    )}
                  </div>

                  {/* Delete Confirmation */}
                  {deleteConfirm === caseItem.id && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-red-800 mb-3">
                            Are you sure you want to delete this case? This action cannot be undone.
                          </p>
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleDelete(caseItem.id)}
                              className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                            >
                              Yes, Delete
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

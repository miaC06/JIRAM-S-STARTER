import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import API from '../../config/api';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  BarChart3,
  Users,
  FolderOpen,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  FileSpreadsheet,
  Printer
} from 'lucide-react';

export default function ReportsGeneration() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [cases, setCases] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filter state
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    status: '',
    category: '',
    assignedTo: '',
    createdBy: '',
  });

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    closed: 0,
    underReview: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, cases]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [casesRes, usersRes] = await Promise.all([
        API.api.get('/cases/admin/all'),
        API.api.get(`/users/all?registrar_email=${user.email}`)
      ]);
      
      setCases(casesRes.data || []);
      setUsers(usersRes.data || []);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...cases];

    // Date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter(c => 
        new Date(c.created_at) >= new Date(filters.dateFrom)
      );
    }
    if (filters.dateTo) {
      filtered = filtered.filter(c => 
        new Date(c.created_at) <= new Date(filters.dateTo)
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(c => c.status === filters.status);
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(c => 
        c.category?.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    // Assigned to filter
    if (filters.assignedTo) {
      filtered = filtered.filter(c => 
        c.assigned_to?.id === parseInt(filters.assignedTo)
      );
    }

    // Created by filter
    if (filters.createdBy) {
      filtered = filtered.filter(c => 
        c.created_by?.id === parseInt(filters.createdBy)
      );
    }

    setFilteredCases(filtered);

    // Calculate stats
    setStats({
      total: filtered.length,
      pending: filtered.filter(c => c.status === 'PENDING' || c.status === 'Filed').length,
      underReview: filtered.filter(c => c.status === 'Under Review').length,
      reviewed: filtered.filter(c => c.status === 'Reviewed').length,
      closed: filtered.filter(c => c.status === 'Closed').length,
    });
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      status: '',
      category: '',
      assignedTo: '',
      createdBy: '',
    });
  };

  const generateCSV = () => {
    const headers = ['Case ID', 'Title', 'Status', 'Category', 'Created By', 'Assigned To', 'Created Date', 'Evidence Count'];
    const rows = filteredCases.map(c => [
      c.id,
      c.title,
      c.status,
      c.category || 'General',
      c.created_by?.email || 'N/A',
      c.assigned_to?.email || 'Unassigned',
      new Date(c.created_at).toLocaleDateString(),
      c.evidences?.length || 0
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `case-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    setSuccess('CSV report downloaded successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const generatePDF = () => {
    window.print();
  };

  const exportJSON = () => {
    const reportData = {
      generated_at: new Date().toISOString(),
      generated_by: user.email,
      filters: filters,
      stats: stats,
      cases: filteredCases.map(c => ({
        id: c.id,
        title: c.title,
        status: c.status,
        category: c.category,
        created_by: c.created_by?.email,
        assigned_to: c.assigned_to?.email,
        created_at: c.created_at,
        evidence_count: c.evidences?.length || 0,
        notes_count: c.case_notes?.length || 0
      }))
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `case-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    setSuccess('JSON report downloaded successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Header */}
      <div className="print:hidden">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
          <BarChart3 className="w-7 h-7" />
          <span>Reports & Analytics</span>
        </h1>
        <p className="text-gray-600 mt-1">
          Generate detailed reports with custom filters
        </p>
      </div>

      {/* Print Header */}
      <div className="hidden print:block text-center mb-6">
        <h1 className="text-2xl font-bold">Judicial Case Management System</h1>
        <h2 className="text-xl font-semibold mt-2">Case Report</h2>
        <p className="text-sm text-gray-600 mt-1">
          Generated on {new Date().toLocaleDateString()} by {user.email}
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3 print:hidden">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-green-800">{success}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3 print:hidden">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 print:hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filter Criteria</span>
          </h2>
          <button
            onClick={clearFilters}
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Case Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="Filed">Filed</option>
              <option value="Under Review">Under Review</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              type="text"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              placeholder="e.g. Criminal, Civil"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Assigned To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assigned To
            </label>
            <select
              value={filters.assignedTo}
              onChange={(e) => handleFilterChange('assignedTo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Users</option>
              {users.filter(u => u.role !== 'CIVILIAN').map(u => (
                <option key={u.id} value={u.id}>{u.email} ({u.role})</option>
              ))}
            </select>
          </div>

          {/* Created By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Created By (Civilian)
            </label>
            <select
              value={filters.createdBy}
              onChange={(e) => handleFilterChange('createdBy', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Civilians</option>
              {users.filter(u => u.role === 'CIVILIAN').map(u => (
                <option key={u.id} value={u.id}>{u.email}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 print:grid-cols-5">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Cases</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FolderOpen className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Under Review</p>
              <p className="text-2xl font-bold text-purple-600">{stats.underReview}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Reviewed</p>
              <p className="text-2xl font-bold text-green-600">{stats.reviewed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Closed</p>
              <p className="text-2xl font-bold text-gray-600">{stats.closed}</p>
            </div>
            <FileText className="w-8 h-8 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex items-center space-x-3 print:hidden">
        <button
          onClick={generateCSV}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export CSV</span>
        </button>

        <button
          onClick={exportJSON}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export JSON</span>
        </button>

        <button
          onClick={generatePDF}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Print / PDF</span>
        </button>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    No cases found matching your filters
                  </td>
                </tr>
              ) : (
                filteredCases.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">#{c.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{c.title}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        c.status === 'PENDING' || c.status === 'Filed' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : c.status === 'Under Review'
                          ? 'bg-blue-100 text-blue-800'
                          : c.status === 'Reviewed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{c.category || 'General'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{c.created_by?.email || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{c.assigned_to?.email || 'Unassigned'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {c.evidences?.length || 0}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 print:mt-4">
        <p className="text-sm text-blue-800">
          <strong>Report Summary:</strong> Showing {filteredCases.length} of {cases.length} total cases
          {filters.dateFrom && ` from ${new Date(filters.dateFrom).toLocaleDateString()}`}
          {filters.dateTo && ` to ${new Date(filters.dateTo).toLocaleDateString()}`}
        </p>
      </div>
    </div>
  );
}

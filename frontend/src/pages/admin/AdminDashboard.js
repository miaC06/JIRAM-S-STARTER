import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import API from '../../config/api';
import {
  FolderOpen,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Users,
  FileText,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCases: 0,
    pending: 0,
    reviewed: 0,
    closed: 0,
    underReview: 0,
  });
  const [recentCases, setRecentCases] = useState([]);
  const [loading, setLoading] = useState(true);

  const rolePrefix = user?.role?.toLowerCase() || 'admin';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await API.api.get('/cases/admin/all');
      const cases = response.data || [];
      
      setRecentCases(cases.slice(0, 10));
      setStats({
        totalCases: cases.length,
        pending: cases.filter(c => c.status === 'PENDING' || c.status === 'Filed').length,
        underReview: cases.filter(c => c.status === 'Under Review').length,
        reviewed: cases.filter(c => c.status === 'Reviewed').length,
        closed: cases.filter(c => c.status === 'Closed').length,
      });
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Cases',
      value: stats.totalCases,
      icon: FolderOpen,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      trend: '+12% from last month',
    },
    {
      title: 'Pending Review',
      value: stats.pending,
      icon: Clock,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      trend: 'Requires attention',
    },
    {
      title: 'Under Review',
      value: stats.underReview,
      icon: AlertCircle,
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      trend: 'In progress',
    },
    {
      title: 'Completed',
      value: stats.reviewed + stats.closed,
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      trend: '+8% completion rate',
    },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      Filed: 'bg-yellow-100 text-yellow-800',
      'Under Review': 'bg-blue-100 text-blue-800',
      Reviewed: 'bg-green-100 text-green-800',
      Closed: 'bg-gray-100 text-gray-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
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
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 md:p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Welcome back, {user?.role?.charAt(0) + user?.role?.slice(1).toLowerCase()}!
            </h1>
            <p className="text-primary-100 text-sm md:text-base">
              Manage cases, review submissions, and provide feedback to civilians
            </p>
          </div>
          <div className="hidden md:block">
            <TrendingUp className="w-16 h-16 text-primary-300" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/${rolePrefix}/cases`)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-gray-600 mb-2">{stat.title}</div>
              <div className="text-xs text-gray-500">{stat.trend}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => navigate(`/${rolePrefix}/cases?status=pending`)}
          className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-primary-500 hover:shadow-md transition-all text-left"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Review Pending</h3>
              <p className="text-sm text-gray-500">{stats.pending} cases waiting</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => navigate(`/${rolePrefix}/cases`)}
          className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-primary-500 hover:shadow-md transition-all text-left"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">View All Cases</h3>
              <p className="text-sm text-gray-500">Browse and manage</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => navigate(`/${rolePrefix}/users`)}
          className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-primary-500 hover:shadow-md transition-all text-left"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Manage Users</h3>
              <p className="text-sm text-gray-500">View user details</p>
            </div>
          </div>
        </button>
      </div>

      {/* Recent Cases */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Case Submissions</h2>
          <button
            onClick={() => navigate(`/${rolePrefix}/cases`)}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            View All →
          </button>
        </div>

        {recentCases.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No cases submitted yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="pb-3 text-sm font-semibold text-gray-600">Case ID</th>
                  <th className="pb-3 text-sm font-semibold text-gray-600">Title</th>
                  <th className="pb-3 text-sm font-semibold text-gray-600">Category</th>
                  <th className="pb-3 text-sm font-semibold text-gray-600">Submitted By</th>
                  <th className="pb-3 text-sm font-semibold text-gray-600">Status</th>
                  <th className="pb-3 text-sm font-semibold text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentCases.map((caseItem) => (
                  <tr
                    key={caseItem.id}
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/${rolePrefix}/cases/${caseItem.id}`)}
                  >
                    <td className="py-4 text-sm font-medium text-gray-900">
                      #{caseItem.id}
                    </td>
                    <td className="py-4 text-sm text-gray-900">{caseItem.title}</td>
                    <td className="py-4 text-sm text-gray-600">
                      {caseItem.category || 'General'}
                    </td>
                    <td className="py-4 text-sm text-gray-600">
                      {caseItem.created_by || 'Unknown'}
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                          caseItem.status
                        )}`}
                      >
                        {caseItem.status}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-gray-600">
                      {caseItem.created_at
                        ? new Date(caseItem.created_at).toLocaleDateString()
                        : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

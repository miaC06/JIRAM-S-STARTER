import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import API from '../../config/api';
import {
  FileText,
  Upload,
  BarChart3,
  Calendar,
  FolderOpen,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

export default function CivilianDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCases: 0,
    pending: 0,
    reviewed: 0,
    closed: 0,
  });
  const [recentCases, setRecentCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const response = await API.api.get(`/cases/mine/${user.email}`);
      const cases = response.data || [];
      
      setRecentCases(cases.slice(0, 5));
      setStats({
        totalCases: cases.length,
        pending: cases.filter(c => c.status === 'PENDING' || c.status === 'Filed').length,
        reviewed: cases.filter(c => c.status === 'Reviewed' || c.status === 'Under Review').length,
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
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: Clock,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
    },
    {
      title: 'Reviewed',
      value: stats.reviewed,
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'Closed',
      value: stats.closed,
      icon: XCircle,
      color: 'gray',
      bgColor: 'bg-gray-50',
      iconColor: 'text-gray-600',
    },
  ];

  const quickActions = [
    {
      title: 'File New Case',
      description: 'Submit a new case to the court',
      icon: FileText,
      color: 'primary',
      path: '/civilian/new-case',
    },
    {
      title: 'Upload Evidence',
      description: 'Add documents to your cases',
      icon: Upload,
      color: 'accent',
      path: '/civilian/evidence',
    },
    {
      title: 'Check Status',
      description: 'View case progress and feedback',
      icon: BarChart3,
      color: 'purple',
      path: '/civilian/case-status',
    },
    {
      title: 'View Hearings',
      description: 'See upcoming court dates',
      icon: Calendar,
      color: 'orange',
      path: '/civilian/hearings',
    },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      Filed: 'bg-yellow-100 text-yellow-800',
      Reviewed: 'bg-green-100 text-green-800',
      'Under Review': 'bg-blue-100 text-blue-800',
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
              Welcome back, {user?.email?.split('@')[0]}!
            </h1>
            <p className="text-primary-100 text-sm md:text-base">
              Manage your cases, track progress, and stay updated with your court proceedings
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
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <span className="text-xs font-medium text-gray-500 uppercase">
                  {stat.title}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className="flex flex-col items-center text-center p-6 rounded-lg border-2 border-gray-200 hover:border-primary-500 hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center mb-3 group-hover:bg-primary-100 transition-colors">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-500">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Cases */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Cases</h2>
          <button
            onClick={() => navigate('/civilian/my-cases')}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            View All →
          </button>
        </div>

        {recentCases.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No cases filed yet</p>
            <button
              onClick={() => navigate('/civilian/new-case')}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              File Your First Case
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="pb-3 text-sm font-semibold text-gray-600">Case ID</th>
                  <th className="pb-3 text-sm font-semibold text-gray-600">Title</th>
                  <th className="pb-3 text-sm font-semibold text-gray-600">Category</th>
                  <th className="pb-3 text-sm font-semibold text-gray-600">Status</th>
                  <th className="pb-3 text-sm font-semibold text-gray-600">Filed Date</th>
                </tr>
              </thead>
              <tbody>
                {recentCases.map((caseItem) => (
                  <tr
                    key={caseItem.id}
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/civilian/cases/${caseItem.id}`)}
                  >
                    <td className="py-4 text-sm font-medium text-gray-900">
                      #{caseItem.id}
                    </td>
                    <td className="py-4 text-sm text-gray-900">{caseItem.title}</td>
                    <td className="py-4 text-sm text-gray-600">
                      {caseItem.category || 'General'}
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

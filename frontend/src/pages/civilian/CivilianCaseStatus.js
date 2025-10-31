import React, { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import API from '../../config/api';
import {
  BarChart3,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info
} from 'lucide-react';

export default function CivilianCaseStatus() {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [caseDetails, setCaseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    fetchCases();
  }, [user]);

  const fetchCases = async () => {
    try {
      const response = await API.api.get(`/cases/mine/${user.email}`);
      setCases(response.data || []);
      if (response.data && response.data.length > 0) {
        loadCaseDetails(response.data[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch cases:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCaseDetails = async (caseId) => {
    setDetailsLoading(true);
    setSelectedCase(caseId);
    try {
      const response = await API.api.get(`/cases/${caseId}/status`);
      setCaseDetails(response.data);
    } catch (err) {
      console.error('Failed to fetch case details:', err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
      case 'Filed':
        return <Clock className="w-8 h-8 text-yellow-600" />;
      case 'Reviewed':
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case 'Under Review':
        return <Info className="w-8 h-8 text-blue-600" />;
      case 'Closed':
        return <XCircle className="w-8 h-8 text-gray-600" />;
      default:
        return <AlertCircle className="w-8 h-8 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
      case 'Filed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Reviewed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusDescription = (status) => {
    switch (status) {
      case 'PENDING':
      case 'Filed':
        return 'Your case has been filed and is awaiting review by court officials.';
      case 'Under Review':
        return 'Your case is currently being reviewed by court officials.';
      case 'Reviewed':
        return 'Your case has been reviewed. Check feedback below for more details.';
      case 'Closed':
        return 'Your case has been closed.';
      default:
        return 'Status information not available.';
    }
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
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Case Status & Feedback</h1>
            <p className="text-gray-500">Track your case progress and view admin feedback</p>
          </div>
        </div>
      </div>

      {cases.length === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No cases found</h3>
          <p className="text-gray-500">You haven't filed any cases yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cases List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="font-semibold text-gray-900">Your Cases</h2>
              </div>
              <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                {cases.map((caseItem) => (
                  <button
                    key={caseItem.id}
                    onClick={() => loadCaseDetails(caseItem.id)}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                      selectedCase === caseItem.id ? 'bg-primary-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900 truncate flex-1">
                        {caseItem.title}
                      </h3>
                      <span className={`ml-2 inline-flex px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(caseItem.status)}`}>
                        {caseItem.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">Case #{caseItem.id}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Case Details */}
          <div className="lg:col-span-2">
            {detailsLoading ? (
              <div className="bg-white rounded-xl p-12 border border-gray-200 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : caseDetails ? (
              <div className="space-y-6">
                {/* Status Card */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(caseDetails.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h2 className="text-xl font-bold text-gray-900">
                          {caseDetails.title}
                        </h2>
                        <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(caseDetails.status)}`}>
                          {caseDetails.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">
                        {getStatusDescription(caseDetails.status)}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>Filed: {new Date(caseDetails.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Timeline */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Case Progress</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Case Filed</p>
                        <p className="text-sm text-gray-500">
                          {new Date(caseDetails.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {caseDetails.status !== 'PENDING' && caseDetails.status !== 'Filed' && (
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Under Review</p>
                          <p className="text-sm text-gray-500">Case is being processed</p>
                        </div>
                      </div>
                    )}

                    {caseDetails.status === 'Reviewed' && (
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Reviewed</p>
                          <p className="text-sm text-gray-500">Check feedback below</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hearing Information - Show if status is REVIEWED */}
                {caseDetails.status.toUpperCase() === 'REVIEWED' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <Info className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-blue-900 mb-2">
                          ⚖️ Hearing Scheduled
                        </h3>
                        <p className="text-blue-800">
                          Your case has been reviewed and a hearing has been automatically scheduled. 
                          You will receive notification with the hearing details shortly. Please check 
                          your "Hearings" section for more information.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Admin Feedback */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-4">
                    <MessageSquare className="w-5 h-5 text-primary-600" />
                    <h3 className="font-semibold text-gray-900">Prosecutor Feedback</h3>
                  </div>

                  {caseDetails.feedback && caseDetails.feedback.length > 0 ? (
                    <div className="space-y-4">
                      {caseDetails.feedback.map((fb, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-primary-600">
                                  {fb.author[0].toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{fb.author}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(fb.created_at).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700 ml-10">{fb.note}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No feedback yet</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Prosecutor feedback will appear here once your case is reviewed
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select a case to view its status</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import API from '../../config/api';
import {
  ArrowLeft,
  User,
  Calendar,
  Tag,
  FileText,
  Image,
  Video,
  File,
  Eye,
  Scale,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

export default function JudgeCaseDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCaseDetails();
  }, [id]);

  const fetchCaseDetails = async () => {
    try {
      const response = await API.api.get(`/cases/admin/${id}`);
      console.log('=== JUDGE CASE DATA ===');
      console.log('Full response:', response.data);
      console.log('Evidence count:', response.data.evidences?.length || 0);
      console.log('Evidence data:', response.data.evidences);
      console.log('======================');
      setCaseData(response.data);
    } catch (err) {
      console.error('Failed to fetch case details:', err);
      setError('Failed to load case details');
    } finally {
      setLoading(false);
    }
  };

  const handleViewEvidence = (evidenceId) => {
    const url = `http://127.0.0.1:8000/evidence/download/${evidenceId}`;
    console.log('🔍 Opening evidence URL:', url);
    console.log('Evidence ID:', evidenceId);
    
    // Try to open in new tab
    const newWindow = window.open(url, '_blank');
    
    if (!newWindow) {
      alert('⚠️ Pop-up blocked! Please allow pop-ups for this site.\n\nAlternatively, right-click the "View Evidence" button and select "Open in new tab".');
    }
  };

  const getFileIcon = (filetype) => {
    if (filetype?.startsWith('image/')) return Image;
    if (filetype?.startsWith('video/')) return Video;
    return File;
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      Filed: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Under Review': 'bg-blue-100 text-blue-800 border-blue-200',
      Reviewed: 'bg-green-100 text-green-800 border-green-200',
      Closed: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-500">Case not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/judge/cases')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Cases</span>
        </button>
      </div>

      {/* Case Header */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{caseData.title}</h1>
            <div className="flex items-center space-x-3">
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(caseData.status)}`}>
                {caseData.status}
              </span>
              <span className="text-sm text-gray-500">Case #{caseData.id}</span>
            </div>
          </div>
          <Scale className="w-12 h-12 text-primary-600" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div className="flex items-start space-x-3">
            <User className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-600">Civilian</p>
              <p className="text-gray-900">{caseData.created_by || 'Not assigned'}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <User className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-600">Assigned To</p>
              <p className="text-gray-900">{caseData.assigned_to || 'Not assigned'}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-600">Filed On</p>
              <p className="text-gray-900">
                {new Date(caseData.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Case Details */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Case Details</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Tag className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Category</p>
                  <p className="text-gray-900">{caseData.category || 'General'}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Description</p>
                  <p className="text-gray-900">{caseData.description || 'No description provided'}</p>
                </div>
              </div>

              {caseData.notes && (
                <div className="flex items-start space-x-3">
                  <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Additional Notes</p>
                    <p className="text-gray-900">{caseData.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Evidence */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Evidence ({caseData.evidences?.length || 0})
            </h2>
            
            {caseData.evidences && caseData.evidences.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {caseData.evidences.map((evidence) => {
                  const FileIcon = getFileIcon(evidence.filetype);
                  return (
                    <div
                      key={evidence.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                          <FileIcon className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {evidence.filename}
                          </p>
                          <p className="text-xs text-gray-500">
                            {evidence.category || 'General'}
                          </p>
                          <p className="text-xs text-gray-500">
                            Uploaded: {new Date(evidence.uploaded_at).toLocaleDateString()}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <button
                              onClick={() => handleViewEvidence(evidence.id)}
                              className="inline-flex items-center space-x-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
                            >
                              <Eye className="w-3 h-3" />
                              <span>View Evidence</span>
                            </button>
                            <a
                              href={`http://127.0.0.1:8000/evidence/download/${evidence.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-gray-500 hover:text-gray-700 underline"
                            >
                              Direct Link
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No evidence uploaded</p>
            )}
          </div>

          {/* Case Notes / Feedback */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Case Feedback</h2>
            
            {caseData.case_notes && caseData.case_notes.length > 0 ? (
              <div className="space-y-4">
                {caseData.case_notes.map((note) => (
                  <div key={note.id} className="border-l-4 border-primary-500 bg-gray-50 p-4 rounded">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-600">
                            {note.author?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{note.author}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(note.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{note.note}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No feedback yet</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Judge Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate(`/judge/hearings`)}
                className="w-full px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
              >
                View Hearings
              </button>
              <button
                onClick={() => navigate(`/judge/schedule`)}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Schedule Hearing
              </button>
            </div>
          </div>

          {/* Case Status Timeline */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Status Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Case Filed</p>
                  <p className="text-xs text-gray-500">
                    {new Date(caseData.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {caseData.status !== 'PENDING' && caseData.status !== 'Filed' && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Under Review</p>
                    <p className="text-xs text-gray-500">In progress</p>
                  </div>
                </div>
              )}

              {caseData.status === 'Reviewed' && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Reviewed</p>
                    <p className="text-xs text-gray-500">Awaiting hearing</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

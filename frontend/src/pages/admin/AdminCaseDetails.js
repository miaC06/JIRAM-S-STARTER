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
  Send,
  CheckCircle,
  AlertCircle,
  Clock,
  Download,
  Eye
} from 'lucide-react';

export default function AdminCaseDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const rolePrefix = user?.role?.toLowerCase() || 'admin';

  useEffect(() => {
    fetchCaseDetails();
  }, [id]);

  const fetchCaseDetails = async () => {
    try {
      const response = await API.api.get(`/cases/admin/${id}`);
      setCaseData(response.data);
      setNewStatus(response.data.status);
    } catch (err) {
      console.error('Failed to fetch case details:', err);
      setError('Failed to load case details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (newStatus === caseData.status) {
      setError('Please select a different status');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await API.api.put(
        `/cases/admin/${id}?admin_email=${user.email}`,
        { status: newStatus }
      );
      setSuccess('Status updated successfully!');
      await fetchCaseDetails();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update status');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) {
      setError('Please enter feedback');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await API.api.post('/cases/admin/feedback', {
        case_id: parseInt(id),
        author_email: user.email,
        note: feedback,
      });
      setSuccess('Feedback added successfully!');
      setFeedback('');
      await fetchCaseDetails();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add feedback');
    } finally {
      setSubmitting(false);
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

  if (!caseData) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Case not found</h2>
        <button
          onClick={() => navigate(`/${rolePrefix}/cases`)}
          className="text-primary-600 hover:text-primary-700"
        >
          Back to Cases
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(`/${rolePrefix}/cases`)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{caseData.title}</h1>
          <p className="text-gray-500">Case #{caseData.id}</p>
        </div>
        <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(caseData.status)}`}>
          {caseData.status}
        </span>
      </div>

      {/* Alerts */}
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

              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Submitted On</p>
                  <p className="text-gray-900">
                    {new Date(caseData.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Evidence */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Evidence ({caseData.evidences?.length || 0})</h2>
            
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
                              <span>View</span>
                            </button>
                            <a
                              href={`http://127.0.0.1:8000/evidence/download/${evidence.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-gray-500 hover:text-gray-700 underline"
                            >
                              Link
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

          {/* Previous Feedback */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Feedback History</h2>
            
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
                        {new Date(note.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700 ml-10">{note.note}</p>
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
          {/* Submitter Info */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Submitted By</h2>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                <User className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{caseData.created_by?.email}</p>
                <p className="text-sm text-gray-500">{caseData.created_by?.role}</p>
              </div>
            </div>
          </div>

          {/* Update Status */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h2>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-3"
            >
              <option value="PENDING">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Closed">Closed</option>
            </select>
            <button
              onClick={handleStatusUpdate}
              disabled={submitting || newStatus === caseData.status}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Updating...' : 'Update Status'}
            </button>
          </div>

          {/* Add Feedback */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Feedback</h2>
            <form onSubmit={handleFeedbackSubmit}>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Enter your feedback for the civilian..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none mb-3"
              />
              <button
                type="submit"
                disabled={submitting || !feedback.trim()}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Sending...' : 'Send Feedback'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

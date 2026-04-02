import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Briefcase, CheckCircle, Clock, XCircle, Eye, Calendar, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const CandidateHistory = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    fetchApplications();  // ← Only this, NOT searchCandidates
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/api/resumes/my-resumes');
      console.log('Applications:', res.data);
      setApplications(res.data.data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error(error.response?.data?.error || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'shortlisted': return 'bg-green-100 text-green-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'shortlisted': return <CheckCircle className="h-4 w-4" />;
      case 'reviewed': return <Eye className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'shortlisted': return 'Shortlisted';
      case 'reviewed': return 'Reviewed';
      case 'rejected': return 'Not Selected';
      default: return 'Under Review';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">My Applications</h1>
        <p className="text-indigo-100">Track your job applications and their status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total</p>
              <p className="text-2xl font-bold">{applications.length}</p>
            </div>
            <Briefcase className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Shortlisted</p>
              <p className="text-2xl font-bold text-green-600">
                {applications.filter(a => a.status === 'shortlisted').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Avg Score</p>
              <p className="text-2xl font-bold text-purple-600">
                {applications.length > 0 
                  ? Math.round(applications.reduce((sum, a) => sum + a.score, 0) / applications.length)
                  : 0}%
              </p>
            </div>
            <FileText className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold">Application History</h2>
        </div>
        
        {applications.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p>No applications yet</p>
          </div>
        ) : (
          <div className="divide-y">
            {applications.map((app) => (
              <div key={app._id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{app.jobId?.title}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                        {getStatusIcon(app.status)}{getStatusText(app.status)}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{app.jobId?.company}</p>
                    <div className="flex gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Applied: {new Date(app.uploadedAt).toLocaleDateString()}
                      </div>
                      <div>Score: <span className="font-bold text-indigo-600">{app.score}%</span></div>
                    </div>
                    <button 
                      onClick={() => setSelectedApp(selectedApp === app._id ? null : app._id)} 
                      className="text-indigo-600 text-sm flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      {selectedApp === app._id ? 'Hide Details' : 'View Details'}
                    </button>
                    {selectedApp === app._id && app.analysis?.recommendation && (
                      <div className="mt-3 p-3 bg-gray-50 rounded">
                        <p className="text-sm">{app.analysis.recommendation}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateHistory;
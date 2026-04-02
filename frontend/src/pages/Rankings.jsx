import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, Award, TrendingUp, Users, FileText, 
  CheckCircle, Clock, XCircle, Eye, Download, Filter,
  Star, Briefcase, Calendar, Mail, Phone 
} from 'lucide-react';

const Rankings = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchData();
  }, [jobId]);

  const fetchData = async () => {
    try {
      const [jobRes, rankingsRes] = await Promise.all([
        api.get(`/api/jobs/${jobId}`),
        api.get(`/api/resumes/rankings/${jobId}`),
      ]);
      
      setJob(jobRes.data.data);
      setCandidates(rankingsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load rankings');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (resumeId, status) => {
    try {
      await api.put(`/api/resumes/${resumeId}/status`, { status });
      toast.success(`Candidate ${status} successfully!`);
      fetchData(); // Refresh data
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    if (score >= 40) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'shortlisted':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Shortlisted</span>;
      case 'reviewed':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center gap-1"><Eye className="h-3 w-3" /> Reviewed</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs flex items-center gap-1"><XCircle className="h-3 w-3" /> Rejected</span>;
      default:
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs flex items-center gap-1"><Clock className="h-3 w-3" /> Pending</span>;
    }
  };

  const filteredCandidates = candidates.filter(candidate => 
    filterStatus === 'all' ? true : candidate.status === filterStatus
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Job Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job?.title}</h1>
            <p className="text-gray-600">{job?.company}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {job?.skills.map((skill, idx) => (
                <span key={idx} className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded">
                  {skill}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Experience Required: {job?.experience} years
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Applicants</p>
            <p className="text-3xl font-bold text-gray-900">{candidates.length}</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-4 px-6 py-3">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                filterStatus === 'all' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All ({candidates.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                filterStatus === 'pending' 
                  ? 'bg-yellow-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Pending ({candidates.filter(c => c.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilterStatus('shortlisted')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                filterStatus === 'shortlisted' 
                  ? 'bg-green-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Shortlisted ({candidates.filter(c => c.status === 'shortlisted').length})
            </button>
            <button
              onClick={() => setFilterStatus('reviewed')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                filterStatus === 'reviewed' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Reviewed ({candidates.filter(c => c.status === 'reviewed').length})
            </button>
            <button
              onClick={() => setFilterStatus('rejected')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                filterStatus === 'rejected' 
                  ? 'bg-red-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Rejected ({candidates.filter(c => c.status === 'rejected').length})
            </button>
          </nav>
        </div>

        {/* Candidates List */}
        {filteredCandidates.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p>No candidates found with this status</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredCandidates.map((candidate, index) => (
              <div key={candidate._id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {/* Rank and Name */}
                    <div className="flex items-center space-x-3 mb-3">
                      {index === 0 && <Award className="h-6 w-6 text-yellow-500" />}
                      {index === 1 && <TrendingUp className="h-6 w-6 text-gray-500" />}
                      {index === 2 && <Star className="h-6 w-6 text-orange-500" />}
                      <h3 className="text-lg font-medium text-gray-900">
                        #{index + 1} - {candidate.name}
                      </h3>
                      {getStatusBadge(candidate.status)}
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 text-sm">
                      {candidate.email && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="h-4 w-4" />
                          {candidate.email}
                        </div>
                      )}
                      {candidate.phone && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="h-4 w-4" />
                          {candidate.phone}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        Applied: {new Date(candidate.uploadedAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">Match Score:</span>
                        <span className={`px-2 py-0.5 rounded-full text-sm font-bold ${getScoreColor(candidate.score)}`}>
                          {candidate.score}%
                        </span>
                      </div>
                    </div>

                    {/* Skills Section */}
                    {candidate.skills && candidate.skills.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.map((skill, idx) => (
                            <span key={idx} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Experience */}
                    {candidate.experience?.years > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700">Experience: {candidate.experience.years} years</p>
                        {candidate.experience.description && (
                          <p className="text-sm text-gray-500 mt-1">{candidate.experience.description}</p>
                        )}
                      </div>
                    )}

                    {/* AI Analysis */}
                    {candidate.analysis && (
                      <div className="mt-3 p-3 bg-indigo-50 rounded-lg">
                        <p className="text-sm font-medium text-indigo-900 mb-2">🤖 AI Analysis</p>
                        
                        {/* Matched Skills */}
                        {candidate.analysis.matchedSkills?.length > 0 && (
                          <div className="mb-2">
                            <p className="text-xs text-green-700">✓ Matched Skills:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {candidate.analysis.matchedSkills.map((skill, idx) => (
                                <span key={idx} className="px-1.5 py-0.5 text-xs bg-green-100 text-green-700 rounded">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Missing Skills */}
                        {candidate.analysis.missingSkills?.length > 0 && (
                          <div className="mb-2">
                            <p className="text-xs text-red-700">✗ Missing Skills:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {candidate.analysis.missingSkills.map((skill, idx) => (
                                <span key={idx} className="px-1.5 py-0.5 text-xs bg-red-100 text-red-700 rounded">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Recommendation */}
                        {candidate.analysis.recommendation && (
                          <p className="text-sm text-gray-700 mt-2">{candidate.analysis.recommendation}</p>
                        )}
                      </div>
                    )}

                    {/* Expand/Collapse Button */}
                    <button
                      onClick={() => setSelectedCandidate(selectedCandidate === candidate._id ? null : candidate._id)}
                      className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      {selectedCandidate === candidate._id ? 'Show Less' : 'View Full Details'}
                    </button>

                    {/* Full Details (Expandable) */}
                    {selectedCandidate === candidate._id && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-3">Complete Profile</h4>
                        
                        {/* Education */}
                        {candidate.education && (
                          <div className="mb-3">
                            <p className="text-sm font-medium text-gray-700">Education:</p>
                            <p className="text-sm text-gray-600">
                              {candidate.education.degree} from {candidate.education.institution}
                              {candidate.education.year && ` (${candidate.education.year})`}
                            </p>
                          </div>
                        )}

                        {/* All Skills */}
                        {candidate.skills && candidate.skills.length > 0 && (
                          <div className="mb-3">
                            <p className="text-sm font-medium text-gray-700">All Skills:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {candidate.skills.map((skill, idx) => (
                                <span key={idx} className="px-2 py-1 text-xs bg-white border border-gray-300 rounded-full">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Resume Link */}
                        {candidate.fileUrl && (
                          <div className="mt-3">
                            <a 
                              href={`http://localhost:5000/${candidate.fileUrl}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800"
                            >
                              <FileText className="h-4 w-4" />
                              View Original Resume
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="ml-4 space-y-2">
                    <select
                      value={candidate.status}
                      onChange={(e) => updateStatus(candidate._id, e.target.value)}
                      className="block w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="pending">📋 Pending</option>
                      <option value="reviewed">👁️ Reviewed</option>
                      <option value="shortlisted">⭐ Shortlisted</option>
                      <option value="rejected">❌ Rejected</option>
                    </select>
                    
                    <button
                      onClick={() => window.open(`http://localhost:5000/${candidate.fileUrl}`, '_blank')}
                      className="w-full inline-flex items-center justify-center gap-1 px-3 py-1 text-sm text-indigo-600 border border-indigo-300 rounded-md hover:bg-indigo-50"
                    >
                      <Download className="h-3 w-3" />
                      Resume
                    </button>
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

export default Rankings;
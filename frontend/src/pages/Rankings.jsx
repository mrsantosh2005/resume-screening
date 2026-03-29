import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, TrendingUp, Award, Users, FileText } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const Rankings = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [jobId]);

  const fetchData = async () => {
    try {
      const [jobRes, rankingsRes] = await Promise.all([
        axios.get(`/api/jobs/${jobId}`),
        axios.get(`/api/resumes/rankings/${jobId}`),
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
      await axios.put(`/api/resumes/${resumeId}/status`, { status });
      toast.success('Status updated successfully');
      fetchData(); // Refresh data
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const chartData = candidates.map((c, idx) => ({
    name: c.name.split(' ')[0],
    score: c.score,
  }));

  const scoreDistribution = [
    { name: 'Excellent (80-100)', value: candidates.filter(c => c.score >= 80).length, color: '#10B981' },
    { name: 'Good (60-79)', value: candidates.filter(c => c.score >= 60 && c.score < 80).length, color: '#F59E0B' },
    { name: 'Average (40-59)', value: candidates.filter(c => c.score >= 40 && c.score < 60).length, color: '#EF4444' },
    { name: 'Poor (<40)', value: candidates.filter(c => c.score < 40).length, color: '#6B7280' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
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

      {/* Charts */}
      {candidates.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Score Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Score Categories</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={scoreDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {scoreDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Candidates List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Candidate Rankings</h2>
        </div>
        
        {candidates.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p>No candidates have applied yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {candidates.map((candidate, index) => (
              <div key={candidate._id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {index === 0 && <Award className="h-8 w-8 text-yellow-500" />}
                        {index === 1 && <TrendingUp className="h-8 w-8 text-gray-500" />}
                        {index > 1 && <Users className="h-8 w-8 text-gray-400" />}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          #{index + 1} - {candidate.name}
                        </h3>
                        <p className="text-sm text-gray-500">{candidate.email}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.slice(0, 5).map((skill, idx) => (
                            <span key={idx} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Experience</h4>
                        <p className="text-sm text-gray-600">
                          {candidate.experience?.years || 0} years
                        </p>
                      </div>
                    </div>
                    
                    {candidate.analysis?.recommendation && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-md">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">AI Analysis</h4>
                        <p className="text-sm text-gray-600">{candidate.analysis.recommendation}</p>
                      </div>
                    )}
                    
                    {candidate.analysis?.matchedSkills && candidate.analysis.matchedSkills.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Matched Skills</h4>
                        <div className="flex flex-wrap gap-1">
                          {candidate.analysis.matchedSkills.map((skill, idx) => (
                            <span key={idx} className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {candidate.analysis?.missingSkills && candidate.analysis.missingSkills.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Missing Skills</h4>
                        <div className="flex flex-wrap gap-1">
                          {candidate.analysis.missingSkills.map((skill, idx) => (
                            <span key={idx} className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right ml-6">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreBgColor(candidate.score)} ${getScoreColor(candidate.score)}`}>
                      Score: {candidate.score}%
                    </div>
                    <div className="mt-4 space-y-2">
                      <select
                        value={candidate.status}
                        onChange={(e) => updateStatus(candidate._id, e.target.value)}
                        className="block w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <button
                        onClick={() => window.open(candidate.fileUrl, '_blank')}
                        className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        View Resume
                      </button>
                    </div>
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
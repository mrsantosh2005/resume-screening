import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Award, TrendingUp, Users, FileText } from 'lucide-react';

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
      const [jobRes, rankingsRes] = await Promise.all([api.get(`/api/jobs/${jobId}`), api.get(`/api/resumes/rankings/${jobId}`)]);
      setJob(jobRes.data.data);
      setCandidates(rankingsRes.data.data);
    } catch (error) {
      toast.error('Failed to load rankings');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (resumeId, status) => {
    try {
      await api.put(`/api/resumes/${resumeId}/status`, { status });
      toast.success('Status updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
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
      <div className="bg-white rounded-lg shadow p-6">
        <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Link>
        <h1 className="text-2xl font-bold text-gray-900">{job?.title}</h1>
        <p className="text-gray-600">{job?.company}</p>
        <div className="mt-2 flex flex-wrap gap-2">{job?.skills.map((skill, idx) => <span key={idx} className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded">{skill}</span>)}</div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200"><h2 className="text-xl font-semibold text-gray-900">Candidate Rankings</h2></div>
        {candidates.length === 0 ? (
          <div className="p-6 text-center text-gray-500"><Users className="h-12 w-12 mx-auto mb-3 text-gray-400" /><p>No candidates have applied yet</p></div>
        ) : (
          <div className="divide-y divide-gray-200">
            {candidates.map((candidate, index) => (
              <div key={candidate._id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-3">
                      {index === 0 && <Award className="h-8 w-8 text-yellow-500" />}
                      <h3 className="text-lg font-medium text-gray-900">#{index + 1} - {candidate.name}</h3>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {candidate.skills.slice(0, 5).map((skill, idx) => <span key={idx} className="px-2 py-1 text-xs bg-gray-100 rounded">{skill}</span>)}
                    </div>
                    {candidate.analysis?.recommendation && <p className="mt-2 text-sm text-gray-600">{candidate.analysis.recommendation}</p>}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-indigo-600">{candidate.score}%</div>
                    <select value={candidate.status} onChange={(e) => updateStatus(candidate._id, e.target.value)} className="mt-2 px-2 py-1 text-sm border rounded">
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="rejected">Rejected</option>
                    </select>
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
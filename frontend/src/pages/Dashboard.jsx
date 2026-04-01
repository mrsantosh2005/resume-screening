import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Briefcase, FileText, TrendingUp, Users } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/api/jobs');
      setJobs(res.data.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
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
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
        <p className="text-indigo-100">{user?.role === 'hr' ? 'Manage your job postings and review candidates' : 'Find your dream job by applying to opportunities'}</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{user?.role === 'hr' ? 'Your Job Postings' : 'Available Jobs'}</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {jobs.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>No jobs found</p>
              {user?.role === 'hr' && <Link to="/create-job" className="mt-3 inline-block text-indigo-600">Create your first job posting →</Link>}
            </div>
          ) : (
            jobs.map((job) => (
              <div key={job._id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{job.company}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {job.skills.slice(0, 5).map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded">{skill}</span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Experience Required: {job.experience} years</p>
                  </div>
                  <div>
                    {user?.role === 'hr' && (
                      <Link to={`/rankings/${job._id}`} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">View Rankings</Link>
                    )}
                    {user?.role === 'candidate' && (
                      <Link to={`/upload-resume?jobId=${job._id}`} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Apply Now</Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
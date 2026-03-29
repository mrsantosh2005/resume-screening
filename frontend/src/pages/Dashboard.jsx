import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Briefcase, TrendingUp, Users, FileText } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    averageScore: 0,
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get('/api/jobs');
      setJobs(res.data.data);
      
      // Calculate stats
      if (user?.role === 'hr') {
        // Fetch applications for each job
        let totalApps = 0;
        let totalScore = 0;
        
        for (const job of res.data.data) {
          const rankingsRes = await axios.get(`/api/resumes/rankings/${job._id}`);
          totalApps += rankingsRes.data.count;
          const scores = rankingsRes.data.data.map(r => r.score);
          totalScore += scores.reduce((a, b) => a + b, 0);
        }
        
        setStats({
          totalJobs: res.data.data.length,
          totalApplications: totalApps,
          averageScore: totalApps > 0 ? Math.round(totalScore / totalApps) : 0,
        });
      }
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
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-indigo-100">
          {user?.role === 'hr'
            ? 'Manage your job postings and review candidates'
            : 'Find your dream job by applying to opportunities'}
        </p>
      </div>

      {/* Stats Cards - Only for HR */}
      {user?.role === 'hr' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
              </div>
              <Briefcase className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Applications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Avg. Score</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageScore}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      )}

      {/* Jobs List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {user?.role === 'hr' ? 'Your Job Postings' : 'Available Jobs'}
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {jobs.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>No jobs found</p>
              {user?.role === 'hr' && (
                <Link
                  to="/create-job"
                  className="mt-3 inline-block text-indigo-600 hover:text-indigo-800"
                >
                  Create your first job posting →
                </Link>
              )}
            </div>
          ) : (
            jobs.map((job) => (
              <div key={job._id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{job.company}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {job.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Experience Required: {job.experience} years
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Posted: {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    {user?.role === 'hr' && (
                      <Link
                        to={`/rankings/${job._id}`}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        View Rankings
                      </Link>
                    )}
                    {user?.role === 'candidate' && (
                      <Link
                        to={`/upload-resume?jobId=${job._id}`}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                      >
                        Apply Now
                      </Link>
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
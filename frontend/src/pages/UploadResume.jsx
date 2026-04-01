import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Upload, FileText, CheckCircle } from 'lucide-react';

const UploadResume = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(searchParams.get('jobId') || '');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/api/jobs');
      setJobs(res.data.data);
    } catch (error) {
      toast.error('Failed to load jobs');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedJob) return toast.error('Please select a job');
    if (!file) return toast.error('Please select a file');

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobId', selectedJob);
    
    setUploading(true);
    try {
      await api.post('/api/resumes/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Resume uploaded and analyzed successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Upload Your Resume</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Job *</label>
            <select value={selectedJob} onChange={(e) => setSelectedJob(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Choose a job...</option>
              {jobs.map(job => <option key={job._id} value={job._id}>{job.title} at {job.company}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Resume File (PDF) *</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {file ? (
                <div>
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                  <p className="mt-2 text-sm text-gray-600">{file.name}</p>
                  <button type="button" onClick={() => setFile(null)} className="mt-2 text-sm text-red-600">Remove</button>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                </div>
              )}
            </div>
          </div>
          
          <button type="submit" disabled={uploading} className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50">
            {uploading ? 'Uploading & Analyzing...' : 'Upload Resume'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadResume;
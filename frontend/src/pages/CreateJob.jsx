import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Plus, X } from 'lucide-react';

const CreateJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', company: '', description: '', skills: [], experience: '', location: '' });
  const [skillInput, setSkillInput] = useState('');

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const token = localStorage.getItem('token');
    console.log('Creating job with token:', token ? 'Yes' : 'No'); // Debug
    console.log('User role from localStorage? Check login response');
    
    const response = await api.post('/api/jobs', formData);
    console.log('Job created:', response.data);
    toast.success('Job posted successfully!');
    navigate('/');
  } catch (error) {
    console.error('Create job error:', error.response?.status, error.response?.data);
    toast.error(error.response?.data?.error || 'Failed to post job');
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Post a New Job</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
            <input type="text" name="title" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company *</label>
            <input type="text" name="company" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea name="description" required rows="5" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills *</label>
            <div className="flex gap-2">
              <input type="text" className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addSkill()} placeholder="Type a skill and press Enter" />
              <button type="button" onClick={addSkill} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"><Plus className="h-5 w-5" /></button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.skills.map((skill, idx) => (
                <span key={idx} className="inline-flex items-center px-2 py-1 rounded-md text-sm bg-indigo-100 text-indigo-800">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="ml-2"><X className="h-3 w-3" /></button>
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Required Experience (years) *</label>
            <input type="number" name="experience" required min="0" step="0.5" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input type="text" name="location" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={() => navigate('/')} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50">{loading ? 'Posting...' : 'Post Job'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;
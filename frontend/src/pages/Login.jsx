import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  console.log('Attempting login with:', { email, password });
  
  const success = await login(email, password);
  console.log('Login success:', success);
  
  setLoading(false);
  if (success) {
    navigate('/');
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-2xl">
            <Briefcase className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">Welcome Back!</h2>
        <p className="text-center text-gray-600 mb-8">Sign in to your account</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="you@example.com"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">Don't have an account? <Link to="/register" className="text-indigo-600 font-semibold hover:underline">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
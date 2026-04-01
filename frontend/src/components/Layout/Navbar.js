import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, FileText, LogOut, User, History, PlusCircle } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">ResumeAI</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className="text-gray-900 hover:text-indigo-600 px-3 py-2">Dashboard</Link>
              {user?.role === 'hr' && (
                <Link to="/create-job" className="flex items-center text-gray-900 hover:text-indigo-600 px-3 py-2">
                  <PlusCircle className="h-4 w-4 mr-1" /> Post Job
                </Link>
              )}
              {user?.role === 'candidate' && (
                <>
                  <Link to="/upload-resume" className="flex items-center text-gray-900 hover:text-indigo-600 px-3 py-2">
                    <FileText className="h-4 w-4 mr-1" /> Apply Now
                  </Link>
                  <Link to="/my-applications" className="flex items-center text-gray-900 hover:text-indigo-600 px-3 py-2">
                    <History className="h-4 w-4 mr-1" /> My Applications
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-700">{user?.name}</span>
            </div>
            <button onClick={handleLogout} className="flex items-center text-gray-700 hover:text-indigo-600">
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
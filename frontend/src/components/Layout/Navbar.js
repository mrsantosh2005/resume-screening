import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, FileText, LogOut, User, History, PlusCircle, Search, Users } from 'lucide-react';

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
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">ResumeAI</span>
            </Link>
            
            {/* Navigation Links */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-indigo-600 border-b-2 border-transparent hover:border-indigo-600 transition"
              >
                Dashboard
              </Link>
              
              {/* 🔍 Candidates can search JOBS */}
              {user?.role === 'candidate' && (
                <Link 
                  to="/search" 
                  className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-indigo-600 border-b-2 border-transparent hover:border-indigo-600 transition"
                >
                  <Search className="h-4 w-4 mr-1" />
                  Search Jobs
                </Link>
              )}
              
              {/* 👥 HR can search CANDIDATES */}
              {user?.role === 'hr' && (
                <Link 
                  to="/search-candidates" 
                  className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-indigo-600 border-b-2 border-transparent hover:border-indigo-600 transition"
                >
                  <Users className="h-4 w-4 mr-1" />
                  Search Candidates
                </Link>
              )}
              
              {/* HR: Post Job */}
              {user?.role === 'hr' && (
                <Link
                  to="/create-job"
                  className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-indigo-600 border-b-2 border-transparent hover:border-indigo-600 transition"
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Post Job
                </Link>
              )}
              
              {/* Candidate: Apply Now */}
              {user?.role === 'candidate' && (
                <Link
                  to="/upload-resume"
                  className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-indigo-600 border-b-2 border-transparent hover:border-indigo-600 transition"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Apply Now
                </Link>
              )}
              
              {/* Candidate: My Applications */}
              {user?.role === 'candidate' && (
                <Link
                  to="/my-applications"
                  className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-indigo-600 border-b-2 border-transparent hover:border-indigo-600 transition"
                >
                  <History className="h-4 w-4 mr-1" />
                  My Applications
                </Link>
              )}
            </div>
          </div>
          
          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">
                  {user?.role === 'hr' ? 'HR Manager' : 'Candidate'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
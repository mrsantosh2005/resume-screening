import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/Layout/PrivateRoute';
import FloatingLines from './components/Background/FloatingLines.jsx';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateJob from './pages/CreateJob';
import UploadResume from './pages/UploadResume';
import Rankings from './pages/Rankings';
import CandidateHistory from './pages/CandidateHistory';
import SearchResults from './pages/SearchResults';
import SearchCandidates from './pages/SearchCandidates';

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Floating Lines Background */}
        <FloatingLines 
          enabledWaves={["top", "middle", "bottom"]}
          lineCount={10}
          lineDistance={5}
          bendRadius={6}
          bendStrength={-0.4}
          interactive={true}
          parallax={true}
        />
        
        <div className="min-h-screen bg-transparent relative z-10">
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/" element={<PrivateRoute />}>
              <Route index element={<Dashboard />} />
              <Route path="create-job" element={<CreateJob />} />
              <Route path="upload-resume" element={<UploadResume />} />
              <Route path="rankings/:jobId" element={<Rankings />} />
              <Route path="my-applications" element={<CandidateHistory />} />
              <Route path="search" element={<SearchResults />} />
              <Route path="search-candidates" element={<SearchCandidates />} />
            </Route>
            
            {/* 404 Route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
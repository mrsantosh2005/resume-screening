import React from 'react';

const CandidateHistory = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">My Applications</h1>
        <p className="text-gray-600">Your application history will appear here.</p>
        <button 
          onClick={() => alert('Working!')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Test Button
        </button>
      </div>
    </div>
  );
};

export default CandidateHistory;
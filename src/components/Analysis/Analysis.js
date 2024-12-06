import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './Analysis.css';

const Analysis = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to Power BI dashboard when component mounts
    window.open('https://app.powerbi.com/groups/me/reports/7f8837e9-9384-40dc-8161-5a1e6fa62805/567247af8b72d1a7bd9e?experience=power-bi', '_blank');
    // Navigate back to dashboard after opening Power BI
    navigate('/dashboard');
  }, [navigate]);

  return (
    <div className="analysis-container">
      <div className="analysis-header">
        <button 
          className="back-to-dashboard"
          onClick={() => navigate('/dashboard')}
        >
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h1>Redirecting to Analysis Dashboard...</h1>
      </div>
    </div>
  );
};

export default Analysis; 
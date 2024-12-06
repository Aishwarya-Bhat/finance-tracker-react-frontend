import React from 'react';
import { useNavigate } from 'react-router-dom';
import IncomeForm from './IncomeForm';
import './IncomePage.css';

function IncomePage() {
  const navigate = useNavigate();

  const handleIncomeAdded = () => {
    // Navigate back to income list after successful addition
    navigate('/incomes-list');
  };

  return (
    <div className="income-page">
      <div className="income-page-header">
        <h2>Add New Income</h2>
        <button 
          className="back-to-list-button"
          onClick={() => navigate('/incomes-list')}
        >
          Back to List
        </button>
      </div>
      <IncomeForm onSuccess={handleIncomeAdded} />
    </div>
  );
}

export default IncomePage;
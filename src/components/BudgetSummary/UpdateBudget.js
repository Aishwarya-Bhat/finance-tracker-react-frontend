import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UpdateBudget.css';

const UpdateBudget = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const budget = location.state;

  const [formData, setFormData] = useState({
    year: budget.year,
    month: budget.month,
    budgetAmount: budget.budgetAmount
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://127.0.0.1:8000/api/budget-update/${budget.budgetID}/`, formData);
      navigate('/budgets');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update budget');
    }
  };

  const handleCancel = () => {
    navigate('/budgets');
  };

  const getMonthName = (monthNumber) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[monthNumber - 1];
  };

  return (
    <div className="update-budget-container">
      <h2 className="update-budget-title">Update Budget</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="update-budget-form">
        <div className="form-group">
          <label htmlFor="year">Year</label>
          <input
            type="number"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            min="2000"
            max="2100"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="month">Month</label>
          <select
            id="month"
            name="month"
            value={formData.month}
            onChange={handleChange}
            required
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
              <option key={month} value={month}>
                {getMonthName(month)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="budgetAmount">Budget Amount ($)</label>
          <input
            type="number"
            id="budgetAmount"
            name="budgetAmount"
            value={formData.budgetAmount}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="save-button">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateBudget;

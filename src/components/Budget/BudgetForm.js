import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { FaArrowLeft } from 'react-icons/fa';
import './BudgetForm.css';

const BudgetForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    budgetAmount: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = name === 'year' || name === 'month' ? 
      parseInt(value) : 
      name === 'budgetAmount' ? 
        parseFloat(value) : 
        value;

    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        year: parseInt(formData.year),
        month: parseInt(formData.month),
        budgetAmount: parseFloat(formData.budgetAmount)
      };
      
      await axios.post('http://127.0.0.1:8000/api/budget/', payload);
      navigate('/budgets');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add budget');
    }
  };

  return (
    <div className="budget-form-container">
      <div className="budget-form-header">
        <button 
          className="back-to-list-button"
          onClick={() => navigate('/budgets')}
        >
          <FaArrowLeft /> Back to List
        </button>
        <h2>Add New Budget</h2>
      </div>

      <form onSubmit={handleSubmit} className="budget-form">
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="year">Year:</label>
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
          <label htmlFor="month">Month:</label>
          <select
            id="month"
            name="month"
            value={formData.month}
            onChange={handleChange}
            required
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
              <option key={month} value={month}>
                {new Date(2000, month - 1).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="budgetAmount">Budget Amount ($):</label>
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

        <button type="submit" className="submit-button">
          Add Budget
        </button>
      </form>
    </div>
  );
};

export default BudgetForm;

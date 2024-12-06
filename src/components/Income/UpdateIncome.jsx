import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../shared/FormStyles.css';
import { FaSave, FaTimes } from 'react-icons/fa';

const UpdateIncome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { income, sourceName } = location.state;

  console.log('Income data:', income);
  console.log('Source name:', sourceName);

  const sources = [
    { id: "S1", name: "Capital Gains" },
    { id: "S2", name: "Dividend Income" },
    { id: "S3", name: "Earned Income" },
    { id: "S4", name: "Interest Income" },
    { id: "S5", name: "Others" },
    { id: "S6", name: "Profit Income" },
    { id: "S7", name: "Rental Income" },
    { id: "S8", name: "Royalty Income" }
  ];

  const getSourceIdByName = (sourceName) => {
    const source = sources.find(s => s.name === sourceName);
    return source ? source.id : sources[0].id;
  };

  const [formData, setFormData] = useState({
    payerDetail: income.payerDetail,
    remarks: income.remarks || '',
    amount: income.amount,
    sourceID: getSourceIdByName(sourceName)
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
      const submissionData = {
        ...formData,
        incomeDate: income.incomeDate || income.date
      };
      
      console.log('Submitting data:', submissionData);
      
      await axios.post(`http://127.0.0.1:8000/api/income-update/${income.incomeID}/`, submissionData);
      navigate('/incomes-list');
    } catch (err) {
      console.error('Update Error:', err);
      setError(err.response?.data?.error || 'Failed to update income');
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Update Income</h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-content">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="payerDetail">Payer Detail</label>
            <input
              type="text"
              id="payerDetail"
              name="payerDetail"
              value={formData.payerDetail}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="sourceID">Source</label>
            <select 
              id="sourceID"
              name="sourceID" 
              value={formData.sourceID}
              onChange={handleChange}
              required
            >
              {sources.map((source) => (
                <option 
                  key={source.id} 
                  value={source.id}
                  selected={sourceName === source.name}
                >
                  {source.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group full-width">
            <label htmlFor="remarks">Remarks</label>
            <textarea
              id="remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-cancel" onClick={() => navigate('/incomes-list')}>
              <FaTimes /> Cancel
            </button>
            <button type="submit" className="btn btn-submit">
              <FaSave /> Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateIncome; 
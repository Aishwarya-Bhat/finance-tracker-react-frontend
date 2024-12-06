import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import '../shared/FormStyles.css';
import { FaSave, FaTimes } from 'react-icons/fa';

const ExpenseForm = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    payeeDetail: "",
    remarks: "",
    amount: "",
    budgetID: "B012023",
    categoryID: 1,
    date: ""
  });
  const [error, setError] = useState("");

  // Function to get the first and last day of the selected budget month
  const getBudgetMonthRange = (budgetID) => {
    const month = budgetID.substring(1, 3);
    const year = budgetID.substring(3);
    const lastDay = new Date(year, parseInt(month), 0).getDate();
    return {
      firstDay: `${year}-${month}-01`,
      lastDay: `${year}-${month}-${String(lastDay).padStart(2, '0')}`
    };
  };

  // Set initial date when component mounts
  useEffect(() => {
    const { firstDay } = getBudgetMonthRange(formData.budgetID);
    setFormData(prev => ({
      ...prev,
      date: firstDay
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'date') {
      // For date input, use the value directly without any conversion
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else if (name === 'budgetID') {
      const { firstDay } = getBudgetMonthRange(value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        date: firstDay
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format the date to ensure it's in YYYY-MM-DD format without any timezone conversion
      const submissionData = {
        ...formData,
        date: new Date(formData.date).toISOString().split('T')[0]
      };

      console.log('Submitting date:', submissionData.date); // Debug log
      
      await axios.post('http://127.0.0.1:8000/api/expense/', submissionData);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add expense');
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Add New Expense</h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-content">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="payeeDetail">Payee Detail</label>
            <input
              type="text"
              id="payeeDetail"
              name="payeeDetail"
              value={formData.payeeDetail}
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

          <div className="form-group full-width">
            <label htmlFor="remarks">Remarks</label>
            <textarea
              id="remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="budgetID">Budget Period</label>
            <select 
              id="budgetID"
              name="budgetID" 
              value={formData.budgetID} 
              onChange={handleChange}
            >
              {[
                "B012023",
                "B022023",
                "B032023",
                "B042023",
                "B052023",
                "B062023",
                "B072023",
                "B082023",
                "B092023",
                "B102023",
                "B112023",
                "B122023",
                "B012024",
                "B022024",
                "B032024",
                "B042024",
                "B052024",
                "B062024",
                "B072024",
                "B082024",
                "B092024",
                "B102024",
                "B112024",
                "B122024",
              ].map((budget) => {
                const month = budget.substring(1, 3);
                const year = budget.substring(3);
                const monthName = new Date(year, parseInt(month) - 1).toLocaleString('default', { month: 'long' });
                return (
                  <option key={budget} value={budget}>
                    {`${monthName} ${year}`}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={getBudgetMonthRange(formData.budgetID).firstDay}
              max={getBudgetMonthRange(formData.budgetID).lastDay}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoryID">Category</label>
            <select 
              id="categoryID"
              name="categoryID" 
              value={formData.categoryID} 
              onChange={handleChange}
            >
              {[
                { id: 1, name: "Automotive" },
                { id: 2, name: "Bills & Utilities" },
                { id: 3, name: "Education" },
                { id: 4, name: "Entertainment" },
                { id: 6, name: "Food & Drink" },
                { id: 7, name: "Gas" },
                { id: 8, name: "Gifts & Donations" },
                { id: 9, name: "Groceries" },
                { id: 10, name: "Health & Wellness" },
                { id: 11, name: "Home" },
                { id: 12, name: "Miscellaneous" },
                { id: 14, name: "Personal" },
                { id: 15, name: "Professional Services" },
                { id: 16, name: "Shopping" },
                { id: 17, name: "TravelExpense" },
              ].map((category) => (
                <option key={category.id} value={category.id}>
                  {category.id} - {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-cancel" onClick={() => navigate('/expenses-list')}>
              <FaTimes /> Cancel
            </button>
            <button type="submit" className="btn btn-submit">
              <FaSave /> Save Expense
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;

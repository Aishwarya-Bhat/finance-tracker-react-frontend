import React from 'react'
import { useNavigate } from 'react-router-dom'
import ExpenseForm from './ExpenseForm'
import axios from 'axios'
import { FaArrowLeft } from 'react-icons/fa'
import './ExpensePage.css'

function ExpensePage() {
  const navigate = useNavigate()

  const generateBudgetID = (date) => {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Add 1 because months are 0-based
    const year = d.getFullYear();
    return `B${month}${year}`;
  };

  const checkBudgetExists = async (date) => {
    const budgetID = generateBudgetID(date);
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/budget-list/`);
        return response.data.some(budget => budget.budgetID === budgetID);
    } catch (error) {
        console.error('Error checking budget:', error);
        return false;
    }
  };

  const handleExpenseAdded = () => {
    // Navigate back to expense list after successful addition
    navigate('/expenses-list');
  };

  return (
    <div className="expense-page">
      <div className="expense-page-header">
        <button 
          className="back-to-list-button"
          onClick={() => navigate('/expenses-list')}
        >
          <FaArrowLeft /> Back to List
        </button>
        <h2>Add New Expense</h2>
      </div>
      <ExpenseForm onSuccess={handleExpenseAdded} />
    </div>
  )
}

export default ExpensePage
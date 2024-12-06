import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import incomeIcon from '../../assets/income.jpg';  // Changed to .jpg
import expenseIcon from '../../assets/expense.jpg'; // Changed to .jpg
import budgetIcon from '../../assets/budget.png';   // Keep this as .png if you have it
import analysisIcon from '../../assets/analysis.avif';  // Add this import
import logo from '../../assets/logo1.png';  // Changed from logo.png to logo1.png
import { FaHistory } from 'react-icons/fa';  // Add this import

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <img src={logo} alt="Logo" className="dashboard-logo" />
        <h1 className="dashboard-title">Personal Finance Tracker</h1>
      </div>

      <div className="dashboard-content">
        <div className="history-button-container">
          <button 
            className="history-button"
            onClick={() => navigate('/history')}
          >
            <FaHistory /> History
          </button>
        </div>
        
        <div className="dashboard-buttons">
          <div 
            className="dashboard-card"
            onClick={() => navigate('/incomes-list')}
          >
            <img src={incomeIcon} alt="Income" className="card-icon" />
            <h2>Income</h2>
            <p>View and manage your income records</p>
          </div>

          <div 
            className="dashboard-card"
            onClick={() => navigate('/expenses-list')}
          >
            <img src={expenseIcon} alt="Expense" className="card-icon" />
            <h2>Expense</h2>
            <p>Track and manage your expenses</p>
          </div>

          <div 
            className="dashboard-card"
            onClick={() => navigate('/budgets')}
          >
            <img src={budgetIcon} alt="Budget" className="card-icon" />
            <h2>Budget</h2>
            <p>Set and monitor your budgets</p>
          </div>

          <div 
            className="dashboard-card"
            onClick={() => window.open('https://app.powerbi.com/groups/me/reports/7f8837e9-9384-40dc-8161-5a1e6fa62805/567247af8b72d1a7bd9e?experience=power-bi', '_blank')}
          >
            <img src={analysisIcon} alt="Analysis" className="card-icon" />
            <h2>Analysis</h2>
            <p>View financial analysis and reports</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

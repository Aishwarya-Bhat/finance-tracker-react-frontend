import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import "./BudgetList.css";
import ConfirmDialog from "../common/ConfirmDialog";
import BackButton from '../common/BackButton';

const BudgetList = () => {
  const [budgets, setBudgets] = useState([]);
  const [error, setError] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/budget-list/");
        setBudgets(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "An error occurred while fetching budgets.");
      }
    };
    fetchBudgets();
  }, []);

  const handleDeleteClick = (budget) => {
    setBudgetToDelete(budget);
    setDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/budget-delete/${budgetToDelete.budgetID}/`);
      setBudgets(budgets.filter((budget) => budget.budgetID !== budgetToDelete.budgetID));
      setDialogOpen(false);
      setBudgetToDelete(null);
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred while deleting the budget.");
    }
  };

  const handleDeleteCancel = () => {
    setDialogOpen(false);
    setBudgetToDelete(null);
  };

  const handleUpdate = (budget) => {
    navigate("/update-budget", { state: budget });
  };

  const handleAddBudget = () => {
    navigate('/budget');
  };

  const getMonthName = (monthNumber) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[monthNumber - 1];
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortedBudgets = () => {
    if (!sortConfig.key) return budgets;

    return [...budgets].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Special handling for month names
      if (sortConfig.key === 'month') {
        aValue = parseInt(a.month);
        bValue = parseInt(b.month);
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) {
      return <span className="sort-icon">↕</span>;
    }
    return sortConfig.direction === 'ascending' 
      ? <span className="sort-icon">↑</span> 
      : <span className="sort-icon">↓</span>;
  };

  return (
    <div className="budget-list-container">
      <BackButton />
      <h2 className="budget-list-title">Budget List</h2>
      
      <div className="add-budget-section">
        <button 
          className="add-budget-button"
          onClick={handleAddBudget}
        >
          <FaPlus /> Add Budget
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}
      {!error && budgets.length === 0 && <p className="no-records">No budget records found.</p>}
      
      <div className="table-container">
        <table className="budget-table">
          <thead>
            <tr>
              <th onClick={() => requestSort('year')} className="sortable-header">
                Year {getSortIcon('year')}
              </th>
              <th onClick={() => requestSort('month')} className="sortable-header">
                Month {getSortIcon('month')}
              </th>
              <th onClick={() => requestSort('budgetAmount')} className="sortable-header">
                Budget Amount {getSortIcon('budgetAmount')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {getSortedBudgets().map((budget) => (
              <tr key={budget.budgetID}>
                <td>{budget.year}</td>
                <td>{getMonthName(budget.month)}</td>
                <td>${budget.budgetAmount.toFixed(2)}</td>
                <td className="action-buttons">
                  <button 
                    className="update-btn"
                    onClick={() => handleUpdate(budget)}
                  >
                    Update
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteClick(budget)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={dialogOpen}
        title="Confirm Delete"
        message={`Are you sure you want to delete the budget for ${budgetToDelete ? getMonthName(budgetToDelete.month) : ''} ${budgetToDelete ? budgetToDelete.year : ''}?`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default BudgetList;

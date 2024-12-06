import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ExpenseList.css';
import ConfirmDialog from '../common/ConfirmDialog';
import { FaEdit, FaTrashAlt, FaPlus, FaCalculator } from 'react-icons/fa';
import BackButton from '../common/BackButton';
import MonthlyTotalDialog from '../common/MonthlyTotalDialog';

const ExpenseList = () => {
  const [categories, setCategories] = useState([]);
  const [categoryExpenses, setCategoryExpenses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'descending'
  });
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [isMonthlyTotalOpen, setIsMonthlyTotalOpen] = useState(false);

  const fetchExpenses = async () => {
    try {
      console.log('Fetching expenses...');
      const response = await axios.get('http://127.0.0.1:8000/api/expenses/');
      console.log('Response:', response.data);
      setCategories(response.data.categories);
      setCategoryExpenses(response.data.categoryExpenses);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError(err.response?.data?.error || 'Failed to fetch expenses');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    const getMonthlyTotal = async () => {
      try {
        const response = await axios.get(
          'http://127.0.0.1:8000/api/monthly-expense/',
          {
            params: {
              month: selectedMonth,
              year: selectedYear
            }
          }
        );
        console.log('Monthly Expense Response:', response.data);
        // Ensure we're getting a number and handle null/undefined
        const total = response.data.monthlyTotal;
        setMonthlyTotal(total != null ? parseFloat(total) : 0);
      } catch (err) {
        console.error('Error fetching monthly expense total:', err);
        setError('Failed to fetch monthly total');
      }
    };

    getMonthlyTotal();
  }, [selectedMonth, selectedYear]);

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value);
    setSelectedMonth(newMonth);
  };

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value);
    setSelectedYear(newYear);
  };

  const filteredExpenses = selectedCategory === 'all' 
    ? categoryExpenses 
    : categoryExpenses.filter(category => category.categoryID === parseInt(selectedCategory));

  const handleUpdateClick = (expense) => {
    navigate('/update-expense', { state: { expense } });
  };

  const handleDeleteClick = (expense) => {
    setExpenseToDelete(expense);
    setDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/expense-delete/${expenseToDelete.expenseID}/`);
      await fetchExpenses(); // Refresh the list
      setDialogOpen(false);
      setExpenseToDelete(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete expense");
    }
  };

  const handleDeleteCancel = () => {
    setDialogOpen(false);
    setExpenseToDelete(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortedExpenses = (expenses) => {
    if (!expenses) return [];
    
    return [...expenses].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle special cases
      if (sortConfig.key === 'date') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (sortConfig.key === 'amount') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
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

  const handleAddExpense = () => {
    navigate('/expenses'); // Navigate to the add expense page
  };

  const CalculateMonthlyButton = () => (
    <button 
      className="calculate-monthly-button"
      onClick={() => setIsMonthlyTotalOpen(true)}
    >
      <FaCalculator /> Calculate Monthly Expense
    </button>
  );

  if (loading) return <div className="loading">Loading expenses...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="expense-list-container">
      <BackButton />
      <h1 className="expense-list-title">Expense List</h1>

      <div className="filter-actions-row">
        <div className="category-filter">
          <label htmlFor="categoryFilter">Filter by Category:</label>
          <select
            id="categoryFilter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.categoryID} value={category.categoryID}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>
        <div className="action-buttons">
          <CalculateMonthlyButton />
          <button 
            className="add-expense-button"
            onClick={handleAddExpense}
          >
            <FaPlus /> Add Expense
          </button>
        </div>
      </div>

      {filteredExpenses.map((category) => (
        <div key={category.categoryID} className="category-section">
          <h2 className="category-title">
            {category.categoryName}
            <span className="category-total">
              Total: ${category.expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
            </span>
          </h2>
          
          <div className="expense-table-container">
            <table className="expense-table">
              <thead>
                <tr>
                  <th onClick={() => requestSort('date')} className="sortable-header">
                    Date {getSortIcon('date')}
                  </th>
                  <th onClick={() => requestSort('payeeDetail')} className="sortable-header">
                    Payee {getSortIcon('payeeDetail')}
                  </th>
                  <th onClick={() => requestSort('remarks')} className="sortable-header">
                    Remarks {getSortIcon('remarks')}
                  </th>
                  <th onClick={() => requestSort('amount')} className="sortable-header">
                    Amount {getSortIcon('amount')}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getSortedExpenses(category.expenses).map((expense) => (
                  <tr key={expense.expenseID}>
                    <td>{formatDate(expense.date)}</td>
                    <td>{expense.payeeDetail}</td>
                    <td>{expense.remarks || '-'}</td>
                    <td className="amount">${expense.amount.toFixed(2)}</td>
                    <td className="action-buttons">
                      <button 
                        className="icon-button edit"
                        onClick={() => handleUpdateClick(expense)}
                        title="Edit expense"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="icon-button delete"
                        onClick={() => handleDeleteClick(expense)}
                        title="Delete expense"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <ConfirmDialog
        isOpen={dialogOpen}
        title="Confirm Delete"
        message={`Are you sure you want to delete this expense of $${expenseToDelete?.amount.toFixed(2)} paid to ${expenseToDelete?.payeeDetail}?`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      <MonthlyTotalDialog
        isOpen={isMonthlyTotalOpen}
        onClose={() => setIsMonthlyTotalOpen(false)}
        title="Monthly Expense Total"
        total={monthlyTotal}
        month={selectedMonth}
        year={selectedYear}
        onMonthChange={setSelectedMonth}
        onYearChange={setSelectedYear}
        type="expense"
      />
    </div>
  );
};

export default ExpenseList;

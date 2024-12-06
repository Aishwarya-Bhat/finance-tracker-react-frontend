import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './IncomeList.css';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrashAlt, FaPlus, FaCalculator } from 'react-icons/fa';
import ConfirmDialog from '../common/ConfirmDialog';
import BackButton from '../common/BackButton';
import MonthlyTotalDialog from '../common/MonthlyTotalDialog';

const IncomeList = () => {
  const [sources, setSources] = useState([]);
  const [sourceIncomes, setSourceIncomes] = useState([]);
  const [selectedSource, setSelectedSource] = useState('all');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [incomeToDelete, setIncomeToDelete] = useState(null);
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({
    key: 'incomeDate',
    direction: 'descending'
  });
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [isMonthlyTotalOpen, setIsMonthlyTotalOpen] = useState(false);

  const fetchIncomes = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/incomes/');
      setSources(response.data.sources);
      setSourceIncomes(response.data.sourceIncomes);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch incomes');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  useEffect(() => {
    const getMonthlyTotal = async () => {
      try {
        const response = await axios.get(
          'http://127.0.0.1:8000/api/monthly-income/',
          {
            params: {
              month: selectedMonth,
              year: selectedYear
            }
          }
        );
        console.log('Monthly Income Response:......', response.data);
        const total = response.data.monthlyTotal;
        setMonthlyTotal(total != null ? parseFloat(total) : 0);
      } catch (err) {
        console.error('Error fetching monthly income total:', err);
        setError('Failed to fetch monthly total');
      }
    };

    getMonthlyTotal();
  }, [selectedMonth, selectedYear]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredIncomes = selectedSource === 'all' 
    ? sourceIncomes 
    : sourceIncomes.filter(source => source.sourceID === selectedSource);

  const handleUpdateClick = (income, sourceName) => {
    navigate('/update-income', { state: { income, sourceName } });
  };

  const handleDeleteClick = (income) => {
    setIncomeToDelete(income);
    setDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/income-delete/${incomeToDelete.incomeID}/`);
      await fetchIncomes();
      setDialogOpen(false);
      setIncomeToDelete(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete income");
    }
  };

  const handleDeleteCancel = () => {
    setDialogOpen(false);
    setIncomeToDelete(null);
  };

  const handleAddIncome = () => {
    navigate('/income');
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortedIncomes = (incomes) => {
    if (!incomes) return [];
    
    return [...incomes].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle special cases
      if (sortConfig.key === 'incomeDate') {
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

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value);
    setSelectedMonth(newMonth);
  };

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value);
    setSelectedYear(newYear);
  };

  const CalculateMonthlyButton = () => (
    <button 
      className="calculate-monthly-button"
      onClick={() => setIsMonthlyTotalOpen(true)}
    >
      <FaCalculator /> Calculate Monthly Income
    </button>
  );

  if (loading) return <div className="loading">Loading incomes...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="income-list-container">
      <BackButton />
      <h1 className="income-list-title">Income List</h1>

      <div className="filter-actions-row">
        <div className="source-filter">
          <label htmlFor="sourceFilter">Filter by Source:</label>
          <select
            id="sourceFilter"
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
          >
            <option value="all">All Sources</option>
            {sources.map(source => (
              <option key={source.sourceID} value={source.sourceID}>
                {source.sourceName}
              </option>
            ))}
          </select>
        </div>
        <div className="action-buttons">
          <CalculateMonthlyButton />
          <button 
            className="add-income-button"
            onClick={handleAddIncome}
          >
            <FaPlus /> Add Income
          </button>
        </div>
      </div>

      {filteredIncomes.map((source) => (
        <div key={source.sourceID} className="source-section">
          <h2 className="source-title">
            {source.sourceName}
            <span className="source-total">
              Total: ${source.incomes.reduce((sum, inc) => sum + inc.amount, 0).toFixed(2)}
            </span>
          </h2>
          
          <div className="income-table-container">
            <table className="income-table">
              <thead>
                <tr>
                  <th onClick={() => requestSort('incomeDate')} className="sortable-header">
                    Date {getSortIcon('incomeDate')}
                  </th>
                  <th onClick={() => requestSort('payerDetail')} className="sortable-header">
                    Payer {getSortIcon('payerDetail')}
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
                {getSortedIncomes(source.incomes).map((income, index) => (
                  <tr key={index}>
                    <td>{formatDate(income.incomeDate)}</td>
                    <td>{income.payerDetail}</td>
                    <td>{income.remarks || '-'}</td>
                    <td className="amount">${income.amount.toFixed(2)}</td>
                    <td className="action-buttons">
                      <button 
                        className="icon-button edit"
                        onClick={() => handleUpdateClick(income, source.sourceName)}
                        title="Edit income"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="icon-button delete"
                        onClick={() => handleDeleteClick(income)}
                        title="Delete income"
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
        message={`Are you sure you want to delete this income of $${incomeToDelete?.amount.toFixed(2)} from ${incomeToDelete?.payerDetail}?`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      <MonthlyTotalDialog
        isOpen={isMonthlyTotalOpen}
        onClose={() => setIsMonthlyTotalOpen(false)}
        title="Monthly Income Total"
        total={monthlyTotal}
        month={selectedMonth}
        year={selectedYear}
        onMonthChange={setSelectedMonth}
        onYearChange={setSelectedYear}
        type="income"
      />
    </div>
  );
};

export default IncomeList; 
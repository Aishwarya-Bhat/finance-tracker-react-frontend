import React from 'react';
import './MonthlyTotalDialog.css';
import { FaTimes } from 'react-icons/fa';

const MonthlyTotalDialog = ({ 
  isOpen, 
  onClose, 
  title,
  total,
  month,
  year,
  onMonthChange,
  onYearChange,
  type
}) => {
  if (!isOpen) return null;

  return (
    <div className="monthly-total-dialog-overlay">
      <div className="monthly-total-dialog">
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
        
        <div className="dialog-content">
          <h2>{title}</h2>
          
          <div className="period-selector">
            <div className="select-group">
              <label>Month:</label>
              <select 
                value={month}
                onChange={(e) => onMonthChange(parseInt(e.target.value))}
                className="month-select"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                  <option key={m} value={m}>
                    {new Date(2000, m - 1).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>

            <div className="select-group">
              <label>Year:</label>
              <select 
                value={year}
                onChange={(e) => onYearChange(parseInt(e.target.value))}
                className="year-select"
              >
                {[2023, 2024].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="total-amount">
            <span className="amount-label">Total:</span>
            <span className={`amount-value ${type}`}>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyTotalDialog; 
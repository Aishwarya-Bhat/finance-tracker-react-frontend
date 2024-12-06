import React from 'react';
import './DetailsModal.css';
import { FaTimes } from 'react-icons/fa';

const DetailsModal = ({ isOpen, onClose, log }) => {
  if (!isOpen) return null;

  // Parse details string to get amount if it exists
  const getAmount = () => {
    try {
      if (!log.details) return null;
      const details = JSON.parse(log.details);
      return details.amount || details.budgetAmount || null;
    } catch (e) {
      return null;
    }
  };

  const amount = getAmount();

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Action Details</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className="modal-body">
          <div className="detail-row">
            <span className="detail-label">Action Type:</span>
            <span className={`action-type ${log.actionType.toLowerCase()}`}>
              {log.actionType.charAt(0) + log.actionType.slice(1).toLowerCase()}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Table:</span>
            <span>{log.tableName.charAt(0).toUpperCase() + log.tableName.slice(1)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Date:</span>
            <span>{new Date(log.actionDate).toLocaleString()}</span>
          </div>
          {amount && (
            <div className="detail-row">
              <span className="detail-label">Amount:</span>
              <span className="amount-value">
                ${parseFloat(amount).toFixed(2)}
              </span>
            </div>
          )}
          <div className="detail-row">
            <span className="detail-label">Details:</span>
            <pre className="details-text">{log.details}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal; 
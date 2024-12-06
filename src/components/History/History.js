import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
import './History.css';
import DetailsModal from './DetailsModal';

const History = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [selectedLog, setSelectedLog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/audit-logs/');
        setAuditLogs(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch history');
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, []);

  const formatActionType = (type) => {
    return type.charAt(0) + type.slice(1).toLowerCase();
  };

  const formatTableName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const handleRowClick = (log) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  if (loading) return <div className="loading">Loading history...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="history-container">
      <div className="history-header">
        <button 
          className="back-to-dashboard"
          onClick={() => navigate('/dashboard')}
        >
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h1>History</h1>
      </div>

      <div className="history-table-container">
        <table className="history-table">
          <thead>
            <tr>
              <th>Action Type</th>
              <th>Table Name</th>
              <th>Action Date</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log, index) => (
              <tr 
                key={index} 
                onClick={() => handleRowClick(log)}
                className="clickable-row"
              >
                <td className={`action-type ${log.actionType.toLowerCase()}`}>
                  {formatActionType(log.actionType)}
                </td>
                <td>{formatTableName(log.tableName)}</td>
                <td>{new Date(log.actionDate).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DetailsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        log={selectedLog}
      />
    </div>
  );
};

export default History; 
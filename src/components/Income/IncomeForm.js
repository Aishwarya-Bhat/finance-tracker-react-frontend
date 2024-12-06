import React, { useState } from "react";
import axios from 'axios';

const IncomeForm = ({ onSuccess }) => {
    // Form State
    const [formData, setFormData] = useState({
        payerDetail: "",
        remarks: "",
        amount: "",
        sourceID: "S1" // Default value
    });
    const [error, setError] = useState("");

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
            await axios.post('http://127.0.0.1:8000/api/income/', formData);
            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add income');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{
            maxWidth: '500px',
            margin: '0 auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
        }}>
            {error && (
                <div style={{
                    color: '#dc3545',
                    backgroundColor: '#f8d7da',
                    padding: '10px',
                    borderRadius: '4px',
                    marginBottom: '20px'
                }}>
                    {error}
                </div>
            )}

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
            }}>
                <label>Payer Detail:</label>
                <input
                    type="text"
                    name="payerDetail"
                    value={formData.payerDetail}
                    onChange={handleChange}
                    required
                    style={{
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        boxShadow: '7px 7px 7px rgba(10, 157, 143, 0.3)'
                    }}
                />
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
            }}>
                <label>Remarks:</label>
                <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    style={{
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        boxShadow: '7px 7px 7px rgba(10, 157, 143, 0.3)',
                        minHeight: '100px'
                    }}
                />
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
            }}>
                <label>Amount:</label>
                <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    step="0.01"
                    min="0"
                    style={{
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        boxShadow: '7px 7px 7px rgba(10, 157, 143, 0.3)'
                    }}
                />
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
            }}>
                <label>Source Name:</label>
                <select
                    name="sourceID"
                    value={formData.sourceID}
                    onChange={handleChange}
                    style={{
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        boxShadow: '7px 7px 7px rgba(10, 157, 143, 0.3)'
                    }}
                >
                    <option value="S1">Capital Gains</option>
                    <option value="S2">Dividend Income</option>
                    <option value="S3">Earned Income</option>
                    <option value="S4">Interest Income</option>
                    <option value="S5">Others</option>
                    <option value="S6">Profit Income</option>
                    <option value="S7">Rental Income</option>
                    <option value="S8">Royalty Income</option>
                </select>
            </div>

            <button 
                type="submit"
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#0a9d8f',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(10, 157, 143, 0.1)',
                    marginTop: '10px'
                }}
            >
                Add Income
            </button>
        </form>
    );
};

export default IncomeForm;

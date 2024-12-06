import React from 'react';
import { BrowserRouter as Router, Route, Routes,Switch } from 'react-router-dom';
import Login from './components/login/Login';
import Dashboard from './components/dashboard/dashboard';
import IncomePage from './components/Income/IncomePage';
import ExpensePage from './components/Expense/ExpensePage';
import BudgetForm from './components/Budget/BudgetForm';
import BudgetList from './components/BudgetSummary/BudgetList';
import UpdateBudget from './components/BudgetSummary/UpdateBudget';
import ExpenseList from './components/Expense/ExpenseList';
import UpdateExpense from './components/Expense/UpdateExpense';
import IncomeList from './components/Income/IncomeList';
import UpdateIncome from './components/Income/UpdateIncome';
import Analysis from './components/Analysis/Analysis';
import History from './components/History/History';

function App() {
  return (
    <Router>
        <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/income" element={<IncomePage />} />
        <Route path="/expenses" element={<ExpensePage />} />
        <Route path="/budget" element={<BudgetForm />} /> 
        {/* working */}
        {/* <Route path="/budget-list" element={<BudgetList />} /> */}
        <Route path="/budgets" element={<BudgetList />} />
        <Route path="/update-budget" element={<UpdateBudget />} />
        <Route path="/expenses-list" element={<ExpenseList />} />
        <Route path="/update-expense" element={<UpdateExpense />} />
        <Route path="/incomes-list" element={<IncomeList />} />
        <Route path="/update-income" element={<UpdateIncome />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/history" element={<History />} />

      </Routes>
    </Router>
  );
}

export default App;


// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       {/* <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header> */}
      
//     </div>
//   );
// }

// export default App;

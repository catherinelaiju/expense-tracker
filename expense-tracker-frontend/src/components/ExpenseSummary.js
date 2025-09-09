import React from "react";
import "./ExpenseSummary.css";

function ExpenseSummary({ expenses }) {
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const count = expenses.length;
  const max = expenses.length > 0 ? Math.max(...expenses.map((exp) => exp.amount)) : 0;

  return (
    <div className="summary-card">
      <h2>Expense Summary</h2>
      <div className="summary-stats">
        <div className="stat">
          <span className="label">Total Spent</span>
          <span className="value">₹{total.toFixed(2)}</span>
        </div>
        <div className="stat">
          <span className="label">Number of Expenses</span>
          <span className="value">{count}</span>
        </div>
        <div className="stat">
          <span className="label">Biggest Expense</span>
          <span className="value">₹{max.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export default ExpenseSummary;

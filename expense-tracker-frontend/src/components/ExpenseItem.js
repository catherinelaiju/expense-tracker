// ExpenseItem.js
import React from "react";
import "./ExpenseItem.css";

function ExpenseItem({ expense, onDeleteExpense }) {
  return (
    <div className="expense-card">
      <div className="expense-details">
        <span className="expense-title">{expense.title}</span>
        <span className="expense-category">({expense.category})</span>
   <span className="expense-date">
  {new Date(expense.date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}
</span>

      </div>
      <span className="expense-amount">₹{expense.amount}</span>
      <button className="delete-btn" onClick={() => onDeleteExpense(expense.id)}>
        Delete
      </button>
    </div>
  );
}

export default ExpenseItem;

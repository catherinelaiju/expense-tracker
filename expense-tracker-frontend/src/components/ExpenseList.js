import React from "react";
import ExpenseItem from "./ExpenseItem"; // import reusable component
import "./ExpenseList.css";

function ExpenseList({ expenses, onDeleteExpense }) {
  return (
    <div className="expense-list">
      {expenses.length === 0 ? (
        <p className="empty">No expenses added yet.</p>
      ) : (
        expenses.map((expense) => (
          <ExpenseItem
            key={expense.id}
            expense={expense}
            onDeleteExpense={onDeleteExpense}
          />
        ))
      )}
    </div>
  );
}

export default ExpenseList;

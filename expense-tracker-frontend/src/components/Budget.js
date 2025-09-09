// Budget.js
import React, { useState } from "react";
import "./Budget.css";

function Budget({ expenses }) {
  const [budget, setBudget] = useState(0);

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const percentage = budget > 0 ? Math.min((totalSpent / budget) * 100, 100) : 0;

  return (
    <div className="budget-card">
      <h2>Monthly Budget</h2>

      <input
        type="number"
        placeholder="Set your budget (₹)"
        value={budget || ""}
        onChange={(e) => setBudget(Number(e.target.value))}
      />

      <div className="progress-bar">
        <div
          className={`progress-fill ${totalSpent > budget ? "over-budget" : ""}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      <p>
        Spent: ₹{totalSpent.toFixed(2)} / Budget: ₹{budget || 0}
      </p>
    </div>
  );
}

export default Budget;

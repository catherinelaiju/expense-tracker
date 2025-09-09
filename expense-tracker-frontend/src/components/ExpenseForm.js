// ExpenseForm.js
import React, { useState } from "react";
import "./ExpenseForm.css";

function ExpenseForm({ onAddExpense }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Other");
  const [date, setDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    const newExpense = {
      id: Date.now(),
      title,
      amount: parseFloat(amount),
      category,
      date: date ? date : new Date().toISOString().split("T")[0], // fallback to today
    };

    onAddExpense(newExpense); // ✅ send to App.js
    setTitle("");
    setAmount("");
    setCategory("Other");
    setDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <input
        type="text"
        placeholder="Expense Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount (₹)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="Food">🍔 Food</option>
        <option value="Travel">✈️ Travel</option>
        <option value="Shopping">🛍️ Shopping</option>
        <option value="Bills">📑 Bills</option>
        <option value="Other">📦 Other</option>
      </select>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button type="submit">Add Expense</button>
    </form>
  );
}

export default ExpenseForm;

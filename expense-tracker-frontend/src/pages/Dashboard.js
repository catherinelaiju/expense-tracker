// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import ExpenseSummary from "../components/ExpenseSummary";
import Budget from "../components/Budget";
import * as XLSX from "xlsx";
import { supabase } from "../supabaseClient"; // ✅ Import supabase client

function Dashboard({
  categories = ["All", "Food", "Travel", "Shopping", "Bills", "Other"],
}) {
  const [expenses, setExpenses] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [availableMonths, setAvailableMonths] = useState(["All"]);

  // ✅ Load only the current user's expenses
  const loadExpenses = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id) // only this user’s data
        .order("date", { ascending: false });

      if (error) throw error;
      setExpenses(data || []);

      // compute available months
      const months = new Set();
      (data || []).forEach((e) => {
        if (e.date) months.add(e.date.slice(0, 7));
      });
      setAvailableMonths([
        "All",
        ...Array.from(months).sort((a, b) => (a < b ? 1 : -1)),
      ]);
    } catch (err) {
      console.error("Load error:", err);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  // ✅ Add expense with user_id
  const addExpense = async (expense) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const payload = {
        title: expense.title,
        amount:
          typeof expense.amount === "number"
            ? expense.amount
            : parseFloat(expense.amount || 0),
        category: expense.category || "Other",
        date: expense.date || new Date().toISOString(),
        notes: expense.notes || null,
        user_id: user.id, // ✅ attach logged-in user
      };

      const { data, error } = await supabase
        .from("expenses")
        .insert([payload])
        .select();

      if (error) throw error;
      const created = data[0];

      // prepend new to UI
      setExpenses((prev) => [created, ...prev]);

      if (created.date) {
        const m = created.date.slice(0, 7);
        setAvailableMonths((prev) =>
          prev.includes(m) ? prev : ["All", m, ...prev.filter((x) => x !== "All")]
        );
      }
    } catch (err) {
      console.error("Add error:", err);
      alert("Failed to add expense. Check console.");
    }
  };

  // ✅ Delete expense
  const deleteExpense = async (id) => {
    try {
      const { error } = await supabase.from("expenses").delete().eq("id", id);
      if (error) throw error;
      setExpenses((prev) => prev.filter((e) => String(e.id) !== String(id)));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete expense.");
    }
  };

  // ✅ Clear all (user only deletes their rows because of policy)
  const clearAll = async () => {
    if (
      !window.confirm(
        "Clear ALL expenses? This will delete your data in Supabase."
      )
    )
      return;
    try {
      const { error } = await supabase.from("expenses").delete().neq("id", 0);
      if (error) throw error;
      setExpenses([]);
      setAvailableMonths(["All"]);
    } catch (err) {
      console.error("Clear all error:", err);
      alert("Failed to clear all.");
    }
  };

  // Filtering / search / sort for UI presentation (same as before)
  const filteredExpenses = () => {
    let list = [...expenses];
    if (filterCategory && filterCategory !== "All")
      list = list.filter((e) => e.category === filterCategory);
    if (selectedMonth && selectedMonth !== "All")
      list = list.filter(
        (e) => e.date && e.date.slice(0, 7) === selectedMonth
      );
    if (searchQuery && searchQuery.trim() !== "") {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((e) => String(e.title).toLowerCase().includes(q));
    }
    list.sort((a, b) => {
      if (sortOption === "newest")
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortOption === "oldest")
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortOption === "amountHigh") return b.amount - a.amount;
      if (sortOption === "amountLow") return a.amount - b.amount;
      return 0;
    });
    return list;
  };

  // Excel export stays same
  const exportExcel = () => {
    const rows = filteredExpenses().map((expense) => ({
      ID: "'" + expense.id,
      Title: expense.title,
      Amount: expense.amount,
      Category: expense.category,
      Date: expense.date
        ? new Date(expense.date).toLocaleDateString("en-GB")
        : "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
    worksheet["!cols"] = [
      { wch: 20 },
      { wch: 30 },
      { wch: 12 },
      { wch: 15 },
      { wch: 15 },
    ];
    XLSX.writeFile(
      workbook,
      `xpenzo_expenses_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  return (
    <div className="dashboard-wrapper">
      <h2 className="dashboard-title">📊 Your Dashboard</h2>
      <p className="dashboard-subtitle">
        Track, analyze, and manage your expenses with ease
      </p>

      <div className="filters card">
        <div>
          <label>Category: </label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Month: </label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {availableMonths.map((m) => (
              <option key={m} value={m}>
                {m === "All"
                  ? "All"
                  : new Date(m + "-01").toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Search: </label>
          <input
            type="text"
            placeholder="Search by title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div>
          <label>Sort: </label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="amountHigh">Amount: High → Low</option>
            <option value="amountLow">Amount: Low → High</option>
          </select>
        </div>
      </div>

      <div className="card">
        <h3>Add New Expense</h3>
        <ExpenseForm onAddExpense={addExpense} categories={categories} />
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <ExpenseSummary expenses={filteredExpenses()} />
        </div>
        <div className="card">
          <Budget expenses={expenses} />
        </div>
      </div>

      <div className="card">
        <h3>📌 Expense List</h3>
        <ExpenseList
          expenses={filteredExpenses()}
          onDeleteExpense={deleteExpense}
        />
      </div>

      <div className="actions">
        <button onClick={clearAll} className="btn danger">
          Clear All
        </button>
        <button onClick={exportExcel} className="btn primary">
          Export to Excel
        </button>
      </div>
    </div>
  );
}

export default Dashboard;

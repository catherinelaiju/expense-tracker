// src/App.js
import React, { useState, useEffect, useMemo } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import "./App.css";
import * as XLSX from "xlsx";

// Context + Components
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";

// Pages
import Analytics from "./pages/Analytics";
import Auth from "./pages/Auth";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  /* ----------------- Load from backend ----------------- */
  useEffect(() => {
    fetch("http://localhost:5000/expenses")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch expenses");
        return res.json();
      })
      .then((data) => {
        setExpenses(data);
      })
      .catch((err) => console.error("Error loading expenses:", err));
  }, []);

  /* ----------------- Handlers ----------------- */
  const addExpense = async (expense) => {
    try {
      const response = await fetch("http://localhost:5000/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expense),
      });

      if (!response.ok) throw new Error("Failed to add expense");
      const newExpense = await response.json();

      setExpenses((prev) => [newExpense, ...prev]);
    } catch (err) {
      console.error("Error adding expense:", err);
    }
  };

  const deleteExpense = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/expenses/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete expense");
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };

  const clearAll = async () => {
    try {
      await Promise.all(
        expenses.map((e) =>
          fetch(`http://localhost:5000/expenses/${e.id}`, { method: "DELETE" })
        )
      );
      setExpenses([]);
    } catch (err) {
      console.error("Error clearing expenses:", err);
    }
  };

  /* ----------------- Excel Export ----------------- */
  const exportExcel = () => {
    const worksheetData = expenses.map((expense) => ({
      ID: "'" + expense.id,
      Title: expense.title,
      Amount: expense.amount,
      Category: expense.category,
      Date: new Date(expense.date).toLocaleDateString("en-GB"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

    worksheet["!cols"] = [
      { wch: 20 },
      { wch: 20 },
      { wch: 10 },
      { wch: 15 },
      { wch: 15 },
    ];

    XLSX.writeFile(workbook, "expenses.xlsx");
  };

  /* ----------------- Derived Data ----------------- */
  const availableMonths = useMemo(() => {
    const monthsSet = new Set();
    expenses.forEach((e) => {
      if (e.date) monthsSet.add(e.date.slice(0, 7));
    });
    return ["All", ...Array.from(monthsSet).sort((a, b) => (a < b ? 1 : -1))];
  }, [expenses]);

  const visibleExpenses = useMemo(() => {
    let list = [...expenses];
    if (filterCategory !== "All")
      list = list.filter((e) => e.category === filterCategory);
    if (selectedMonth !== "All")
      list = list.filter((e) => e.date && e.date.slice(0, 7) === selectedMonth);
    if (searchQuery.trim() !== "") {
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
  }, [expenses, filterCategory, selectedMonth, searchQuery, sortOption]);

  const categories = ["All", "Food", "Travel", "Shopping", "Bills", "Other"];

  /* ----------------- Render ----------------- */
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />

          <main className="app-main">
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route
                path="/dashboard"
                element={
                  <Dashboard
                    expenses={visibleExpenses}
                    addExpense={addExpense}
                    deleteExpense={deleteExpense}
                    clearAll={clearAll}
                    exportExcel={exportExcel}
                    categories={categories}
                    filterCategory={filterCategory}
                    setFilterCategory={setFilterCategory}
                    availableMonths={availableMonths}
                    selectedMonth={selectedMonth}
                    setSelectedMonth={setSelectedMonth}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    sortOption={sortOption}
                    setSortOption={setSortOption}
                  />
                }
              />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/auth" element={<Auth />} />
            </Routes>
          </main>

          <footer className="app-footer">
            <p>© {new Date().getFullYear()} Xpenzo. All rights reserved.</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

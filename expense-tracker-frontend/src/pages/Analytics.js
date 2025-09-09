// src/pages/Analytics.js
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { supabase } from "../supabaseClient"; // ✅ use Supabase directly
import "./../App.css";

const COLORS = ["#2563eb", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];

// Month short names
const monthNames = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

const Analytics = () => {
  const [expenses, setExpenses] = useState([]);
  const [spendingData, setSpendingData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  // ✅ Load expenses for the logged-in user
  const loadExpenses = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return; // not logged in

      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id); // only this user’s expenses

      if (error) throw error;
      setExpenses(data || []);
    } catch (err) {
      console.error("Error fetching expenses:", err.message);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  // ✅ Derive chart data whenever expenses change
  useEffect(() => {
    if (!expenses || expenses.length === 0) {
      // empty state → 0 for all months
      setSpendingData(monthNames.map((m) => ({ month: m, expenses: 0 })));
      setCategoryData([]);
      return;
    }

    // Group by month
    const monthlyTotals = {};
    expenses.forEach((exp) => {
      const date = new Date(exp.date);
      if (isNaN(date.getTime())) return;
      const m = monthNames[date.getMonth()];
      monthlyTotals[m] = (monthlyTotals[m] || 0) + Number(exp.amount || 0);
    });

    const monthlyData = monthNames.map((m) => ({
      month: m,
      expenses: monthlyTotals[m] || 0,
    }));
    setSpendingData(monthlyData);

    // Group by category
    const categoryTotals = {};
    expenses.forEach((exp) => {
      const cat = exp.category || "Other";
      categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(exp.amount || 0);
    });
    const categoryArr = Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
    }));
    setCategoryData(categoryArr);
  }, [expenses]);

  return (
    <div className="dashboard-container">
      <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
        Expense Analytics
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
        }}
      >
        <div className="feature-card">
          <h3>Monthly Spending Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={spendingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="feature-card">
          <h3>Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {categoryData.map((entry, idx) => (
                  <Cell
                    key={`c-${idx}`}
                    fill={COLORS[idx % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

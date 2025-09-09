// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Root test
app.get("/", (req, res) => {
  res.send("Welcome to Expense Tracker API 🚀");
});

// GET /expenses -> return all expenses (newest first)
app.get("/expenses", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching expenses:", error);
      return res.status(500).json({ error: error.message || error });
    }
    res.json(data || []);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /expenses -> create a new expense
app.post("/expenses", async (req, res) => {
  try {
    const { title, amount, category, date, notes } = req.body || {};
    // minimal validation
    if (!title || amount === undefined) {
      return res.status(400).json({ error: "title and amount are required" });
    }

    const payload = {
      title,
      amount,
      category: category || "Other",
      date: date || new Date().toISOString(),
      notes: notes || null,
    };

    const { data, error } = await supabase
      .from("expenses")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("Error inserting expense:", error);
      return res.status(500).json({ error: error.message || error });
    }

    res.status(201).json(data);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /expenses/:id -> update an expense
app.put("/expenses/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { title, amount, category, date, notes } = req.body || {};

    const { data, error } = await supabase
      .from("expenses")
      .update({ title, amount, category, date, notes })
      .eq("id", id)
      .select();

    if (error) throw error;
    res.json(data && data[0] ? data[0] : {});
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: err.message || "Update failed" });
  }
});

// DELETE /expenses/:id -> delete an expense
app.delete("/expenses/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { error } = await supabase.from("expenses").delete().eq("id", id);

    if (error) {
      console.error("Delete error:", error);
      return res.status(500).json({ error: error.message || error });
    }
    res.json({ message: `Expense ${id} deleted` });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

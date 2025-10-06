# 💸 Xpenzo – Smart Expense Tracker

A full-stack expense tracking web app that helps users manage their finances with ease.  
Built with **React, Node.js, Express, Supabase**, and deployed on **Netlify + Render** for a seamless experience.  

---

## 🚀 Live Demo
👉 Try it here: [Xpenzo Live Demo](https://thriving-khapse-e6956f.netlify.app/)

---

## ✨ Features
- 🔐 **Secure Authentication** – User sign-up/login with Supabase auth (per-user isolated data)  
- 📊 **Analytics Dashboard** – Category-wise expense breakdown with charts  
- 🔎 **Advanced Search & Filters** – Quickly find transactions by category, amount, or keyword  
- 📂 **Excel Export** – Export transactions for offline record-keeping  
- ⚡ **Real-time Expense Management** – Add, edit, and delete expenses instantly  
- 📱 **Responsive UI** – Smooth and modern design across desktop & mobile  

---

## 🛠 Tech Stack
**Frontend:** React, CSS, JavaScript  
**Backend:** Node.js, Express  
**Database & Auth:** Supabase (PostgreSQL + Auth)  
**Deployment:** Netlify (frontend), Render (backend)  

---

## 📐 Architecture
1. **Frontend (React)**  
   - Handles user interactions, authentication flows, and expense management UI.  
   - Connects to backend & Supabase through REST API calls.  

2. **Backend (Node.js + Express)**  
   - Manages API endpoints for expenses, categories, and exports.  
   - Handles business logic like filtering and analytics.  

3. **Supabase**  
   - Provides authentication (email/password login).  
   - Stores expenses in PostgreSQL with per-user isolation.  

4. **Deployment**  
   - **Frontend:** Hosted on Netlify (fast static delivery + build pipeline).  
   - **Backend:** Hosted on Render (scalable, always-on backend API).  

---

## 📂 Project Structure
expense-tracker/

│── backend/ # Node.js + Express server

│── expense-tracker-frontend/ # React frontend

│── public/ # Static assets

│── README.md # Documentation

---

## ⚡ Setup & Installation
1. Clone the repository:
   
    git clone https://github.com/yourusername/expense-tracker.git
   
    cd expense-tracker

   
3. Install dependencies (frontend & backend):

    cd backend && npm install

    cd ../expense-tracker-frontend && npm install


3. Add your Supabase credentials in .env:

    REACT_APP_SUPABASE_URL=your_supabase_url

    REACT_APP_SUPABASE_KEY=your_supabase_key


4. Run locally:

# Backend
   cd backend

   npm run dev

# Frontend
   cd expense-tracker-frontend

   npm start

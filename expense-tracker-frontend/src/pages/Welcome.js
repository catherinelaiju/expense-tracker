// src/pages/Welcome.js
import React from "react";
import { Link } from "react-router-dom";
import "./Welcome.css";

function Welcome() {
  return (
    <div className="welcome">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Take Control of Your <span className="highlight">Expenses</span>
          </h1>
          <p className="tagline">
            Xpenzo helps you track, analyze, and optimize your spending —
            making budgeting effortless and smart. 
          </p>
          <div className="hero-buttons">
            <Link to="/dashboard" className="btn primary">
              Get Started →
            </Link>
            <Link to="/analytics" className="btn secondary">
              View Analytics
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="/assets/pre.png" alt="App Preview" />
        </div>
      </section>

      {/* Why Choose Xpenzo Section */}
<section style={{ padding: "50px 20px", textAlign: "center" }}>
  <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "30px" }}>
    Why Choose Xpenzo?
  </h2>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "20px",
      maxWidth: "1000px",
      margin: "0 auto",
    }}
  >
    <div className="feature-card">
      <h3>📊 Smart Analytics</h3>
      <p>Visualize your expenses with charts and trends that help you save more.</p>
    </div>

    <div className="feature-card">
      <h3>🔥 Budget Tracking</h3>
      <p>Set monthly budgets and stay in control of your spending habits.</p>
    </div>

    <div className="feature-card">
      <h3>⚡ Simple & Fast</h3>
      <p>A modern, lightweight, and intuitive interface designed for everyone.</p>
    </div>
  </div>
</section>


      {/* CTA Section */}
      <section className="cta">
        <h2>Ready to Save Smarter?</h2>
        <p>Join Xpenzo today and make every rupee count 💸</p>
        <Link to="/auth" className="btn primary big">
          Create Free Account →
        </Link>
      </section>
    </div>
  );
}

export default Welcome;

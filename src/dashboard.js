import React from "react";
import "./index.css";  // Optional: You can create and link a CSS file for styling

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <h1>Welcome to the Dashboard</h1>
      <div className="dashboard-cards">
        <div className="card">
          <h3>Total Users</h3>
          <p>150</p>
        </div>
        <div className="card">
          <h3>Orders Today</h3>
          <p>35</p>
        </div>
        <div className="card">
          <h3>Pending Tickets</h3>
          <p>5</p>
        </div>
      </div>
      <div className="dashboard-actions">
        <button>View Reports</button>
        <button>Manage Users</button>
      </div>
    </div>
  );
}

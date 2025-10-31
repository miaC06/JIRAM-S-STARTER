import React from "react";
import { API_BASE_URL } from "../config/api";
import { API_ROUTES } from "../services/api";

export default function ApiDebug() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>🔍 API Debug Panel</h1>
      <p>Base URL: <strong>{API_BASE_URL}</strong></p>

      <table border="1" cellPadding="8" style={{ width: "100%", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>Category</th>
            <th>Endpoints</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(API_ROUTES).map(([category, routes]) => (
            <tr key={category}>
              <td>{category}</td>
              <td>
                {routes.map((route, idx) => (
                  <div key={idx}>{route}</div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

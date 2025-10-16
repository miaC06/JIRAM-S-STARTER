import React from "react";

export default function Schedule() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">🗓️ Court Schedule</h2>
      <p className="text-gray-600 mb-6">View and manage the court’s calendar.</p>

      <div className="bg-white shadow-lg rounded-xl p-6">
        <ul className="space-y-3">
          <li className="p-3 bg-gray-100 rounded-lg">
            <strong>Case 2001:</strong> Hearing on 25th Sep, 2025 at 10:00 AM
          </li>
          <li className="p-3 bg-gray-100 rounded-lg">
            <strong>Case 2002:</strong> Judgment on 28th Sep, 2025 at 2:00 PM
          </li>
        </ul>
      </div>
    </div>
  );
}

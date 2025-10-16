// src/pages/prosecutor/MyCases.js
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function MyCases() {
  const [search, setSearch] = useState("");

  // Example case list (replace with backend data later)
  const cases = [
    { id: "001", title: "State vs. Doe", status: "Open" },
    { id: "002", title: "State vs. Smith", status: "Hearing Scheduled" },
    { id: "003", title: "State vs. Johnson", status: "Closed" },
  ];

  // Filter cases based on search
  const filteredCases = cases.filter(
    (c) =>
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.status.toLowerCase().includes(search.toLowerCase())
  );

  // Status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case "Open":
        return (
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
            Open
          </span>
        );
      case "Hearing Scheduled":
        return (
          <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">
            Hearing Scheduled
          </span>
        );
      case "Closed":
        return (
          <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">
            Closed
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📂 My Cases</h2>
      <p className="text-gray-600 mb-6">
        Below is a list of cases assigned to you as a prosecutor.
      </p>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Search cases..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Cases Table */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4">Case ID</th>
              <th className="p-4">Title</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.length > 0 ? (
              filteredCases.map((c) => (
                <tr key={c.id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-4 font-medium">{c.id}</td>
                  <td className="p-4">{c.title}</td>
                  <td className="p-4">{getStatusBadge(c.status)}</td>
                  <td className="p-4">
                    <Link
                      to={`/prosecutor/cases/${c.id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="p-6 text-center text-gray-500 italic"
                >
                  No cases found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// src/pages/prosecutor/Hearings.js
import React, { useState } from "react";

export default function Hearings() {
  const [search, setSearch] = useState("");
  const [hearings, setHearings] = useState([
    {
      id: 1,
      caseTitle: "State vs. Doe",
      date: "2025-09-28",
      courtroom: "Courtroom 3",
      status: "Scheduled",
      judge: "Hon. Justice Amina",
    },
    {
      id: 2,
      caseTitle: "State vs. Smith",
      date: "2025-10-10",
      courtroom: "Courtroom 1",
      status: "Scheduled",
      judge: "Hon. Justice Kamau",
    },
    {
      id: 3,
      caseTitle: "State vs. Patel",
      date: "2025-08-20",
      courtroom: "Courtroom 2",
      status: "Completed",
      judge: "Hon. Justice Mwangi",
    },
  ]);

  const filteredHearings = hearings.filter(
    (h) =>
      h.caseTitle.toLowerCase().includes(search.toLowerCase()) ||
      h.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📅 Hearings</h2>
      <p className="text-gray-600 mb-6">
        Track all scheduled, completed, or pending hearings for your cases.
      </p>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔎 Search by case or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Hearings Table */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4">Case</th>
              <th className="p-4">Date</th>
              <th className="p-4">Courtroom</th>
              <th className="p-4">Judge</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredHearings.length > 0 ? (
              filteredHearings.map((h) => (
                <tr key={h.id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-4 font-medium">{h.caseTitle}</td>
                  <td className="p-4">{h.date}</td>
                  <td className="p-4">{h.courtroom}</td>
                  <td className="p-4">{h.judge}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${
                        h.status === "Scheduled"
                          ? "bg-blue-100 text-blue-700"
                          : h.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {h.status}
                    </span>
                  </td>
                  <td className="p-4 flex gap-3">
                    <button className="text-blue-600 hover:underline">
                      View Case
                    </button>
                    <button className="text-green-600 hover:underline">
                      Add Notes
                    </button>
                    <button className="text-orange-600 hover:underline">
                      Request Reschedule
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="p-6 text-center text-gray-500 italic"
                >
                  No hearings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

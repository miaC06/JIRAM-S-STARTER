import React from "react";

export default function Documents() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📂 Court Documents</h2>
      <p className="text-gray-600 mb-6">Manage official court-issued documents.</p>

      <div className="bg-white shadow-lg rounded-xl p-6">
        <ul className="space-y-3">
          <li className="p-3 bg-gray-100 rounded-lg flex justify-between">
            <span>Judgment Report - Case 2001</span>
            <button className="text-blue-600 hover:underline">Download</button>
          </li>
          <li className="p-3 bg-gray-100 rounded-lg flex justify-between">
            <span>Summons - Case 2002</span>
            <button className="text-blue-600 hover:underline">Download</button>
          </li>
        </ul>
      </div>
    </div>
  );
}

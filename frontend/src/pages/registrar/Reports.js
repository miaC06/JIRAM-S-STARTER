import React from "react";

export default function Reports() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Reports</h2>
      <p className="text-gray-600 mb-6">Generate case, payment, and hearing reports.</p>

      <div className="bg-white shadow-lg rounded-xl p-6 space-y-4">
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
          Generate Case Report
        </button>
        <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
          Generate Payment Report
        </button>
        <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
          Generate Hearing Report
        </button>
      </div>
    </div>
  );
}

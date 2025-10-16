import React from "react";

export default function HearingManagement() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📅 Hearing Management</h2>
      <p className="text-gray-600 mb-6">Schedule, reschedule, or cancel hearings.</p>

      <div className="bg-white shadow-lg rounded-xl p-6">
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Case ID</label>
            <input
              type="text"
              placeholder="Enter case ID"
              className="w-full border rounded-lg p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Hearing Date</label>
            <input type="date" className="w-full border rounded-lg p-2" />
          </div>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Save Hearing
          </button>
        </form>
      </div>
    </div>
  );
}

import React from "react";

export default function CaseAssignments() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📂 Case Assignments</h2>
      <p className="text-gray-600 mb-6">Assign cases to judges and prosecutors.</p>

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
            <label className="block text-gray-700 font-semibold mb-2">Assign To</label>
            <select className="w-full border rounded-lg p-2">
              <option>Judge</option>
              <option>Prosecutor</option>
            </select>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Assign Case
          </button>
        </form>
      </div>
    </div>
  );
}

import React from "react";

export default function CaseRegistry() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📑 Case Registry</h2>
      <p className="text-gray-600 mb-6">Browse and manage all registered cases.</p>

      <div className="bg-white shadow-lg rounded-xl p-6">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Case ID</th>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-4">2001</td>
              <td className="p-4">Property Dispute</td>
              <td className="p-4">Active</td>
              <td className="p-4 text-blue-600 hover:underline cursor-pointer">View</td>
            </tr>
            <tr className="border-t">
              <td className="p-4">2002</td>
              <td className="p-4">Theft Case</td>
              <td className="p-4">Closed</td>
              <td className="p-4 text-blue-600 hover:underline cursor-pointer">View</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

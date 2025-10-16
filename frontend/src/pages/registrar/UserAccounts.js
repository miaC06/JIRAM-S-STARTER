import React from "react";

export default function UserAccounts() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">👤 User Accounts</h2>
      <p className="text-gray-600 mb-6">Manage system accounts for all roles.</p>

      <div className="bg-white shadow-lg rounded-xl p-6">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">User ID</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-4">1001</td>
              <td className="p-4">Jane Doe</td>
              <td className="p-4">Judge</td>
              <td className="p-4 text-blue-600 hover:underline cursor-pointer">Edit</td>
            </tr>
            <tr className="border-t">
              <td className="p-4">1002</td>
              <td className="p-4">John Smith</td>
              <td className="p-4">Prosecutor</td>
              <td className="p-4 text-blue-600 hover:underline cursor-pointer">Edit</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

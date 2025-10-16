import React from "react";

export default function Payments() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">💳 Payments</h2>
      <p className="text-gray-600 mb-6">Track and manage payment transactions.</p>

      <div className="bg-white shadow-lg rounded-xl p-6">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Payment ID</th>
              <th className="p-4 text-left">Case ID</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-4">P1001</td>
              <td className="p-4">2001</td>
              <td className="p-4">$150</td>
              <td className="p-4 text-green-600">Paid</td>
            </tr>
            <tr className="border-t">
              <td className="p-4">P1002</td>
              <td className="p-4">2002</td>
              <td className="p-4">$200</td>
              <td className="p-4 text-red-600">Pending</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

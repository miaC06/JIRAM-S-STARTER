// src/pages/prosecutor/Evidence.js
import React, { useState } from "react";

export default function Evidence() {
  const [search, setSearch] = useState("");
  const [evidenceList, setEvidenceList] = useState([
    {
      id: "EV001",
      caseId: "001",
      title: "CCTV Footage",
      type: "Video",
      date: "2025-09-10",
      description: "Footage from nearby shop camera.",
    },
    {
      id: "EV002",
      caseId: "002",
      title: "Witness Statement",
      type: "Document",
      date: "2025-09-12",
      description: "Signed statement from key witness.",
    },
  ]);

  const [newEvidence, setNewEvidence] = useState({
    title: "",
    type: "",
    description: "",
  });

  // Filtered evidence
  const filteredEvidence = evidenceList.filter(
    (ev) =>
      ev.title.toLowerCase().includes(search.toLowerCase()) ||
      ev.caseId.toLowerCase().includes(search.toLowerCase()) ||
      ev.type.toLowerCase().includes(search.toLowerCase())
  );

  // Handle new evidence submission
  const handleAddEvidence = (e) => {
    e.preventDefault();
    if (!newEvidence.title || !newEvidence.type) return;

    const newItem = {
      id: `EV${String(evidenceList.length + 1).padStart(3, "0")}`,
      caseId: "001", // This would come from case context or selection
      ...newEvidence,
      date: new Date().toISOString().split("T")[0],
    };

    setEvidenceList([...evidenceList, newItem]);
    setNewEvidence({ title: "", type: "", description: "" });
  };

  // Handle delete
  const handleDelete = (id) => {
    setEvidenceList(evidenceList.filter((ev) => ev.id !== id));
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        🔍 Evidence Management
      </h2>
      <p className="text-gray-600 mb-6">
        View, upload, edit, and manage evidence linked to cases.
      </p>

      {/* Search bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔎 Search evidence..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Evidence List */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-10">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Case</th>
              <th className="p-4">Title</th>
              <th className="p-4">Type</th>
              <th className="p-4">Date</th>
              <th className="p-4">Description</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvidence.length > 0 ? (
              filteredEvidence.map((ev) => (
                <tr
                  key={ev.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-medium">{ev.id}</td>
                  <td className="p-4">{ev.caseId}</td>
                  <td className="p-4">{ev.title}</td>
                  <td className="p-4">{ev.type}</td>
                  <td className="p-4">{ev.date}</td>
                  <td className="p-4 text-gray-600">{ev.description}</td>
                  <td className="p-4 flex gap-3">
                    <button className="text-blue-600 hover:underline">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ev.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                    <button className="text-green-600 hover:underline">
                      Download
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="p-6 text-center text-gray-500 italic"
                >
                  No evidence found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add New Evidence */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">📥 Upload New Evidence</h3>
        <form onSubmit={handleAddEvidence}>
          <input
            type="text"
            placeholder="Evidence Title"
            value={newEvidence.title}
            onChange={(e) =>
              setNewEvidence({ ...newEvidence, title: e.target.value })
            }
            className="mb-4 block w-full border rounded-lg p-2 text-gray-600"
            required
          />
          <select
            value={newEvidence.type}
            onChange={(e) =>
              setNewEvidence({ ...newEvidence, type: e.target.value })
            }
            className="mb-4 block w-full border rounded-lg p-2 text-gray-600"
            required
          >
            <option value="">Select Type</option>
            <option value="Document">Document</option>
            <option value="Image">Image</option>
            <option value="Video">Video</option>
            <option value="Audio">Audio</option>
          </select>
          <textarea
            placeholder="Description"
            value={newEvidence.description}
            onChange={(e) =>
              setNewEvidence({ ...newEvidence, description: e.target.value })
            }
            className="mb-4 block w-full border rounded-lg p-2 text-gray-600"
            rows="3"
          ></textarea>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Add Evidence
          </button>
        </form>
      </div>
    </div>
  );
}

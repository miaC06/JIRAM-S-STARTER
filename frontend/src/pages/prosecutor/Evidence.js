import React, { useEffect, useState } from "react";
import api from "../../api";
import { Spinner, Alert, Button } from "react-bootstrap";

export default function Evidence() {
  // --------------------------
  // STATE MANAGEMENT
  // --------------------------
  const [search, setSearch] = useState("");
  const [evidenceList, setEvidenceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const [newEvidence, setNewEvidence] = useState({
    caseId: "",
    title: "",
    type: "",
    description: "",
    file: null,
  });

  // --------------------------
  // FETCH EVIDENCE FROM BACKEND
  // --------------------------
  useEffect(() => {
    const fetchEvidence = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch all cases (prosecutor view)
        const caseRes = await api.get("/cases/");
        const cases = caseRes.data || [];

        // For each case, fetch its evidence
        const evidencePromises = cases.map((c) =>
          api
            .get(`/evidence/${c.id}`)
            .then((res) =>
              (res.data || []).map((ev) => ({
                ...ev,
                caseId: c.id,
                caseTitle: c.title,
              }))
            )
            .catch(() => [])
        );

        const evidenceArrays = await Promise.all(evidencePromises);
        const combined = evidenceArrays.flat();

        setEvidenceList(combined);
      } catch (err) {
        console.error("❌ Failed to fetch evidence:", err);
        setError("Unable to fetch evidence from the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvidence();
  }, []);

  // --------------------------
  // FILTERED RESULTS
  // --------------------------
  const filteredEvidence = evidenceList.filter(
    (ev) =>
      ev.title?.toLowerCase().includes(search.toLowerCase()) ||
      ev.caseId?.toString().includes(search.toLowerCase()) ||
      ev.type?.toLowerCase().includes(search.toLowerCase()) ||
      ev.description?.toLowerCase().includes(search.toLowerCase())
  );

  // --------------------------
  // HANDLE FILE UPLOAD
  // --------------------------
  const handleAddEvidence = async (e) => {
    e.preventDefault();
    if (!newEvidence.caseId || !newEvidence.title || !newEvidence.type) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("case_id", newEvidence.caseId);
      formData.append("title", newEvidence.title);
      formData.append("type", newEvidence.type);
      formData.append("description", newEvidence.description || "");
      if (newEvidence.file) formData.append("file", newEvidence.file);

      const res = await api.post("/evidence/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setEvidenceList((prev) => [...prev, res.data]);
      alert("✅ Evidence uploaded successfully!");

      setNewEvidence({
        caseId: "",
        title: "",
        type: "",
        description: "",
        file: null,
      });
    } catch (err) {
      console.error("❌ Upload failed:", err);
      alert("Failed to upload evidence. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // --------------------------
  // HANDLE DELETE
  // --------------------------
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this evidence?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/evidence/${id}`);
      setEvidenceList((prev) => prev.filter((ev) => ev.id !== id));
      alert("🗑️ Evidence deleted successfully.");
    } catch (err) {
      console.error("❌ Delete failed:", err);
      alert("Failed to delete evidence. Please try again.");
    }
  };

  // --------------------------
  // RENDER UI
  // --------------------------
  if (loading)
    return (
      <div className="flex flex-col items-center mt-20">
        <Spinner animation="border" />
        <p className="text-gray-500 mt-2">Loading evidence...</p>
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        🔍 Evidence Management
      </h2>
      <p className="text-gray-600 mb-6">
        View, upload, and manage all case evidence. Prosecutor access only.
      </p>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔎 Search evidence..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Evidence Table */}
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
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvidence.length > 0 ? (
              filteredEvidence.map((ev, i) => (
                <tr key={ev.id || i} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium">{ev.id || "—"}</td>
                  <td className="p-4">
                    {ev.caseTitle || `Case #${ev.caseId}`}
                  </td>
                  <td className="p-4">{ev.title}</td>
                  <td className="p-4">{ev.type}</td>
                  <td className="p-4">
                    {ev.date
                      ? new Date(ev.date).toLocaleDateString()
                      : "Unknown"}
                  </td>
                  <td className="p-4 text-gray-600">
                    {ev.description || "—"}
                  </td>
                  <td className="p-4 flex justify-center gap-3">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(ev.id)}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() =>
                        window.open(ev.file_url || "#", "_blank")
                      }
                    >
                      Download
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-500 italic">
                  No evidence found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Upload Form */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">📥 Upload New Evidence</h3>
        <form onSubmit={handleAddEvidence}>
          <input
            type="text"
            placeholder="Case ID"
            value={newEvidence.caseId}
            onChange={(e) =>
              setNewEvidence({ ...newEvidence, caseId: e.target.value })
            }
            className="mb-4 block w-full border rounded-lg p-2 text-gray-600"
            required
          />

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

          <input
            type="file"
            onChange={(e) =>
              setNewEvidence({ ...newEvidence, file: e.target.files[0] })
            }
            className="mb-4 block w-full border rounded-lg p-2 text-gray-600"
            accept=".pdf,.doc,.docx,.jpg,.png,.mp4,.mp3"
          />

          <Button
            type="submit"
            disabled={uploading}
            className={`${
              uploading ? "opacity-50 cursor-not-allowed" : ""
            } bg-success text-white px-4 py-2 rounded-lg`}
          >
            {uploading ? "Uploading..." : "Add Evidence"}
          </Button>
        </form>
      </div>
    </div>
  );
}

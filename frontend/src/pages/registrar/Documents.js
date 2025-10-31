import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Spinner,
  Form,
  Alert,
} from "react-bootstrap";
import api from "../../api"; // ✅ Axios instance with baseURL + token support
import { useAuth } from "../../auth/AuthContext"; // ✅ For logged-in user & token

export default function Documents() {
  const { user, token } = useAuth();

  // ---------------------------
  // STATE MANAGEMENT
  // ---------------------------
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [caseId, setCaseId] = useState("");

  // ---------------------------
  // FETCH ALL DOCUMENTS
  // ---------------------------
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const res = await api.get("/documents/"); // ✅ If you want all documents
        setDocuments(res.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch documents:", err);
        setError("Failed to load documents from server.");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  // ---------------------------
  // UPLOAD DOCUMENT
  // ---------------------------
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file || !caseId.trim()) {
      alert("⚠️ Please select a file and enter a valid case ID.");
      return;
    }

    const formData = new FormData();
    formData.append("case_id", caseId);
    formData.append("description", description || "Uploaded by registrar");
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await api.post("/documents/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setDocuments((prev) => [res.data, ...prev]);
      setFile(null);
      setDescription("");
      setCaseId("");
      alert("✅ Document uploaded successfully!");
    } catch (err) {
      console.error("❌ Upload failed:", err.response?.data || err);
      setError("Upload failed. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  // ---------------------------
  // DOWNLOAD DOCUMENT
  // ---------------------------
  const handleDownload = async (docId, filename) => {
    try {
      const res = await api.get(`/documents/${docId}`, {
        responseType: "blob", // important for file download
        headers: { Authorization: `Bearer ${token}` },
      });

      // Create a download link dynamically
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("❌ Download failed:", err);
      alert("Failed to download document.");
    }
  };

  // ---------------------------
  // DELETE DOCUMENT
  // ---------------------------
  const handleDelete = async (docId) => {
    if (!window.confirm("Delete this document?")) return;
    try {
      await api.delete(`/documents/${docId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocuments((prev) => prev.filter((doc) => doc.id !== docId));
      alert("🗑️ Document deleted successfully.");
    } catch (err) {
      console.error("❌ Delete failed:", err);
      alert("Failed to delete document.");
    }
  };

  // ---------------------------
  // UI: LOADING / ERROR STATES
  // ---------------------------
  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="text-muted mt-2">Loading documents...</p>
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;

  // ---------------------------
  // MAIN UI
  // ---------------------------
  return (
    <Container className="mt-4">
      <Row>
        <Col md={5}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Header className="bg-primary text-white fw-bold">
              📤 Upload New Document
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleUpload}>
                <Form.Group className="mb-3">
                  <Form.Label>Case ID</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter case ID"
                    value={caseId}
                    onChange={(e) => setCaseId(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter short description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>File</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="success"
                  className="w-100"
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload Document"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={7}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-info text-white fw-bold">
              📂 Court Documents
            </Card.Header>
            <Card.Body>
              {documents.length === 0 ? (
                <p className="text-muted text-center">
                  No documents available yet.
                </p>
              ) : (
                <Table bordered hover responsive className="align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Filename</th>
                      <th>Case ID</th>
                      <th>Uploaded At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc, i) => (
                      <tr key={doc.id}>
                        <td>{i + 1}</td>
                        <td>{doc.filename}</td>
                        <td>{doc.case_id}</td>
                        <td>
                          {new Date(doc.uploaded_at).toLocaleString() || "—"}
                        </td>
                        <td>
                          <div className="d-flex gap-2 flex-wrap">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() =>
                                handleDownload(doc.id, doc.filename)
                              }
                            >
                              ⬇️ Download
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete(doc.id)}
                            >
                              🗑️ Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

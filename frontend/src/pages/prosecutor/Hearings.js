// src/pages/registrar/Hearings.js
// ============================================================
// 📅 Hearings Management Page
// Registrar schedules, edits, and cancels hearings.
// Endpoints used: /hearings/, /hearings/{hearing_id}
// ============================================================

import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Spinner,
  Alert,
  Badge,
  Modal,
  Form,
  Card,
} from "react-bootstrap";
import API from "../../config/api"; // ✅ use centralized API instance
import { useAuth } from "../../auth/AuthContext"; // ✅ Auth context for registrar info

export default function Hearings() {
  // ------------------------------
  // CONTEXT & STATE
  // ------------------------------
  const { user } = useAuth();
  const [hearings, setHearings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedHearing, setSelectedHearing] = useState(null);

  const [formData, setFormData] = useState({
    case_id: "",
    scheduled_date: "",
    location: "",
    registrar_email: "",
    judge_id: "",
    notes: "",
  });

  // ------------------------------
  // FETCH HEARINGS
  // ------------------------------
  useEffect(() => {
    const fetchHearings = async () => {
      try {
        setLoading(true);
        const res = await API.api.get("/hearings/");
        setHearings(res.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch hearings:", err);
        setError(
          err.response?.data?.detail ||
            "Unable to fetch hearings from the server."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHearings();
  }, []);

  // ------------------------------
  // AUTO-FILL REGISTRAR EMAIL
  // ------------------------------
  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({ ...prev, registrar_email: user.email }));
    }
  }, [user]);

  // ------------------------------
  // FORM HANDLERS
  // ------------------------------
  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const openModal = (hearing = null) => {
    if (hearing) {
      setIsEditing(true);
      setSelectedHearing(hearing);
      setFormData({
        case_id: hearing.case_id || "",
        scheduled_date: hearing.scheduled_date
          ? new Date(hearing.scheduled_date).toISOString().slice(0, 16)
          : "",
        location: hearing.location || "",
        registrar_email: hearing.registrar_name || user?.email || "",
        judge_id: hearing.judge_id || "",
        notes: hearing.notes || "",
      });
    } else {
      setIsEditing(false);
      setSelectedHearing(null);
      setFormData({
        case_id: "",
        scheduled_date: "",
        location: "",
        registrar_email: user?.email || "",
        judge_id: "",
        notes: "",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setSelectedHearing(null);
  };

  // ------------------------------
  // ADD HEARING
  // ------------------------------
  const handleAddHearing = async () => {
    if (!formData.case_id || !formData.scheduled_date || !formData.location) {
      alert("⚠️ Please fill all required fields.");
      return;
    }

    const payload = {
      case_id: Number(formData.case_id),
      scheduled_date: new Date(formData.scheduled_date).toISOString(),
      location: formData.location.trim(),
      registrar_email: formData.registrar_email.trim(),
      judge_id: formData.judge_id ? Number(formData.judge_id) : null,
      notes: formData.notes?.trim(),
    };

    try {
      setSaving(true);
      const res = await API.api.post("/hearings/", payload);
      setHearings((prev) => [...prev, res.data]);
      alert("✅ Hearing scheduled successfully!");
      closeModal();
    } catch (err) {
      console.error("❌ Failed to add hearing:", err.response?.data || err);
      alert("Failed to schedule hearing.");
    } finally {
      setSaving(false);
    }
  };

  // ------------------------------
  // UPDATE / RESCHEDULE HEARING
  // ------------------------------
  const handleUpdateHearing = async () => {
    if (!selectedHearing) return;

    const payload = {
      scheduled_date: new Date(formData.scheduled_date).toISOString(),
      location: formData.location.trim(),
      notes: formData.notes?.trim(),
      status: "RESCHEDULED",
    };

    try {
      setSaving(true);
      const res = await API.api.put(`/hearings/${selectedHearing.id}`, payload);
      setHearings((prev) =>
        prev.map((h) => (h.id === selectedHearing.id ? res.data : h))
      );
      alert("✅ Hearing updated successfully!");
      closeModal();
    } catch (err) {
      console.error("❌ Update failed:", err.response?.data || err);
      alert("Error updating hearing.");
    } finally {
      setSaving(false);
    }
  };

  // ------------------------------
  // CANCEL HEARING
  // ------------------------------
  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this hearing?")) return;
    try {
      await API.api.put(`/hearings/${id}`, { status: "CANCELLED" });
      setHearings((prev) =>
        prev.map((h) => (h.id === id ? { ...h, status: "CANCELLED" } : h))
      );
      alert("🗑️ Hearing cancelled successfully.");
    } catch (err) {
      console.error("❌ Cancel failed:", err);
    }
  };

  // ------------------------------
  // DELETE HEARING
  // ------------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this hearing?")) return;
    try {
      await API.api.delete(`/hearings/${id}`);
      setHearings((prev) => prev.filter((h) => h.id !== id));
      alert("🗑️ Hearing deleted successfully.");
    } catch (err) {
      console.error("❌ Delete failed:", err);
    }
  };

  // ------------------------------
  // UI STATES
  // ------------------------------
  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="text-muted mt-2">Loading hearings...</p>
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;

  // ------------------------------
  // MAIN UI
  // ------------------------------
  return (
    <Container className="mt-4">
      <Card className="shadow-sm mb-4 border-0">
        <Card.Body>
          <Row className="align-items-center">
            <Col>
              <h2 className="fw-bold text-primary mb-0">📅 Hearing Management</h2>
              <p className="text-muted mb-0">
                Manage and track all hearings — schedule, reschedule, or cancel.
              </p>
            </Col>
            <Col className="text-end">
              <Button variant="success" onClick={() => openModal()}>
                ➕ Schedule Hearing
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {hearings.length === 0 ? (
        <Alert variant="light" className="text-center">
          No hearings found.
        </Alert>
      ) : (
        <Table bordered hover responsive className="shadow-sm align-middle">
          <thead className="bg-light">
            <tr>
              <th>#</th>
              <th>Case</th>
              <th>Scheduled Date</th>
              <th>Location</th>
              <th>Status</th>
              <th>Registrar</th>
              <th>Judge</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {hearings.map((h, i) => (
              <tr key={h.id}>
                <td>{i + 1}</td>
                <td>{h.case_title || `Case #${h.case_id}`}</td>
                <td>
                  {h.scheduled_date
                    ? new Date(h.scheduled_date).toLocaleString()
                    : "—"}
                </td>
                <td>{h.location || "—"}</td>
                <td>
                  <Badge
                    bg={
                      h.status?.toUpperCase() === "SCHEDULED"
                        ? "success"
                        : h.status?.toUpperCase() === "RESCHEDULED"
                        ? "info"
                        : h.status?.toUpperCase() === "CANCELLED"
                        ? "danger"
                        : "secondary"
                    }
                  >
                    {h.status || "UNKNOWN"}
                  </Badge>
                </td>
                <td>{h.registrar_name || h.registrar_email || "—"}</td>
                <td>{h.judge_name || "—"}</td>
                <td>
                  <div className="d-flex gap-2 flex-wrap">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => openModal(h)}
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      variant="outline-warning"
                      size="sm"
                      onClick={() => handleCancel(h.id)}
                    >
                      ⚠️ Cancel
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(h.id)}
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

      {/* 🕓 Modal for Add / Edit */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? "✏️ Update Hearing" : "➕ Schedule New Hearing"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {!isEditing && (
              <Form.Group className="mb-3">
                <Form.Label>Case ID</Form.Label>
                <Form.Control
                  type="number"
                  name="case_id"
                  value={formData.case_id}
                  onChange={handleChange}
                  placeholder="Enter case ID"
                  required
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Date & Time</Form.Label>
              <Form.Control
                type="datetime-local"
                name="scheduled_date"
                value={formData.scheduled_date}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                placeholder="Enter courtroom or venue"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Registrar Email</Form.Label>
              <Form.Control
                type="email"
                name="registrar_email"
                value={formData.registrar_email}
                disabled
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Judge ID (optional)</Form.Label>
              <Form.Control
                type="number"
                name="judge_id"
                placeholder="Enter judge ID"
                value={formData.judge_id}
                onChange={handleChange}
              />
            </Form.Group>

            {isEditing && (
              <Form.Group>
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="notes"
                  placeholder="Enter notes or comments"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={isEditing ? handleUpdateHearing : handleAddHearing}
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : isEditing
              ? "Update Hearing"
              : "Add Hearing"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

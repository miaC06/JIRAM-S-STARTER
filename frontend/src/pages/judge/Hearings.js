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
import API from "../../config/api";

export default function Hearings() {
  // ------------------------------
  // STATE MANAGEMENT
  // ------------------------------
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
  // FETCH ALL HEARINGS
  // ------------------------------
  useEffect(() => {
    const fetchHearings = async () => {
      try {
        setLoading(true);
        const res = await API.api.get("/hearings/");
        setHearings(res.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch hearings:", err);
        setError("Unable to fetch hearings from the server.");
      } finally {
        setLoading(false);
      }
    };
    fetchHearings();
  }, []);

  // ------------------------------
  // HANDLE FORM CHANGES
  // ------------------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ------------------------------
  // OPEN / CLOSE MODAL
  // ------------------------------
  const openModal = (hearing = null) => {
    if (hearing) {
      // Editing existing hearing
      setIsEditing(true);
      setSelectedHearing(hearing);
      setFormData({
        case_id: hearing.case_id || "",
        scheduled_date: hearing.scheduled_date
          ? new Date(hearing.scheduled_date).toISOString().slice(0, 16)
          : "",
        location: hearing.location || "",
        registrar_email: hearing.registrar_name || "",
        judge_id: hearing.judge_id || "",
        notes: hearing.notes || "",
      });
    } else {
      // New hearing
      setIsEditing(false);
      setSelectedHearing(null);
      setFormData({
        case_id: "",
        scheduled_date: "",
        location: "",
        registrar_email: "",
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
  // CREATE NEW HEARING
  // ------------------------------
  const handleAddHearing = async () => {
    if (
      !formData.case_id ||
      !formData.scheduled_date ||
      !formData.location ||
      !formData.registrar_email
    ) {
      alert("⚠️ Please fill in all required fields.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        case_id: Number(formData.case_id),
        scheduled_date: new Date(formData.scheduled_date).toISOString(),
        location: formData.location,
        registrar_email: formData.registrar_email,
        judge_id: formData.judge_id ? Number(formData.judge_id) : null,
      };

      const res = await API.api.post("/hearings/", payload);
      setHearings((prev) => [...prev, res.data]);

      alert("✅ Hearing scheduled successfully!");
      closeModal();
    } catch (err) {
      console.error("❌ Failed to add hearing:", err);
      alert("Failed to schedule hearing. Please check your inputs.");
    } finally {
      setSaving(false);
    }
  };

  // ------------------------------
  // RESCHEDULE / UPDATE HEARING
  // ------------------------------
  const handleUpdateHearing = async () => {
    if (!selectedHearing) return;

    try {
      setSaving(true);

      const payload = {
        scheduled_date: new Date(formData.scheduled_date).toISOString(),
        location: formData.location,
        notes: formData.notes,
        status: "RESCHEDULED",
      };

      const res = await API.api.put(`/hearings/${selectedHearing.id}`, payload);
      setHearings((prev) =>
        prev.map((h) =>
          h.id === selectedHearing.id ? { ...h, ...res.data } : h
        )
      );

      alert("✅ Hearing updated successfully!");
      closeModal();
    } catch (err) {
      console.error("❌ Update failed:", err);
      alert("Error updating hearing. Check your data and try again.");
    } finally {
      setSaving(false);
    }
  };

  // ------------------------------
  // CANCEL HEARING
  // ------------------------------
  const handleCancel = async (hearingId) => {
    if (!window.confirm("Are you sure you want to cancel this hearing?")) return;

    try {
      await API.api.put(`/hearings/${hearingId}`, { status: "CANCELLED" });
      setHearings((prev) =>
        prev.map((h) =>
          h.id === hearingId ? { ...h, status: "CANCELLED" } : h
        )
      );
      alert("🗑️ Hearing cancelled successfully.");
    } catch (err) {
      console.error("❌ Cancel failed:", err);
      alert("Failed to cancel hearing.");
    }
  };

  // ------------------------------
  // DELETE HEARING
  // ------------------------------
  const handleDelete = async (hearingId) => {
    if (!window.confirm("Permanently delete this hearing?")) return;

    try {
      await API.api.delete(`/hearings/${hearingId}`);
      setHearings((prev) => prev.filter((h) => h.id !== hearingId));
      alert("🗑️ Hearing deleted successfully.");
    } catch (err) {
      console.error("❌ Delete failed:", err);
      alert("Failed to delete hearing.");
    }
  };

  // ------------------------------
  // LOADING & ERROR STATES
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
  // MAIN RENDER
  // ------------------------------
  return (
    <Container className="mt-4">
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col>
              <h2 className="fw-bold text-primary mb-0">📅 Hearing Management</h2>
              <p className="text-muted mb-0">
                Manage all scheduled, rescheduled, or cancelled hearings.
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
                <td>{h.registrar_name || "—"}</td>
                <td>{h.judge_name || "—"}</td>
                <td>
                  <div className="d-flex gap-2">
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

      {/* MODAL: ADD / EDIT */}
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

            {!isEditing && (
              <Form.Group className="mb-3">
                <Form.Label>Registrar Email</Form.Label>
                <Form.Control
                  type="email"
                  name="registrar_email"
                  placeholder="registrar@example.com"
                  value={formData.registrar_email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            )}

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

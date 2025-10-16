import React, { useEffect, useState } from "react";
import api from "../../api";
import { Table, Spinner, Alert, Badge } from "react-bootstrap";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get("/payments/mine");
        setPayments(res.data);
      } catch (err) {
        setError("Failed to load payments");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <>
      <h3>💳 Payments</h3>
      <Table bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Invoice</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p, idx) => (
            <tr key={p.id}>
              <td>{idx + 1}</td>
              <td>{p.invoice_number}</td>
              <td>${p.amount}</td>
              <td>
                <Badge bg={p.status === "PAID" ? "success" : "warning"}>
                  {p.status}
                </Badge>
              </td>
              <td>{new Date(p.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

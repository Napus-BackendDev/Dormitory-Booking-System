import { Ticket } from "@/types/Ticket";
import { useState } from "react";

// Helper to extract a message from unknown errors in a type-safe way
const getErrorMessage = (err: unknown, fallback = "An error occurred") => {
  if (err && typeof err === "object" && "message" in err) {
    try {
      return String((err as any).message);
    } catch {
      return fallback;
    }
  }
  return fallback;
};

export default function useTicket() {
  const [tickets, setTickets] = useState<Ticket[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAll = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/ticket`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Fetch tickets failed");
      setTickets(data);
      return data;
    } catch (err) {
      setError(getErrorMessage(err, "Fetch tickets failed"));
    } finally {
      setLoading(false);
    }
  };

  const fetchById = async (id: string) => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/ticket/${id}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Fetch ticket failed");
      return data;
    } catch (err) {
      setError(getErrorMessage(err, "Fetch ticket failed"));
    } finally {
      setLoading(false);
    }
  };

  const create = async (body: Partial<Ticket>) => {
    setError(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", body.title || "");
      formData.append("description", body.description || "");
      formData.append("status", body.status || "");
      formData.append("priority", body.priority || "");
      formData.append("responseDueAt", body.responseDueAt ? body.responseDueAt.toString() : "");
      formData.append("resolveDueAt", body.resolveDueAt ? body.resolveDueAt.toString() : "");
      formData.append("userId", body.userId || "");

      if (body.photo && body.photo.length > 0) {
        body.photo.forEach((file) => {
          formData.append("photo", file);
        });
      }

      const res = await fetch(`/ticket`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Create ticket failed");

      try {
        setTickets(prev => (prev ? [data, ...prev] : [data]));
      } catch (e) {
        // ignore
      }

      return data;
    } catch (err) {
      setError(getErrorMessage(err, "Create ticket failed"));
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string) => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/ticket/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete ticket failed");
      return data;
    } catch (err) {
      setError(getErrorMessage(err, "Delete ticket failed"));
    } finally {
      setLoading(false);
    }
  };

  const fetchByStatus = async (status: string) => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/ticket?status=${status}`, {
        method: "GET",
        credentials: "include"
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Fetch tickets by status failed");
      return data;
    } catch (err) {
      setError(getErrorMessage(err, "Fetch tickets by status failed"));
    } finally {
      setLoading(false);
    }
  };

  const fetchMyTickets = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/ticket?assignedToMe=true`, { method: "GET", credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Fetch my tickets failed");
      return data;
    } catch (err) {
      setError(getErrorMessage(err, "Fetch my tickets failed"));
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    setError(null);
    setLoading(true);
    try {
      // Send status update as FormData to keep patch semantics consistent
      const formData = new FormData();
      formData.append('status', String(status));

      const res = await fetch(`/ticket/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update ticket status failed");
      return data;
    } catch (err) {
      setError(getErrorMessage(err, "Update ticket status failed"));
    } finally {
      setLoading(false);
    }
  };

  const acceptTicket = async (ticketId: string, technicianId: string) => {
    setError(null);
    setLoading(true);
    try {
      const body = {
        "status": "IN_PROGRESS",
        "technicianId": technicianId,
        "updatedAt": new Date().toISOString()
      }

      const res = await fetch(`/ticket/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Accept job failed");
      return data;
    } catch (err) {
      setError(getErrorMessage(err, "Accept job failed"));
    } finally {
      setLoading(false);
    }
  };

  const completeTicket = async (ticketId: string, technicianId: string) => {
    setError(null);
    setLoading(true);
    try {
      const body = {
        "status": "COMPLETED",
        "technicianId": technicianId,
        "updatedAt": new Date().toISOString()
      }

      const res = await fetch(`/ticket/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Complete job failed");
      return data;
    } catch (err) {
      setError(getErrorMessage(err, "Complete job failed"));
    } finally {
      setLoading(false);
    }
  };

  return {
    tickets,
    error,
    loading,
    fetchAll,
    fetchById,
    create,
    remove,
    fetchByStatus,
    fetchMyTickets,
    updateStatus,
    acceptTicket,
    completeTicket,
    setTickets
  };
}

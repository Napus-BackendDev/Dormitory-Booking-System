import { Ticket } from "@/types/Ticket";
import { useState } from "react";

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
      setError(
        err && typeof err === "object" && "message" in err
          ? (err as any).message
          : "Fetch tickets failed"
      );
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
      setError(
        err && typeof err === "object" && "message" in err
          ? (err as any).message
          : "Fetch ticket failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const create = async (body: Partial<Ticket>) => {
    setError(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("code", body.code || "");
      formData.append("title", body.title || "");
      formData.append("description", body.description || "");
      formData.append("status", body.status || "");
      formData.append("priority", body.priority || "");
      formData.append("dueAt", body.dueAt ? body.dueAt.toString() : "");
      
      // ถ้ามีหลายไฟล์แนบ
      if (body.photo && body.photo.length > 0) {
        body.photo.forEach((file) => {
          formData.append("photo", file);
        });
      }

      const res = await fetch(`/ticket`, {
        method: "POST",
        // headers: { "Content-Type": "multipart/form-data" },
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Create ticket failed");
      return data;
    } catch (err) {
      setError(
        err && typeof err === "object" && "message" in err
          ? (err as any).message
          : "Create ticket failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, body: Partial<Ticket>) => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/ticket/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update ticket failed");
      return data;
    } catch (err) {
      setError(
        err && typeof err === "object" && "message" in err
          ? (err as any).message
          : "Update ticket failed"
      );
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
      setError(
        err && typeof err === "object" && "message" in err
          ? (err as any).message
          : "Delete ticket failed"
      );
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
    update,
    remove,
    setTickets,
  };
}

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
            const res = await fetch(`/ticket`, { method: "GET", credentials: "include" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Fetch tickets failed");
            setTickets(data);
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "Fetch tickets failed");
        } finally {
            setLoading(false);
        }
    };

    const fetchById = async (id: string) => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/ticket/${id}`, { method: "GET", credentials: "include" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Fetch ticket failed");
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "Fetch ticket failed");
        } finally {
            setLoading(false);
        }
    };

    const fetchByStatus = async (status: string) => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/ticket?status=${status}`, { method: "GET", credentials: "include" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Fetch tickets by status failed");
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "Fetch tickets by status failed");
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
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "Fetch my tickets failed");
        } finally {
            setLoading(false);
        }
    };

    const create = async (body: Partial<Ticket>) => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/ticket`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Create ticket failed");
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "Create ticket failed");
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
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "Update ticket failed");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/ticket/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Update ticket status failed");
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "Update ticket status failed");
        } finally {
            setLoading(false);
        }
    };

    const assignToMe = async (id: string) => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/ticket/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ assignToMe: true }),
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Assign ticket failed");
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "Assign ticket failed");
        } finally {
            setLoading(false);
        }
    };

    const acceptJob = async (id: string) => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/ticket/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "in_progress", assignToMe: true }),
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Accept job failed");
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "Accept job failed");
        } finally {
            setLoading(false);
        }
    };

    const completeJob = async (id: string) => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/ticket/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "completed" }),
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Complete job failed");
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "Complete job failed");
        } finally {
            setLoading(false);
        }
    };

    const remove = async (id: string) => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/ticket/${id}`, { method: "DELETE", credentials: "include" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Delete ticket failed");
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "Delete ticket failed");
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
        fetchByStatus,
        fetchMyTickets,
        create, 
        update, 
        updateStatus,
        assignToMe,
        acceptJob,
        completeJob,
        remove, 
        setTickets 
    };
}

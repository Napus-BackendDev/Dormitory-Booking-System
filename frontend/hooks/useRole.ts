import { Role } from "@/types/Role";
import { useState } from "react";

export default function useRole() {
    const [roles, setRoles] = useState<Role[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchAll = async () => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/role`, { method: "GET", credentials: "include" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Fetch roles failed");
            setRoles(data);
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "Fetch roles failed");
        } finally {
            setLoading(false);
        }
    };

    const fetchById = async (id: string) => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/role/${id}`, { method: "GET", credentials: "include" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Fetch role failed");
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "Fetch role failed");
        } finally {
            setLoading(false);
        }
    };

    const create = async (body: Partial<Role>) => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/role`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Create role failed");
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "Create role failed");
        } finally {
            setLoading(false);
        }
    };

    const update = async (id: string, body: Partial<Role>) => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/role/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Update role failed");
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "Update role failed");
        } finally {
            setLoading(false);
        }
    };

    const remove = async (id: string) => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/role/${id}`, { method: "DELETE", credentials: "include" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Delete role failed");
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "Delete role failed");
        } finally {
            setLoading(false);
        }
    };

    return { roles, error, loading, fetchAll, fetchById, create, update, remove, setRoles };
}

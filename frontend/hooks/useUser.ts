import { User } from "@/types/User";
import { useState } from "react";

export default function useUser() {
    const [users, setUsers] = useState<User[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchAll = async () => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/user`, { method: "GET", credentials: "include" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Fetch users failed");
            setUsers(data);
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "Fetch users failed");
        } finally {
            setLoading(false);
        }
    };

    const fetchAdmins = async () => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/user/admin-user`, { method: "GET", credentials: "include" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Fetch admin users failed");
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "Fetch admin users failed");
        } finally {
            setLoading(false);
        }
    };

    const deleteAll = async () => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/user/delete-all`, { method: "DELETE", credentials: "include" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Delete all users failed");
            setUsers(null);
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "Delete all users failed");
        } finally {
            setLoading(false);
        }
    };

    const manageAccess = async (id: string, body: Record<string, any>) => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/user/manage-access/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Manage access failed");
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "Manage access failed");
        } finally {
            setLoading(false);
        }
    };

    return { users, error, loading, fetchAll, fetchAdmins, deleteAll, manageAccess, setUsers };
}

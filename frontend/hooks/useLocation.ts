import { Location } from "@/types/Location";
import { useState } from "react";

export default function useLocation() {
    const [locations, setLocations] = useState<Location[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchAll = async () => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/location`, { method: "GET", credentials: "include" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Fetch locations failed");
            setLocations(data);
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "Fetch locations failed");
        } finally {
            setLoading(false);
        }
    };

    const fetchById = async (id: string) => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/location/${id}`, { method: "GET", credentials: "include" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Fetch location failed");
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "Fetch location failed");
        } finally {
            setLoading(false);
        }
    };

    const create = async (body: Partial<Location>) => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/location`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Create location failed");
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "Create location failed");
        } finally {
            setLoading(false);
        }
    };

    const update = async (id: string, body: Partial<Location>) => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/location/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Update location failed");
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "Update location failed");
        } finally {
            setLoading(false);
        }
    };

    const remove = async (id: string) => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/location/${id}`, { method: "DELETE", credentials: "include" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Delete location failed");
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "Delete location failed");
        } finally {
            setLoading(false);
        }
    };

    return { locations, error, loading, fetchAll, fetchById, create, update, remove, setLocations };
}

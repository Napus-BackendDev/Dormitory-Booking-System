import { RepairType } from "@/types/RepairType";
import { useState } from "react";

export default function useRepairType() {
    const [repairTypes, setRepairTypes] = useState<RepairType[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchAll = async () => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/repairtype`, { method: "GET", credentials: "include" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Fetch repair types failed");
            setRepairTypes(data);
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "Fetch repair types failed");
        } finally {
            setLoading(false);
        }
    };

    const fetchById = async (id: string) => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/repairtype/${id}`, { method: "GET", credentials: "include" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Fetch repair type failed");
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "Fetch repair type failed");
        } finally {
            setLoading(false);
        }
    };

    const create = async (body: Partial<RepairType>) => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/repairtype`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
                credentials: "include",
            });
            const data = await res.json();
            console.log(res)
            console.log(data)
            if (!res.ok) throw new Error(data.message || "Create repair type failed");
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "Create repair type failed");
        } finally {
            setLoading(false);
        }
    };

    const update = async (id: string, body: Partial<RepairType>) => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/repairtype/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Update repair type failed");
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "Update repair type failed");
        } finally {
            setLoading(false);
        }
    };

    const remove = async (id: string) => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/repairtype/${id}`, { method: "DELETE", credentials: "include" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Delete repair type failed");
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "Delete repair type failed");
        } finally {
            setLoading(false);
        }
    };

    return { repairTypes, error, loading, fetchAll, fetchById, create, update, remove, setRepairTypes };
}

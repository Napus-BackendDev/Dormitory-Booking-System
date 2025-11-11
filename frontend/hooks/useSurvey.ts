import { Survey } from "@/types/Survey";
import { useState } from "react";

export default function useSurvey() {
    const [surveys, setSurveys] = useState<Survey[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchAll = async () => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/survey`, { method: "GET", credentials: "include" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Fetch surveys failed");
            setSurveys(data);
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "Fetch surveys failed");
        } finally {
            setLoading(false);
        }
    };

    const fetchById = async (id: string) => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/survey/${id}`, { method: "GET", credentials: "include" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Fetch survey failed");
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "Fetch survey failed");
        } finally {
            setLoading(false);
        }
    };

    const create = async (body: Partial<Survey>) => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/survey`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Create survey failed");
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "Create survey failed");
        } finally {
            setLoading(false);
        }
    };

    const update = async (id: string, body: Partial<Survey>) => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/survey/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Update survey failed");
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "Update survey failed");
        } finally {
            setLoading(false);
        }
    };

    const remove = async (id: string) => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/survey/${id}`, { method: "DELETE", credentials: "include" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Delete survey failed");
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "Delete survey failed");
        } finally {
            setLoading(false);
        }
    };

    return { surveys, error, loading, fetchAll, fetchById, create, update, remove, setSurveys };
}

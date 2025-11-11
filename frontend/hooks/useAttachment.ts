import { Attachment } from "@/types/Attachment";
import { useState } from "react";

export default function useAttachment() {
    const [attachments, setAttachments] = useState<Attachment[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchAll = async () => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/attachment`, { method: "GET", credentials: "include" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Fetch attachments failed");
            setAttachments(data);
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "Fetch attachments failed");
        } finally {
            setLoading(false);
        }
    };

    const fetchById = async (id: string) => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/attachment/${id}`, { method: "GET", credentials: "include" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Fetch attachment failed");
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "Fetch attachment failed");
        } finally {
            setLoading(false);
        }
    };

    const create = async (body: Partial<Attachment>) => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/attachment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Create attachment failed");
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "Create attachment failed");
        } finally {
            setLoading(false);
        }
    };

    const update = async (id: string, body: Partial<Attachment>) => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/attachment/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Update attachment failed");
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "Update attachment failed");
        } finally {
            setLoading(false);
        }
    };

    const remove = async (id: string) => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/attachment/${id}`, { method: "DELETE", credentials: "include" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Delete attachment failed");
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "Delete attachment failed");
        } finally {
            setLoading(false);
        }
    };

    return { attachments, error, loading, fetchAll, fetchById, create, update, remove, setAttachments };
}

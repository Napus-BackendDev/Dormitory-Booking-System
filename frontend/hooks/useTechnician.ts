import { useState } from "react";
import { Ticket } from "@/types/Ticket";

/**
 * Hook สำหรับช่างเทคนิค (Technician)
 * ใช้จัดการงานซ่อมของช่าง รับงาน อัพเดทสถานะ ฯลฯ
 */
export default function useTechnician() {
    const [tickets, setTickets] = useState<Ticket[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    /**
     * ดึงงานทั้งหมดที่รอรับ (pending)
     */
    const fetchPendingJobs = async () => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/ticket?status=pending`, { 
                method: "GET", 
                credentials: "include" 
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "ดึงข้อมูลงานที่รอรับล้มเหลว");
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "ดึงข้อมูลงานที่รอรับล้มเหลว");
            return null;
        } finally {
            setLoading(false);
        }
    };

    /**
     * ดึงงานที่กำลังทำอยู่ (in_progress)
     */
    const fetchInProgressJobs = async () => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/ticket?status=in_progress`, { 
                method: "GET", 
                credentials: "include" 
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "ดึงข้อมูลงานที่กำลังทำล้มเหลว");
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "ดึงข้อมูลงานที่กำลังทำล้มเหลว");
            return null;
        } finally {
            setLoading(false);
        }
    };

    /**
     * ดึงงานที่เสร็จสิ้นแล้ว (completed)
     */
    const fetchCompletedJobs = async () => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/ticket?status=completed`, { 
                method: "GET", 
                credentials: "include" 
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "ดึงข้อมูลงานที่เสร็จสิ้นล้มเหลว");
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "ดึงข้อมูลงานที่เสร็จสิ้นล้มเหลว");
            return null;
        } finally {
            setLoading(false);
        }
    };

    /**
     * ดึงงานของฉัน (ที่ถูก assign ให้ตัวเอง)
     */
    const fetchMyJobs = async () => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/ticket?assignedToMe=true`, { 
                method: "GET", 
                credentials: "include" 
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "ดึงข้อมูลงานของฉันล้มเหลว");
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "ดึงข้อมูลงานของฉันล้มเหลว");
            return null;
        } finally {
            setLoading(false);
        }
    };

    /**
     * รับงาน (assign งานให้ตัวเองและเปลี่ยนสถานะเป็น in_progress)
     */
    const acceptJob = async (ticketId: string) => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/ticket/${ticketId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    status: "in_progress",
                    assignToMe: true 
                }),
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "รับงานล้มเหลว");
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "รับงานล้มเหลว");
            return null;
        } finally {
            setLoading(false);
        }
    };

    /**
     * ทำงานเสร็จ (เปลี่ยนสถานะเป็น completed)
     */
    const completeJob = async (ticketId: string) => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/ticket/${ticketId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "completed" }),
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "ทำงานเสร็จล้มเหลว");
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "ทำงานเสร็จล้มเหลว");
            return null;
        } finally {
            setLoading(false);
        }
    };

    /**
     * อัพเดทสถานะของงาน
     */
    const updateJobStatus = async (ticketId: string, status: string) => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/ticket/${ticketId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "อัพเดทสถานะล้มเหลว");
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "อัพเดทสถานะล้มเหลว");
            return null;
        } finally {
            setLoading(false);
        }
    };

    /**
     * เพิ่มโน้ตหรืออัพเดทงาน
     */
    const addNote = async (ticketId: string, note: string) => {
        setError(null);
        setLoading(true);
        try {
            // สร้าง ticket event สำหรับโน้ต
            const res = await fetch(`/ticket-event`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    ticketId,
                    type: "note_added",
                    note 
                }),
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "เพิ่มโน้ตล้มเหลว");
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "เพิ่มโน้ตล้มเหลว");
            return null;
        } finally {
            setLoading(false);
        }
    };

    /**
     * ดึงรายละเอียดงานตาม ID
     */
    const fetchJobById = async (ticketId: string) => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/ticket/${ticketId}`, { 
                method: "GET", 
                credentials: "include" 
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "ดึงข้อมูลงานล้มเหลว");
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "ดึงข้อมูลงานล้มเหลว");
            return null;
        } finally {
            setLoading(false);
        }
    };

    /**
     * ดึง ticket events (ประวัติการทำงาน)
     */
    const fetchTicketEvents = async (ticketId?: string) => {
        setError(null);
        setLoading(true);
        try {
            const url = ticketId ? `/ticket-event?ticketId=${ticketId}` : `/ticket-event`;
            const res = await fetch(url, { 
                method: "GET", 
                credentials: "include" 
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "ดึงข้อมูลประวัติล้มเหลว");
            return data;
        } catch (err) {
            setError(err && typeof err === "object" && "message" in err ? (err as any).message : "ดึงข้อมูลประวัติล้มเหลว");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        tickets,
        error,
        loading,
        setTickets,
        // Job management
        fetchPendingJobs,
        fetchInProgressJobs,
        fetchCompletedJobs,
        fetchMyJobs,
        fetchJobById,
        // Actions
        acceptJob,
        completeJob,
        updateJobStatus,
        addNote,
        // Events
        fetchTicketEvents,
    };
}

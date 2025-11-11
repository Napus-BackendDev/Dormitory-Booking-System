

import React, { useEffect, useState } from 'react';
import useTechnician from '@/hooks/useTechnician';
import { Ticket } from '@/types/Ticket';

export const TechnicianDashboardExample: React.FC = () => {
  const {
    loading,
    error,
    fetchPendingJobs,
    fetchInProgressJobs,
    fetchCompletedJobs,
    fetchMyJobs,
    acceptJob,
    completeJob,
    updateJobStatus,
    addNote,
    fetchTicketEvents,
  } = useTechnician();

  const [pendingJobs, setPendingJobs] = useState<Ticket[]>([]);
  const [inProgressJobs, setInProgressJobs] = useState<Ticket[]>([]);
  const [completedJobs, setCompletedJobs] = useState<Ticket[]>([]);
  const [myJobs, setMyJobs] = useState<Ticket[]>([]);

  // โหลดข้อมูลงานเมื่อ component mount
  useEffect(() => {
    loadAllJobs();
  }, []);

  const loadAllJobs = async () => {
    // ดึงงานแบ่งตามสถานะ
    const pending = await fetchPendingJobs();
    const inProgress = await fetchInProgressJobs();
    const completed = await fetchCompletedJobs();
    const mine = await fetchMyJobs();

    if (pending) setPendingJobs(pending);
    if (inProgress) setInProgressJobs(inProgress);
    if (completed) setCompletedJobs(completed);
    if (mine) setMyJobs(mine);
  };

  // รับงาน
  const handleAcceptJob = async (ticketId: string) => {
    const result = await acceptJob(ticketId);
    if (result) {
      // แสดง toast สำเร็จ
      console.log('รับงานสำเร็จ:', result);
      // โหลดข้อมูลใหม่
      loadAllJobs();
    } else if (error) {
      // แสดง toast error
      console.error('รับงานล้มเหลว:', error);
    }
  };

  // ทำงานเสร็จ
  const handleCompleteJob = async (ticketId: string) => {
    const result = await completeJob(ticketId);
    if (result) {
      console.log('ทำงานเสร็จสำเร็จ:', result);
      loadAllJobs();
    } else if (error) {
      console.error('ทำงานเสร็จล้มเหลว:', error);
    }
  };

  // เพิ่มโน้ต/ความคิดเห็น
  const handleAddNote = async (ticketId: string, noteText: string) => {
    const result = await addNote(ticketId, noteText);
    if (result) {
      console.log('เพิ่มโน้ตสำเร็จ:', result);
    } else if (error) {
      console.error('เพิ่มโน้ตล้มเหลว:', error);
    }
  };

  // อัพเดทสถานะ
  const handleUpdateStatus = async (ticketId: string, newStatus: string) => {
    const result = await updateJobStatus(ticketId, newStatus);
    if (result) {
      console.log('อัพเดทสถานะสำเร็จ:', result);
      loadAllJobs();
    } else if (error) {
      console.error('อัพเดทสถานะล้มเหลว:', error);
    }
  };

  // ดูประวัติงาน
  const handleViewHistory = async (ticketId: string) => {
    const events = await fetchTicketEvents(ticketId);
    if (events) {
      console.log('ประวัติงาน:', events);
    } else if (error) {
      console.error('ดึงประวัติล้มเหลว:', error);
    }
  };

  if (loading) {
    return <div>กำลังโหลด...</div>;
  }

  return (
    <div className="space-y-6">
      {/* แสดง error ถ้ามี */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* งานที่รอรับ */}
      <section>
        <h2>งานที่รอรับ ({pendingJobs.length})</h2>
        <div className="grid gap-4">
          {pendingJobs.map((job) => (
            <div key={job.id} className="border p-4 rounded">
              <h3>{job.title}</h3>
              <p>{job.description}</p>
              <button
                onClick={() => handleAcceptJob(job.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              >
                รับงาน
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* งานที่กำลังทำ */}
      <section>
        <h2>งานที่กำลังทำ ({inProgressJobs.length})</h2>
        <div className="grid gap-4">
          {inProgressJobs.map((job) => (
            <div key={job.id} className="border p-4 rounded">
              <h3>{job.title}</h3>
              <p>{job.description}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleCompleteJob(job.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  ทำงานเสร็จ
                </button>
                <button
                  onClick={() => handleAddNote(job.id, 'กำลังดำเนินการ...')}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  เพิ่มโน้ต
                </button>
                <button
                  onClick={() => handleViewHistory(job.id)}
                  className="bg-purple-500 text-white px-4 py-2 rounded"
                >
                  ดูประวัติ
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* งานที่เสร็จแล้ว */}
      <section>
        <h2>งานที่เสร็จแล้ว ({completedJobs.length})</h2>
        <div className="grid gap-4">
          {completedJobs.map((job) => (
            <div key={job.id} className="border p-4 rounded bg-gray-50">
              <h3>{job.title}</h3>
              <p>{job.description}</p>
              <span className="text-green-600 font-semibold">✓ เสร็จสิ้น</span>
            </div>
          ))}
        </div>
      </section>

      {/* งานของฉัน */}
      <section>
        <h2>งานทั้งหมดของฉัน ({myJobs.length})</h2>
        <div className="grid gap-4">
          {myJobs.map((job) => (
            <div key={job.id} className="border p-4 rounded">
              <h3>{job.title}</h3>
              <p>สถานะ: {job.status}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};



// 1. ใช้เฉพาะการดึงงาน
export const SimpleJobList = () => {
  const { fetchPendingJobs, loading, error } = useTechnician();
  const [jobs, setJobs] = useState<Ticket[]>([]);

  useEffect(() => {
    const loadJobs = async () => {
      const result = await fetchPendingJobs();
      if (result) setJobs(result);
    };
    loadJobs();
  }, []);

  return (
    <div>
      {loading && <p>กำลังโหลด...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {jobs.map(job => (
        <div key={job.id}>{job.title}</div>
      ))}
    </div>
  );
};

// 2. ใช้เฉพาะการรับงาน
export const AcceptJobButton = ({ ticketId }: { ticketId: string }) => {
  const { acceptJob, loading, error } = useTechnician();

  const handleClick = async () => {
    const result = await acceptJob(ticketId);
    if (result) {
      alert('รับงานสำเร็จ!');
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
    >
      {loading ? 'กำลังรับงาน...' : 'รับงาน'}
      {error && <span className="text-red-500 text-xs ml-2">{error}</span>}
    </button>
  );
};

// 3. ใช้เฉพาะการเพิ่มโน้ต
export const AddNoteForm = ({ ticketId }: { ticketId: string }) => {
  const { addNote, loading, error } = useTechnician();
  const [note, setNote] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await addNote(ticketId, note);
    if (result) {
      setNote('');
      alert('เพิ่มโน้ตสำเร็จ!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="เพิ่มโน้ต..."
        className="w-full border p-2 rounded"
        rows={3}
      />
      <button
        type="submit"
        disabled={loading || !note.trim()}
        className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'กำลังบันทึก...' : 'เพิ่มโน้ต'}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
};

export default TechnicianDashboardExample;

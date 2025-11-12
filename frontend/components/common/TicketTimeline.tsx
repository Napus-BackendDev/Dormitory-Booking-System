import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Star,
  UserPlus,
  Clock,
  MessageSquare,
  Send
} from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { TicketEvent } from '../../contexts/MaintenanceContext';
import { useAuth } from '../../contexts/AuthContext';
import { useMaintenance } from '../../contexts/MaintenanceContext';

interface TicketTimelineProps {
  ticketId: string;
  events: TicketEvent[];
}

export const TicketTimeline: React.FC<TicketTimelineProps> = ({ ticketId, events }) => {
  const { user } = useAuth();
  const { addNote } = useMaintenance();
  const [noteText, setNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'created':
        return <FileText className="w-4 h-4" />;
      case 'assigned':
        return <UserPlus className="w-4 h-4" />;
      case 'status_changed':
        return <AlertCircle className="w-4 h-4" />;
      case 'note_added':
        return <MessageSquare className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'rated':
        return <Star className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'created':
        return 'bg-blue-500';
      case 'assigned':
        return 'bg-purple-500';
      case 'status_changed':
        return 'bg-amber-500';
      case 'note_added':
        return 'bg-cyan-500';
      case 'completed':
        return 'bg-green-500';
      case 'rated':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleAddNote = () => {
    if (!noteText.trim() || !user) return;
    
    addNote(ticketId, noteText, user.id, user.name, user.role?.name);
    setNoteText('');
    setIsAddingNote(false);
  };

  const canAddNote = user && (user.role?.name.toLowerCase() === 'technician' || user.role?.name.toLowerCase() === 'supervisor' || user.role?.name.toLowerCase() === 'admin');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="flex items-center gap-2 text-gray-700">
          <Clock className="w-5 h-5 text-red-600" />
          <span>ประวัติความเคลื่อนไหว</span>
        </h4>
        {canAddNote && !isAddingNote && (
          <Button
            onClick={() => setIsAddingNote(true)}
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            เพิ่มโน้ต
          </Button>
        )}
      </div>

      {/* Add Note Form */}
      {canAddNote && isAddingNote && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-br from-red-50 to-white rounded-xl border-2 border-red-200 shadow-md"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-red-600" />
              <span className="text-sm text-gray-700">เพิ่มโน้ตหรือความคืบหน้า</span>
            </div>
            <Textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="เช่น ได้ตรวจสอบแล้ว กำลังรอชิ้นส่วนอะไหล่..."
              className="min-h-[100px] resize-none border-red-200 focus:border-red-600"
            />
            <div className="flex gap-2 justify-end">
              <Button
                onClick={() => {
                  setIsAddingNote(false);
                  setNoteText('');
                }}
                variant="outline"
                size="sm"
              >
                ยกเลิก
              </Button>
              <Button
                onClick={handleAddNote}
                disabled={!noteText.trim()}
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                บันทึก
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-300 via-red-200 to-transparent"></div>

        <div className="space-y-4">
          {events.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>ยังไม่มีประวัติความเคลื่อนไหว</p>
            </div>
          ) : (
            events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative pl-12"
              >
                {/* Timeline dot */}
                <div
                  className={`absolute left-0 top-0 w-10 h-10 ${getEventColor(
                    event.type
                  )} rounded-full flex items-center justify-center text-white shadow-lg z-10`}
                >
                  {getEventIcon(event.type)}
                </div>

                {/* Event card */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{event.description}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <User className="w-3 h-3" />
                        <span>{event.userName}</span>
                        {event.userRole && (
                          <>
                            <span>•</span>
                            <span className="capitalize">
                              {event.userRole === 'user' && 'ผู้ใช้'}
                              {event.userRole === 'technician' && 'ช่าง'}
                              {event.userRole === 'supervisor' && 'หัวหน้างาน'}
                              {event.userRole === 'admin' && 'แอดมิน'}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(event.timestamp).toLocaleDateString('th-TH', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(event.timestamp).toLocaleTimeString('th-TH', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })} น.
                      </div>
                    </div>
                  </div>

                  {/* Additional metadata */}
                  {event.type === 'rated' && event.metadata?.rating && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < event.metadata!.rating!
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {event.metadata.rating}/5 ดาว
                        </span>
                      </div>
                      {event.metadata.feedback && (
                        <p className="text-sm text-gray-600 mt-2 italic">
                          &ldquo;{event.metadata.feedback}&rdquo;
                        </p>
                      )}
                    </div>
                  )}

                  {event.type === 'note_added' && event.metadata?.note && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700">{event.metadata.note}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

import { useState, useCallback } from 'react';
import { useApi } from './useApi';
import { config } from '@/lib/config';

export interface Attachment {
  id: string;
  ticketId: string;
  url: string;
  type: string;
  filename: string;
  size: number;
  createdAt: string;
}

export function useAttachment() {
  const api = useApi<Attachment[]>();
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const getAttachmentsByTicket = useCallback(async (ticketId: string) => {
    try {
      const result = await api.execute(`/attachments?ticketId=${ticketId}`);
      if (result) {
        setAttachments(result);
      }
      return result;
    } catch (error) {
      console.error('Failed to fetch attachments:', error);
      throw error;
    }
  }, [api]);

  const uploadAttachment = useCallback(async (file: File, ticketId: string) => {
    try {
      setUploading(true);
      setProgress(0);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('ticketId', ticketId);

      const token = localStorage.getItem('auth_token');
      const xhr = new XMLHttpRequest();

      return new Promise<Attachment>((resolve, reject) => {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentage = (event.loaded / event.total) * 100;
            setProgress(percentage);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            const result = JSON.parse(xhr.responseText);
            setAttachments(prev => [...prev, result]);
            resolve(result);
          } else {
            reject(new Error('อัพโลดล้มเหลว'));
          }
          setUploading(false);
          setProgress(0);
        };

        xhr.onerror = () => {
          reject(new Error('เกิดข้อผิดพลาดในการอัพโลด'));
          setUploading(false);
          setProgress(0);
        };

        xhr.open('POST', `${config.api.baseUrl}/api/v1/attachments`);
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
        xhr.send(formData);
      });
    } catch (error) {
      setUploading(false);
      setProgress(0);
      throw error;
    }
  }, []);

  const deleteAttachment = useCallback(async (id: string) => {
    try {
      await api.execute(`/attachments/${id}`, { method: 'DELETE' });
      setAttachments(prev => prev.filter(att => att.id !== id));
    } catch (error) {
      console.error('Failed to delete attachment:', error);
      throw error;
    }
  }, [api]);

  return {
    attachments,
    uploading,
    progress,
    loading: api.loading,
    error: api.error,
    getAttachmentsByTicket,
    uploadAttachment,
    deleteAttachment,
  };
}
-- Clear existing data (if needed)
TRUNCATE TABLE ticket_events CASCADE;
TRUNCATE TABLE attachments CASCADE;

-- Insert sample ticket_events
INSERT INTO ticket_events (id, "ticketId", type, note, "createdAt") VALUES
('e001b8ff-1c1d-4bd5-9c4a-82338e8fa886', 'REPAIR-2025-001', 'submitted', 'Air conditioner not cooling - Room 301', '2025-10-24T08:00:00Z'),
('e002b8ff-1c1d-4bd5-9c4a-82338e8fa887', 'REPAIR-2025-002', 'in_progress', 'Broken door handle - Room 205', '2025-10-24T09:15:00Z'),
('e003b8ff-1c1d-4bd5-9c4a-82338e8fa888', 'REPAIR-2025-003', 'completed', 'Light bulb replacement - Common Area', '2025-10-24T10:30:00Z'),
('e004b8ff-1c1d-4bd5-9c4a-82338e8fa889', 'REPAIR-2025-004', 'pending', 'Leaking faucet - Room 412', '2025-10-24T11:45:00Z'),
('e005b8ff-1c1d-4bd5-9c4a-82338e8fa890', 'REPAIR-2025-005', 'assigned', 'Wifi connectivity issues - Floor 2', '2025-10-24T13:00:00Z');

-- Insert sample attachments (photos/documents related to repairs)
INSERT INTO attachments (id, "ticketId", url, type, "createdAt") VALUES
('a001b8ff-1c1d-4bd5-9c4a-82338e8fa886', 'REPAIR-2025-001', 'https://storage.example.com/photos/ac-repair-301.jpg', 'image/jpeg', '2025-10-24T08:01:00Z'),
('a002b8ff-1c1d-4bd5-9c4a-82338e8fa887', 'REPAIR-2025-002', 'https://storage.example.com/photos/door-handle-205.jpg', 'image/jpeg', '2025-10-24T09:16:00Z'),
('a003b8ff-1c1d-4bd5-9c4a-82338e8fa888', 'REPAIR-2025-003', 'https://storage.example.com/docs/completion-report.pdf', 'application/pdf', '2025-10-24T10:35:00Z'),
('a004b8ff-1c1d-4bd5-9c4a-82338e8fa889', 'REPAIR-2025-004', 'https://storage.example.com/photos/leaking-faucet-412.jpg', 'image/jpeg', '2025-10-24T11:46:00Z'),
('a005b8ff-1c1d-4bd5-9c4a-82338e8fa890', 'REPAIR-2025-005', 'https://storage.example.com/docs/wifi-diagnostic.pdf', 'application/pdf', '2025-10-24T13:01:00Z');

-- Verify the data
SELECT * FROM ticket_events ORDER BY "createdAt";
SELECT * FROM attachments ORDER BY "createdAt";
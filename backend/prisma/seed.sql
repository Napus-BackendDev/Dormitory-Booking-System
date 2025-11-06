-- Clear existing data (if needed)
TRUNCATE TABLE "TicketEvent" CASCADE;
TRUNCATE TABLE "Attachment" CASCADE;
TRUNCATE TABLE "Survey" CASCADE;
TRUNCATE TABLE "Ticket" CASCADE;
TRUNCATE TABLE "User" CASCADE;

-- Insert sample users
INSERT INTO "User" (id, email, name, password, role, "createdAt") VALUES
('usr_admin_001', 'admin@example.com', 'Admin User', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPjYKCXWJ8F2', 'ADMIN', NOW()),
('usr_staff_001', 'staff@example.com', 'Staff User', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPjYKCXWJ8F2', 'STAFF', NOW()),
('usr_user_001', 'user@example.com', 'Regular User', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPjYKCXWJ8F2', 'USER', NOW());

-- Insert sample tickets with SLA fields
-- P1: 15min response, 4hr resolve
-- P2: 1hr response, 8hr resolve
-- P3: 4hr response, 3 days resolve
-- P4: 24hr response, 7 days resolve
INSERT INTO "Ticket" (id, code, title, description, status, priority, "dueAt", "createdAt", "slaResponseDueAt", "slaResolveDueAt") VALUES
-- Current tickets (recently created)
('tk1', 'TK-001', 'Air Conditioner Not Cooling', 'Air conditioner in Room 301 is not cooling properly.', 'open', 'P2', '2025-12-01 09:00:00', NOW(), NOW() + INTERVAL '1 hour', NOW() + INTERVAL '8 hours'),
('tk2', 'TK-002', 'Broken Door Handle', 'Door handle in Room 205 is broken and cannot be opened.', 'in_progress', 'P3', '2025-12-02 14:00:00', NOW(), NOW() + INTERVAL '4 hours', NOW() + INTERVAL '3 days'),
('tk3', 'TK-003', 'Light Bulb Replacement', 'Light bulbs in the common area need replacement.', 'completed', 'P4', '2025-11-25 10:30:00', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days' + INTERVAL '1 day', NOW() - INTERVAL '2 days' + INTERVAL '7 days'),
('tk4', 'TK-004', 'Leaking Faucet', 'Faucet in Room 412 bathroom is leaking continuously.', 'pending', 'P3', '2025-12-10 12:45:00', NOW(), NOW() + INTERVAL '4 hours', NOW() + INTERVAL '3 days'),
('tk5', 'TK-005', 'WiFi Connectivity Issues', 'WiFi signal is weak on Floor 2. Multiple rooms affected.', 'assigned', 'P2', '2025-12-08 16:20:00', NOW(), NOW() + INTERVAL '1 hour', NOW() + INTERVAL '8 hours'),

-- Additional tickets for SLA testing
-- P1 Critical tickets (15min response, 4hr resolve)
('tk6', 'TK-006', 'Fire Alarm Malfunction', 'Fire alarm in Room 101 is beeping continuously.', 'open', 'P1', '2025-12-15 08:00:00', NOW() - INTERVAL '20 minutes', NOW() - INTERVAL '20 minutes' + INTERVAL '15 minutes', NOW() - INTERVAL '20 minutes' + INTERVAL '4 hours'),
('tk7', 'TK-007', 'Power Outage - Critical', 'Complete power outage in Room 203 affecting medical equipment.', 'open', 'P1', NOW() + INTERVAL '1 hour', NOW() - INTERVAL '10 minutes', NOW() - INTERVAL '10 minutes' + INTERVAL '15 minutes', NOW() - INTERVAL '10 minutes' + INTERVAL '4 hours'),

-- P2 High priority tickets
('tk8', 'TK-008', 'Heating System Failure', 'Heating system not working in multiple rooms on Floor 3.', 'in_progress', 'P2', '2025-12-20 10:00:00', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours' + INTERVAL '1 hour', NOW() - INTERVAL '2 hours' + INTERVAL '8 hours'),
('tk9', 'TK-009', 'Security Door Lock', 'Electronic door lock malfunction in main entrance.', 'assigned', 'P2', '2025-12-18 14:30:00', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '30 minutes' + INTERVAL '1 hour', NOW() - INTERVAL '30 minutes' + INTERVAL '8 hours'),

-- P3 Medium priority tickets
('tk10', 'TK-010', 'Elevator Maintenance', 'Elevator making unusual noises and slow response.', 'pending', 'P3', '2025-12-25 09:15:00', NOW() - INTERVAL '5 hours', NOW() - INTERVAL '5 hours' + INTERVAL '4 hours', NOW() - INTERVAL '5 hours' + INTERVAL '3 days'),
('tk11', 'TK-011', 'Parking Lot Lighting', 'Several parking lot lights are out.', 'open', 'P3', '2025-12-22 16:45:00', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours' + INTERVAL '4 hours', NOW() - INTERVAL '3 hours' + INTERVAL '3 days'),

-- P4 Low priority tickets
('tk12', 'TK-012', 'Garden Maintenance', 'Grass needs mowing and garden cleanup.', 'pending', 'P4', '2026-01-05 08:00:00', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days' + INTERVAL '1 day', NOW() - INTERVAL '2 days' + INTERVAL '7 days'),
('tk13', 'TK-013', 'Bulletin Board Updates', 'Update dormitory bulletin boards with new information.', 'open', 'P4', '2026-01-10 12:00:00', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '7 days'),

-- Tickets nearing SLA breaches (for testing warnings)
('tk14', 'TK-014', 'Near Response Breach P1', 'Test ticket for P1 response SLA warning.', 'open', 'P1', NOW() + INTERVAL '2 hours', NOW() - INTERVAL '14 minutes', NOW() - INTERVAL '14 minutes' + INTERVAL '15 minutes', NOW() - INTERVAL '14 minutes' + INTERVAL '4 hours'),
('tk15', 'TK-015', 'Near Resolve Breach P2', 'Test ticket for P2 resolve SLA warning.', 'in_progress', 'P2', NOW() + INTERVAL '1 hour', NOW() - INTERVAL '7 hours 45 minutes', NOW() - INTERVAL '7 hours 45 minutes' + INTERVAL '1 hour', NOW() - INTERVAL '7 hours 45 minutes' + INTERVAL '8 hours'),

-- Already breached tickets (for testing breach detection)
('tk16', 'TK-016', 'Breached Response P1', 'Test ticket with breached P1 response SLA.', 'open', 'P1', NOW() + INTERVAL '2 hours', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '30 minutes' + INTERVAL '15 minutes', NOW() - INTERVAL '30 minutes' + INTERVAL '4 hours'),
('tk17', 'TK-017', 'Breached Resolve P3', 'Test ticket with breached P3 resolve SLA.', 'in_progress', 'P3', NOW() + INTERVAL '1 hour', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days' + INTERVAL '4 hours', NOW() - INTERVAL '4 days' + INTERVAL '3 days');

-- Insert ticket events (one per ticket due to unique constraint on ticketId)
INSERT INTO "TicketEvent" (id, "ticketId", type, note, "createdBy", "createdAt") VALUES
('evt1', 'tk1', 'CREATED', 'Air conditioner not cooling - Room 301', 'usr_user_001', NOW() - INTERVAL '5 minutes'),
('evt2', 'tk2', 'CREATED', 'Broken door handle - Room 205', 'usr_staff_001', NOW() - INTERVAL '4 minutes'),
('evt3', 'tk3', 'CREATED', 'Light bulb replacement - Common Area', 'usr_staff_001', NOW() - INTERVAL '2 days 5 minutes'),
('evt4', 'tk4', 'CREATED', 'Leaking faucet - Room 412', 'usr_user_001', NOW() - INTERVAL '3 minutes'),
('evt5', 'tk5', 'CREATED', 'WiFi connectivity issues - Floor 2', 'usr_admin_001', NOW() - INTERVAL '2 minutes'),
('evt6', 'tk6', 'CREATED', 'Fire alarm malfunction - Room 101', 'usr_user_001', NOW() - INTERVAL '20 minutes'),
('evt7', 'tk7', 'CREATED', 'Power outage critical - Room 203', 'usr_user_001', NOW() - INTERVAL '10 minutes'),
('evt8', 'tk8', 'CREATED', 'Heating system failure - Floor 3', 'usr_staff_001', NOW() - INTERVAL '2 hours'),
('evt9', 'tk9', 'CREATED', 'Security door lock malfunction', 'usr_admin_001', NOW() - INTERVAL '30 minutes'),
('evt10', 'tk10', 'CREATED', 'Elevator maintenance needed', 'usr_user_001', NOW() - INTERVAL '5 hours'),
('evt11', 'tk11', 'CREATED', 'Parking lot lighting out', 'usr_staff_001', NOW() - INTERVAL '3 hours'),
('evt12', 'tk12', 'CREATED', 'Garden maintenance required', 'usr_user_001', NOW() - INTERVAL '2 days'),
('evt13', 'tk13', 'CREATED', 'Bulletin board updates needed', 'usr_admin_001', NOW() - INTERVAL '1 day'),
('evt14', 'tk14', 'CREATED', 'Near response breach test P1', 'usr_user_001', NOW() - INTERVAL '14 minutes'),
('evt15', 'tk15', 'CREATED', 'Near resolve breach test P2', 'usr_staff_001', NOW() - INTERVAL '7 hours 45 minutes'),
('evt16', 'tk16', 'CREATED', 'Breached response test P1', 'usr_user_001', NOW() - INTERVAL '30 minutes'),
('evt17', 'tk17', 'CREATED', 'Breached resolve test P3', 'usr_user_001', NOW() - INTERVAL '4 days');

-- Insert attachments (one per ticket due to unique constraint on ticketId)
INSERT INTO "Attachment" (id, "ticketId", url, type, "createdAt") VALUES
('att1', 'tk1', 'https://storage.example.com/photos/ac-repair-301.jpg', 'image/jpeg', NOW() - INTERVAL '4 minutes'),
('att2', 'tk2', 'https://storage.example.com/photos/door-handle-205.jpg', 'image/jpeg', NOW() - INTERVAL '3 minutes'),
('att3', 'tk3', 'https://storage.example.com/docs/completion-report.pdf', 'application/pdf', NOW() - INTERVAL '2 days 4 minutes'),
('att4', 'tk4', 'https://storage.example.com/photos/leaking-faucet-412.jpg', 'image/jpeg', NOW() - INTERVAL '2 minutes'),
('att5', 'tk5', 'https://storage.example.com/docs/wifi-diagnostic.pdf', 'application/pdf', NOW() - INTERVAL '1 minute'),
('att6', 'tk6', 'https://storage.example.com/photos/fire-alarm-101.jpg', 'image/jpeg', NOW() - INTERVAL '19 minutes'),
('att7', 'tk7', 'https://storage.example.com/docs/power-outage-report.pdf', 'application/pdf', NOW() - INTERVAL '9 minutes'),
('att8', 'tk8', 'https://storage.example.com/photos/heating-system.jpg', 'image/jpeg', NOW() - INTERVAL '1 hour 59 minutes'),
('att9', 'tk9', 'https://storage.example.com/photos/security-door.jpg', 'image/jpeg', NOW() - INTERVAL '29 minutes'),
('att10', 'tk10', 'https://storage.example.com/docs/elevator-report.pdf', 'application/pdf', NOW() - INTERVAL '4 hours 59 minutes'),
('att11', 'tk11', 'https://storage.example.com/photos/parking-lights.jpg', 'image/jpeg', NOW() - INTERVAL '2 hours 59 minutes'),
('att12', 'tk12', 'https://storage.example.com/photos/garden-before.jpg', 'image/jpeg', NOW() - INTERVAL '1 day 23 hours'),
('att13', 'tk13', 'https://storage.example.com/docs/bulletin-content.pdf', 'application/pdf', NOW() - INTERVAL '23 hours'),
('att14', 'tk14', 'https://storage.example.com/docs/sla-test-p1.pdf', 'application/pdf', NOW() - INTERVAL '13 minutes'),
('att15', 'tk15', 'https://storage.example.com/docs/sla-test-p2.pdf', 'application/pdf', NOW() - INTERVAL '7 hours 44 minutes'),
('att16', 'tk16', 'https://storage.example.com/docs/breached-p1.pdf', 'application/pdf', NOW() - INTERVAL '29 minutes'),
('att17', 'tk17', 'https://storage.example.com/docs/breached-p3.pdf', 'application/pdf', NOW() - INTERVAL '3 days 23 hours');

-- Insert surveys (one per ticket due to unique constraint on ticketId)
INSERT INTO "Survey" (id, "ticketId", score, comment) VALUES
('srv1', 'tk1', 4, 'Good service, AC is working now but took longer than expected.'),
('srv2', 'tk2', 5, 'Excellent work! Door handle fixed quickly.'),
('srv3', 'tk3', 3, 'Lights are working but some bulbs were not replaced properly.'),
('srv4', 'tk6', 5, 'Fire alarm fixed immediately, very responsive!'),
('srv5', 'tk8', 4, 'Heating system working, but took some time.'),
('srv6', 'tk10', 3, 'Elevator is quieter now, but still needs attention.');

-- Verify the data
SELECT 'Users:' as table_name, COUNT(*) as count FROM "User"
UNION ALL
SELECT 'Tickets:', COUNT(*) FROM "Ticket"
UNION ALL
SELECT 'TicketEvents:', COUNT(*) FROM "TicketEvent"
UNION ALL
SELECT 'Attachments:', COUNT(*) FROM "Attachment"
UNION ALL
SELECT 'Surveys:', COUNT(*) FROM "Survey";
import { SendEmailDto } from "../dtos/sendEmail.dto";

export const SlaWarningMailer = async (
    prismaService: any,
    emailService: any,
    ticketId: string,
    ticketCode: string,
    ticketTitle: string,
    slaType: 'response' | 'resolution',
    dueAt: Date
) => {
    const dueTime = dueAt.toLocaleString('en-US', {
        timeZone: 'Asia/Bangkok',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const actionRequired = slaType === 'response' ? 'acknowledged' : 'resolved';

    // Get all admin users to send notifications to
    const adminUsers = await prismaService.user.findMany({
        where: { role: 'admin' },
        select: { email: true }
    });

    const adminEmails = adminUsers.map(user => user.email);

    if (adminEmails.length === 0) {
        console.warn('No admin users found to send SLA warning notification');
        return;
    }

    await emailService.sendEmail({
        to: adminEmails, // Send to all admin users
        subject: `⚠️ SLA Warning: Ticket ${ticketCode} - ${ticketTitle}`,
        body: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #ff6b35; border-bottom: 2px solid #ff6b35; padding-bottom: 10px;">
                    ⚠️ SLA Warning Alert
                </h1>

                <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0;">
                    <h2 style="color: #856404; margin-top: 0;">Ticket ${ticketCode}</h2>
                    <p style="font-size: 16px; margin: 10px 0;"><strong>Title:</strong> ${ticketTitle}</p>
                    <p style="font-size: 16px; margin: 10px 0;"><strong>Action Required:</strong> Must be ${actionRequired} by ${dueTime}</p>
                    <p style="font-size: 16px; margin: 10px 0;"><strong>Time Remaining:</strong> Less than 15 minutes</p>
                </div>

                <div style="background-color: #f8f9fa; border-radius: 5px; padding: 15px; margin: 20px 0;">
                    <h3 style="color: #495057; margin-top: 0;">Immediate Action Required</h3>
                    <p>Please ${actionRequired === 'acknowledged' ? 'acknowledge this ticket' : 'resolve this ticket'} immediately to avoid SLA breach.</p>
                    <ul>
                        <li>Check ticket details and priority</li>
                        <li>${actionRequired === 'acknowledged' ? 'Acknowledge receipt' : 'Provide solution'}</li>
                        <li>Update ticket status accordingly</li>
                    </ul>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/tickets/${ticketId}"
                       style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        View Ticket Details
                    </a>
                </div>

                <p style="color: #6c757d; font-size: 14px; border-top: 1px solid #dee2e6; padding-top: 20px;">
                    This is an automated SLA monitoring notification. Please do not reply to this email.
                </p>
            </div>
        `,
        text: `SLA WARNING: Ticket ${ticketCode} - ${ticketTitle}
Action Required: Must be ${actionRequired} by ${dueTime}
Time Remaining: Less than 15 minutes

Please ${actionRequired === 'acknowledged' ? 'acknowledge this ticket' : 'resolve this ticket'} immediately to avoid SLA breach.

View ticket: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/tickets/${ticketId}`
    });
};
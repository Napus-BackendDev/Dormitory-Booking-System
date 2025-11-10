import { SendEmailDto } from "../dtos/sendEmail.dto";

export const SlaBreachMailer = async (
    prismaService: any,
    emailService: any,
    ticketId: string,
    ticketCode: string,
    ticketTitle: string,
    slaType: 'response' | 'resolution',
    breachedAt: Date
) => {
    const breachTime = breachedAt.toLocaleString('en-US', {
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
        console.warn('No admin users found to send SLA breach notification');
        return;
    }

    await emailService.sendEmail({
        to: adminEmails, // Send to all admin users
        subject: `🚨 URGENT: SLA BREACH - Ticket ${ticketCode} - ${ticketTitle}`,
        body: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #dc3545; border-bottom: 2px solid #dc3545; padding-bottom: 10px;">
                    🚨 SLA BREACH ALERT - IMMEDIATE ACTION REQUIRED
                </h1>

                <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px; padding: 15px; margin: 20px 0;">
                    <h2 style="color: #721c24; margin-top: 0;">Ticket ${ticketCode}</h2>
                    <p style="font-size: 16px; margin: 10px 0;"><strong>Title:</strong> ${ticketTitle}</p>
                    <p style="font-size: 16px; margin: 10px 0;"><strong>Issue:</strong> SLA ${slaType} deadline was breached</p>
                    <p style="font-size: 16px; margin: 10px 0;"><strong>Breached At:</strong> ${breachTime}</p>
                    <p style="font-size: 16px; margin: 10px 0;"><strong>Status:</strong> This ticket should have been ${actionRequired} by now</p>
                </div>

                <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0;">
                    <h3 style="color: #856404; margin-top: 0;">⚠️ Escalation Required</h3>
                    <p><strong>This SLA breach requires immediate attention:</strong></p>
                    <ul>
                        <li>Customer satisfaction may be impacted</li>
                        <li>Escalate to senior team member if needed</li>
                        <li>Provide immediate ${actionRequired === 'acknowledged' ? 'acknowledgment' : 'resolution'}</li>
                        <li>Document reason for delay</li>
                    </ul>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/tickets/${ticketId}"
                       style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        🚨 VIEW TICKET IMMEDIATELY
                    </a>
                </div>

                <div style="background-color: #e9ecef; border-radius: 5px; padding: 15px; margin: 20px 0;">
                    <h4 style="color: #495057; margin-top: 0;">Next Steps:</h4>
                    <ol>
                        <li>Review ticket details and priority</li>
                        <li>${actionRequired === 'acknowledged' ? 'Acknowledge the ticket immediately' : 'Provide resolution/update'}</li>
                        <li>Update ticket status</li>
                        <li>Communicate with customer about the delay</li>
                        <li>Document the breach reason for SLA reporting</li>
                    </ol>
                </div>

                <p style="color: #6c757d; font-size: 14px; border-top: 1px solid #dee2e6; padding-top: 20px;">
                    This is an automated SLA monitoring notification for breached deadlines. Immediate action is required.
                </p>
            </div>
        `,
        text: `URGENT SLA BREACH: Ticket ${ticketCode} - ${ticketTitle}
Issue: SLA ${slaType} deadline was breached at ${breachTime}
Status: This ticket should have been ${actionRequired} by now

IMMEDIATE ACTION REQUIRED:
- Review ticket details and priority
- ${actionRequired === 'acknowledged' ? 'Acknowledge the ticket immediately' : 'Provide resolution/update'}
- Update ticket status
- Communicate with customer about the delay

View ticket: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/tickets/${ticketId}`
    });
};
import { SendEmailDto } from "../dtos/sendEmail.dto";

export const WorkDoneMailer = async (
    emailService: any,
    ticketId: string,
    ticketCode: string,
    ticketTitle: string,
    userEmail: string,
    resolvedAt: Date
) => {
    const completionTime = resolvedAt.toLocaleString('en-US', {
        timeZone: 'Asia/Bangkok',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    await emailService.sendEmail({
        to: userEmail,
        subject: `✅ Ticket Resolved: ${ticketCode} - ${ticketTitle}`,
        body: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #28a745; border-bottom: 2px solid #28a745; padding-bottom: 10px;">
                    ✅ Your Ticket Has Been Resolved
                </h1>

                <div style="background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 5px; padding: 15px; margin: 20px 0;">
                    <h2 style="color: #155724; margin-top: 0;">Ticket ${ticketCode}</h2>
                    <p style="font-size: 16px; margin: 10px 0;"><strong>Title:</strong> ${ticketTitle}</p>
                    <p style="font-size: 16px; margin: 10px 0;"><strong>Status:</strong> ✅ COMPLETED</p>
                    <p style="font-size: 16px; margin: 10px 0;"><strong>Resolved At:</strong> ${completionTime}</p>
                </div>

                <div style="background-color: #f8f9fa; border-radius: 5px; padding: 15px; margin: 20px 0;">
                    <h3 style="color: #495057; margin-top: 0;">What Was Done</h3>
                    <p>Your reported issue has been successfully investigated and resolved by our technical team.</p>
                    <ul>
                        <li>Issue diagnosis and root cause analysis completed</li>
                        <li>Appropriate solution implemented</li>
                        <li>System functionality verified</li>
                        <li>Quality assurance testing passed</li>
                    </ul>
                </div>

                <div style="background-color: #e9ecef; border-radius: 5px; padding: 15px; margin: 20px 0;">
                    <h4 style="color: #495057; margin-top: 0;">Need Further Assistance?</h4>
                    <p>If you experience any issues related to this ticket or need clarification about the resolution:</p>
                    <ul>
                        <li>Reply to this email</li>
                        <li>Create a new ticket if it's a different issue</li>
                        <li>Contact our support team directly</li>
                    </ul>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/tickets/${ticketId}"
                       style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        View Ticket Details
                    </a>
                </div>

                <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0;">
                    <h4 style="color: #856404; margin-top: 0;">📊 Service Quality Feedback</h4>
                    <p>Your feedback helps us improve our service. Please take a moment to rate your experience:</p>
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/survey/${ticketId}"
                       style="background-color: #ffc107; color: #212529; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        ⭐ Rate Our Service
                    </a>
                </div>

                <p style="color: #6c757d; font-size: 14px; border-top: 1px solid #dee2e6; padding-top: 20px;">
                    Thank you for using our service. We appreciate your patience and understanding during the resolution process.
                </p>

                <p style="color: #6c757d; font-size: 14px;">
                    Best regards,<br/>
                    <strong>The Support Team</strong>
                </p>
            </div>
        `,
        text: `✅ TICKET RESOLVED: ${ticketCode} - ${ticketTitle}

Your ticket has been successfully resolved at ${completionTime}.

What was done:
- Issue diagnosis and root cause analysis completed
- Appropriate solution implemented
- System functionality verified
- Quality assurance testing passed

If you need further assistance, please reply to this email or create a new ticket.

View ticket: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/tickets/${ticketId}
Rate our service: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/survey/${ticketId}

Thank you for using our service!

Best regards,
The Support Team`
    });
};
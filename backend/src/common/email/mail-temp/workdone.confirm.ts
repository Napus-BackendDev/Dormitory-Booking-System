import { SendEmailDto } from "../dtos/sendEmail.dto";

export const CloseTicketMailer = async (
    emailService: any,
    userEmail: string
) => {
    await emailService.sendEmail({
        to: userEmail,
        subject: 'Ticket Received Confirmation',
        body: `
            <h1>Your ticket has been received</h1>
            <p>Thank you for reaching out to our support team. We have received your ticket and will be reviewing it shortly.</p>
            <p>Our team is committed to providing you with the best possible assistance. We will get back to you as soon as we have an update regarding your issue.</p>
            <p>If you have any additional information or questions, please feel free to reply to this email.</p>
            <br/>
            <p>Best regards,</p>
            <p>The Support Team</p>
        `,
        text: `Your ticket has been received. Thank you for reaching out to our support team. We will review your ticket shortly and get back to you with an update. Best regards, The Support Team`
    });
}


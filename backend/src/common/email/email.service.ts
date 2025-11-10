import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'; 
import {ConfigService} from "@nestjs/config";
import { SendEmailDto } from './dtos/sendEmail.dto';

@Injectable()
export class EmailService {
    constructor(private readonly configService: ConfigService) {}
 
    emailTransport(){
        const transporter = nodemailer.createTransport({
            host: this.configService.get<string>('EMAIL_HOST'),
            port: this.configService.get<number>('EMAIL_PORT'),
            secure: false, 
            auth: {
                user: this.configService.get<string>('EMAIL_USER'),
                pass: this.configService.get<string>('EMAIL_PASS'),
            },
        });
        return transporter; 
    }

    async sendEmail(sendEmailDto: SendEmailDto) {

        const{to, subject, body, text} = sendEmailDto;
        const transporter = this.emailTransport();

        const options: nodemailer.SendMailOptions = {
            from: this.configService.get<string>('EMAIL_USER'),
            to,
            subject,
            html: body,
            text,
        }
        try{
            await transporter.sendMail(options);
            return {message: 'Email sent successfully'};
        }catch(error){
            console.error('Error sending email:', error);
            throw new Error('Failed to send email');
        } 
    }
}

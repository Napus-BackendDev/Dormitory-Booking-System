import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SendEmailDto {
    @IsNotEmpty({ message: 'Recipient email is required' })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    to: string; 
    @IsNotEmpty({ message: 'Email subject is required' })
    subject: string; 
    @IsNotEmpty({ message: 'Email body is required' })
    body: string; 

    @IsOptional()
    @IsString({ message: 'Text must be a string' })
    text?: string;
}
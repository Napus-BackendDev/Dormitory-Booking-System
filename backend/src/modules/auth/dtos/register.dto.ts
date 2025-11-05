import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

export class RegisterDto {
    @IsEmail({}, { message: 'Please provide a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    @Matches(/^[a-zA-Z0-9\s]{3,}$/, {
        message: 'Name must be at least 3 characters long and can only contain letters, numbers and spaces'
    })
    name: string;

    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password must be a string' })
    @Matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        {
            message: 'Password must be at least 8 characters long, contain at least one letter, one number and one special character'
        }
    )
    password: string;

    @IsNotEmpty({ message: 'Role is required' })
    @IsString()
    role?: string;
}
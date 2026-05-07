import {NextRequest, NextResponse} from 'next/server';
import dbConnect from '@/lib/mongodb';
import {User} from '@/models/User';
import {generateOTP, hashPassword} from '@/lib/utils';
import {sendOTPEmail} from '@/lib/nodemailer';

interface RegisterUserData {
    password: string;
    otp: string;
    otpExpiry: Date;
    isVerified: boolean;
    email?: string;
    phone?: string;
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const {email, phone, password} = await req.json();

        if (!email && !phone) {
            return NextResponse.json(
                {error: 'Email or phone number is required'},
                {status: 400}
            );
        }

        if (!password) {
            return NextResponse.json(
                {error: 'Password is required'},
                {status: 400}
            );
        }

        if (email) {
            const existingUser = await User.findOne({email});
            if (existingUser) {
                return NextResponse.json(
                    {error: 'User already exists'},
                    {status: 400}
                );
            }
        }

        if (phone) {
            const existingUser = await User.findOne({phone});
            if (existingUser) {
                return NextResponse.json(
                    {error: 'User with this phone number already exists'},
                    {status: 400}
                );
            }
        }

        const hashedPassword = await hashPassword(password);
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        const userData: RegisterUserData = {
            password: hashedPassword,
            otp,
            otpExpiry,
            isVerified: false,
        };
        if (email) userData.email = email;
        if (phone) userData.phone = phone;

        const user = await User.create(userData);

        if (email) {
            await sendOTPEmail(email, otp);
        }

        return NextResponse.json(
            {message: 'Registration successful. Please check your email for OTP.', userId: user._id},
            {status: 201}
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            {error: 'Internal server error'},
            {status: 500}
        );
    }
}

import {NextRequest, NextResponse} from 'next/server';
import dbConnect from '@/lib/mongodb';
import {User} from '@/models/User';
import {generateOTP, hashPassword} from '@/lib/utils';
import {sendOTPEmail} from '@/lib/nodemailer';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const {email, password} = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                {error: 'Email and password are required'},
                {status: 400}
            );
        }

        const existingUser = await User.findOne({email});
        if (existingUser) {
            return NextResponse.json(
                {error: 'User already exists'},
                {status: 400}
            );
        }

        const hashedPassword = await hashPassword(password);
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        const user = await User.create({
            email,
            password: hashedPassword,
            otp,
            otpExpiry,
            isVerified: false
        });

        await sendOTPEmail(email, otp);

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

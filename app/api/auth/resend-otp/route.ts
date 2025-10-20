import {NextRequest, NextResponse} from 'next/server';
import dbConnect from '@/lib/mongodb';
import {User} from '@/models/User';
import {generateOTP} from '@/lib/utils';
import {sendOTPEmail} from '@/lib/nodemailer';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const {email} = await req.json();

        if (!email) {
            return NextResponse.json(
                {error: 'Email is required'},
                {status: 400}
            );
        }

        const user = await User.findOne({email});

        if (!user) {
            return NextResponse.json(
                {error: 'User not found'},
                {status: 404}
            );
        }

        if (user.isVerified) {
            return NextResponse.json(
                {error: 'User already verified'},
                {status: 400}
            );
        }

        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        await sendOTPEmail(email, otp);

        return NextResponse.json(
            {message: 'OTP resent successfully'},
            {status: 200}
        );
    } catch (error) {
        console.error('Resend OTP error:', error);
        return NextResponse.json(
            {error: 'Internal server error'},
            {status: 500}
        );
    }
}

import {NextRequest, NextResponse} from 'next/server';
import dbConnect from '@/lib/mongodb';
import {User} from '@/models/User';
import {generateToken} from '@/lib/utils';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const {email, otp} = await req.json();

        if (!email || !otp) {
            return NextResponse.json(
                {error: 'Email and OTP are required'},
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

        if (!user.otp || !user.otpExpiry) {
            return NextResponse.json(
                {error: 'No OTP found. Please request a new one.'},
                {status: 400}
            );
        }

        if (new Date() > user.otpExpiry) {
            return NextResponse.json(
                {error: 'OTP has expired'},
                {status: 400}
            );
        }

        if (user.otp !== otp) {
            return NextResponse.json(
                {error: 'Invalid OTP'},
                {status: 400}
            );
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        const token = generateToken(user._id.toString());

        return NextResponse.json(
            {message: 'Email verified successfully', token},
            {status: 200}
        );
    } catch (error) {
        console.error('OTP verification error:', error);
        return NextResponse.json(
            {error: 'Internal server error'},
            {status: 500}
        );
    }
}

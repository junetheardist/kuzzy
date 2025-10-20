import {NextRequest, NextResponse} from 'next/server';
import dbConnect from '@/lib/mongodb';
import {User} from '@/models/User';
import {generateResetToken} from '@/lib/utils';
import {sendResetPasswordEmail} from '@/lib/nodemailer';

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
                {message: 'If the email exists, a reset link will be sent.'},
                {status: 200}
            );
        }

        const resetToken = generateResetToken();
        const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        await sendResetPasswordEmail(email, resetToken);

        return NextResponse.json(
            {message: 'If the email exists, a reset link will be sent.'},
            {status: 200}
        );
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            {error: 'Internal server error'},
            {status: 500}
        );
    }
}

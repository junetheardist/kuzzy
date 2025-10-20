import {NextRequest, NextResponse} from 'next/server';
import dbConnect from '@/lib/mongodb';
import {User} from '@/models/User';
import {hashPassword} from '@/lib/utils';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const {token, password} = await req.json();

        if (!token || !password) {
            return NextResponse.json(
                {error: 'Token and password are required'},
                {status: 400}
            );
        }

        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: {$gt: new Date()}
        });

        if (!user) {
            return NextResponse.json(
                {error: 'Invalid or expired reset token'},
                {status: 400}
            );
        }

        const hashedPassword = await hashPassword(password);

        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        return NextResponse.json(
            {message: 'Password reset successful'},
            {status: 200}
        );
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            {error: 'Internal server error'},
            {status: 500}
        );
    }
}

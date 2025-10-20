import {NextRequest, NextResponse} from 'next/server';
import dbConnect from '@/lib/mongodb';
import {User} from '@/models/User';
import {comparePassword, generateToken} from '@/lib/utils';

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

        const user = await User.findOne({email});

        if (!user) {
            return NextResponse.json(
                {error: 'Invalid credentials'},
                {status: 401}
            );
        }

        if (!user.isVerified) {
            return NextResponse.json(
                {error: 'Please verify your email first'},
                {status: 401}
            );
        }

        const isValidPassword = await comparePassword(password, user.password);

        if (!isValidPassword) {
            return NextResponse.json(
                {error: 'Invalid credentials'},
                {status: 401}
            );
        }

        const token = generateToken(user._id.toString());

        return NextResponse.json(
            {message: 'Login successful', token, user: {id: user._id, email: user.email}},
            {status: 200}
        );
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            {error: 'Internal server error'},
            {status: 500}
        );
    }
}

import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateResetToken(): string {
    return require('crypto').randomBytes(32).toString('hex');
}

export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}

export function generateToken(userId: string): string {
    const JWT_SECRET = process.env.JWT_SECRET;
    
    if (!JWT_SECRET || JWT_SECRET.trim() === '') {
        throw new Error('JWT_SECRET is not configured in environment variables');
    }
    
    return jwt.sign({userId}, JWT_SECRET, {expiresIn: '7d'});
}

export function verifyToken(token: string): any {
    try {
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET is not configured');
        }
        return jwt.verify(token, JWT_SECRET);
    } catch {
        return null;
    }
}

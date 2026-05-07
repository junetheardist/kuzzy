import {NextRequest, NextResponse} from 'next/server';
import dbConnect from '@/lib/mongodb';
import {User} from '@/models/User';
import {hashPassword, verifyToken} from '@/lib/utils';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        // Verify the requesting user is an admin
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                {error: 'Unauthorized'},
                {status: 401}
            );
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json(
                {error: 'Invalid or expired token'},
                {status: 401}
            );
        }

        const adminUser = await User.findById(decoded.userId).select('role');
        if (!adminUser || adminUser.role !== 'admin') {
            return NextResponse.json(
                {error: 'Forbidden: Admin access required'},
                {status: 403}
            );
        }

        const {
            // Account credentials
            phone,
            email,
            password,
            // Shop details
            shopName,
            shopAddress,
            shopEmail,
            shopPrimaryPhoneNumber,
            shopSecondaryPhoneNumber,
            saleType,
            discount,
            category,
            // Owner details
            ownerName,
            ownerAddress,
            ownerEmail,
            ownerPrimaryPhoneNumber,
            ownerSecondaryPhoneNumber,
            ownerDiscount,
            businessAccountName,
            // Business registration
            officialBusinessName,
            cacNumber,
            cacDocFile,
            gallery,
        } = await req.json();

        // Phone number is required
        if (!phone) {
            return NextResponse.json(
                {error: 'Phone number is required'},
                {status: 400}
            );
        }

        if (!shopName) {
            return NextResponse.json(
                {error: 'Shop name is required'},
                {status: 400}
            );
        }

        if (!password) {
            return NextResponse.json(
                {error: 'Password is required'},
                {status: 400}
            );
        }

        // Check for duplicate phone
        const existingByPhone = await User.findOne({phone});
        if (existingByPhone) {
            return NextResponse.json(
                {error: 'An account with this phone number already exists'},
                {status: 400}
            );
        }

        // Check for duplicate email if provided
        if (email) {
            const existingByEmail = await User.findOne({email});
            if (existingByEmail) {
                return NextResponse.json(
                    {error: 'An account with this email already exists'},
                    {status: 400}
                );
            }
        }

        // Validate email format if provided
        if (email && !isValidEmail(email)) {
            return NextResponse.json(
                {error: 'Invalid email format'},
                {status: 400}
            );
        }

        if (shopEmail && !isValidEmail(shopEmail)) {
            return NextResponse.json(
                {error: 'Invalid shop email format'},
                {status: 400}
            );
        }

        if (ownerEmail && !isValidEmail(ownerEmail)) {
            return NextResponse.json(
                {error: 'Invalid owner email format'},
                {status: 400}
            );
        }

        const hashedPassword = await hashPassword(password);

        // Build the new vendor user document
        const newUserData: any = {
            phone,
            password: hashedPassword,
            role: 'vendor',
            isVerified: true, // Admin-created accounts are auto-verified
            // Vendor/store details
            shopName,
            shopAddress,
            shopEmail,
            shopPrimaryPhoneNumber: shopPrimaryPhoneNumber || phone,
            shopSecondaryPhoneNumber,
            saleType,
            discount,
            category,
            ownerName,
            ownerAddress,
            ownerEmail,
            ownerPrimaryPhoneNumber: ownerPrimaryPhoneNumber || phone,
            ownerSecondaryPhoneNumber,
            ownerDiscount,
            businessAccountName,
            officialBusinessName,
            cacNumber,
            cacDocFile,
            gallery: gallery || [],
        };

        if (email) {
            newUserData.email = email;
        }

        const vendorUser = await User.create(newUserData);

        const responseUser = vendorUser.toObject();
        delete responseUser.password;
        delete responseUser.otp;
        delete responseUser.otpExpiry;
        delete responseUser.resetToken;
        delete responseUser.resetTokenExpiry;

        return NextResponse.json(
            {
                message: 'Vendor account created successfully',
                vendor: responseUser,
            },
            {status: 201}
        );
    } catch (error) {
        console.error('Admin vendor creation error:', error);

        let errorMessage = 'Internal server error';
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return NextResponse.json(
            {error: errorMessage},
            {status: 500}
        );
    }
}

function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

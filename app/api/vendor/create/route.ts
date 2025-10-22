import {NextRequest, NextResponse} from 'next/server';
import dbConnect from '@/lib/mongodb';
import {User} from '@/models/User';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const {
            userId,
            // Shop details
            shopName,
            shopAddress,
            shopEmail,
            shopPrimaryPhoneNumber,
            shopSecondaryPhoneNumber,
            saleType,
            discount,
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
            gallery
        } = await req.json();

        // Validate required fields
        if (!userId) {
            return NextResponse.json(
                {error: 'User ID is required'},
                {status: 400}
            );
        }

        if (!shopName || !shopAddress || !ownerName) {
            return NextResponse.json(
                {error: 'Shop name, shop address, and owner name are required'},
                {status: 400}
            );
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json(
                {error: 'User not found'},
                {status: 404}
            );
        }

        // Check if user is verified
        if (!user.isVerified) {
            return NextResponse.json(
                {error: 'Please verify your email before creating a vendor profile'},
                {status: 403}
            );
        }

        // Check if vendor profile already exists
        if (user.shopName) {
            return NextResponse.json(
                {error: 'Vendor profile already exists for this user'},
                {status: 400}
            );
        }

        // Validate email formats if provided
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

        // Update user with vendor details
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                shopName,
                shopAddress,
                shopEmail,
                shopPrimaryPhoneNumber,
                shopSecondaryPhoneNumber,
                saleType,
                discount,
                ownerName,
                ownerAddress,
                ownerEmail,
                ownerPrimaryPhoneNumber,
                ownerSecondaryPhoneNumber,
                ownerDiscount,
                businessAccountName,
                officialBusinessName,
                cacNumber,
                cacDocFile,
                gallery: gallery || []
            },
            {new: true, runValidators: true}
        ).select('-password -otp -otpExpiry -resetToken -resetTokenExpiry');

        return NextResponse.json(
            {
                message: 'Vendor profile created successfully',
                vendor: updatedUser
            },
            {status: 201}
        );
    } catch (error) {
        console.error('Vendor creation error:', error);
        return NextResponse.json(
            {error: 'Internal server error'},
            {status: 500}
        );
    }
}

// Helper function to validate email
function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

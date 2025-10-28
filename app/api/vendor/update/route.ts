import {NextRequest, NextResponse} from 'next/server';
import dbConnect from '@/lib/mongodb';
import {User} from '@/models/User';

export async function PUT(req: NextRequest) {
    try {
        await dbConnect();

        const {
            userId,
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
            gallery
        } = await req.json();

        // --- Basic Validation ---
        if (!userId) {
            return NextResponse.json(
                {error: 'User ID is required'},
                {status: 400}
            );
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json(
                {error: 'User not found'},
                {status: 404}
            );
        }

        // If user is not verified, don’t allow update
        if (!user.isVerified) {
            return NextResponse.json(
                {error: 'Please verify your email before updating your vendor profile'},
                {status: 403}
            );
        }

        // --- Optional email format checks ---
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

        // --- Only update provided fields ---
        const updateData: any = {};
        const fields = [
            'shopName',
            'shopAddress',
            'shopEmail',
            'shopPrimaryPhoneNumber',
            'shopSecondaryPhoneNumber',
            'saleType',
            'discount',
            'ownerName',
            'ownerAddress',
            'ownerEmail',
            'ownerPrimaryPhoneNumber',
            'ownerSecondaryPhoneNumber',
            'ownerDiscount',
            'businessAccountName',
            'officialBusinessName',
            'cacNumber',
            'cacDocFile',
            'gallery',
        ];

        for (const key of fields) {
            const value = eval(key); // dynamic lookup for destructured values
            if (value !== undefined && value !== null && value !== '') {
                updateData[key] = value;
            }
        }

        // --- Update vendor profile ---
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {$set: updateData},
            {new: true, runValidators: true}
        ).select('-password -otp -otpExpiry -resetToken -resetTokenExpiry');

        if (!updatedUser) {
            return NextResponse.json(
                {error: 'Failed to update vendor profile'},
                {status: 500}
            );
        }

        return NextResponse.json(
            {
                message: 'Vendor profile updated successfully',
                vendor: updatedUser,
            },
            {status: 200}
        );
    } catch (error) {
        console.error('Vendor update error:', error);
        return NextResponse.json(
            {error: 'Internal server error'},
            {status: 500}
        );
    }
}

// Reuse same helper
function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

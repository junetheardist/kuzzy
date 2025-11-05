import {NextRequest, NextResponse} from "next/server";
import dbConnect from "@/lib/mongodb";
import {User} from "@/models/User";

// GET /api/vendor/[id]
export async function GET(
    req: NextRequest,
    context: {
        params: Promise<{ id: string }>
    }
) {
    try {
        const {id} = await context.params;
        await dbConnect();

        const vendor = await User.findById(id).select(
            "-password -otp -otpExpiry -resetToken -resetTokenExpiry"
        );

        if (!vendor) {
            return NextResponse.json({error: "Vendor not found"}, {status: 404});
        }

        if (!vendor.shopName) {
            return NextResponse.json(
                {error: "This user has no vendor profile"},
                {status: 400}
            );
        }

        return NextResponse.json({vendor}, {status: 200});
    } catch (error) {
        console.error("Error fetching vendor:", error);
        return NextResponse.json({error: "Internal server error"}, {status: 500});
    }
}

// DELETE /api/vendor/[id]
export async function DELETE(
    req: NextRequest,
    {params}: { params: { id: string } }
) {
    try {
        await dbConnect();

        const user = await User.findById(params.id);
        if (!user) {
            return NextResponse.json({error: "Vendor not found"}, {status: 404});
        }

        // Instead of deleting the whole user, just clear vendor fields
        const vendorFields = [
            "shopName",
            "shopAddress",
            "shopEmail",
            "shopPrimaryPhoneNumber",
            "shopSecondaryPhoneNumber",
            "saleType",
            "discount",
            "ownerName",
            "ownerAddress",
            "ownerEmail",
            "ownerPrimaryPhoneNumber",
            "ownerSecondaryPhoneNumber",
            "ownerDiscount",
            "businessAccountName",
            "officialBusinessName",
            "cacNumber",
            "cacDocFile",
            "gallery",
        ];

        vendorFields.forEach((f) => (user[f] = undefined));
        await user.save();

        return NextResponse.json(
            {message: "Vendor profile deleted successfully"},
            {status: 200}
        );
    } catch (error) {
        console.error("Error deleting vendor:", error);
        return NextResponse.json({error: "Internal server error"}, {status: 500});
    }
}

import {NextResponse} from "next/server";
import dbConnect from "@/lib/mongodb";
import {User} from "@/models/User";

export async function GET() {
    try {
        await dbConnect();

        // Fetch all vendors — filter users who have vendor details
        const vendors = await User.find({
            shopName: {$exists: true, $ne: ""},
        }).select("-password -otp -otpExpiry -resetToken -resetTokenExpiry");

        if (!vendors || vendors.length === 0) {
            return NextResponse.json(
                {message: "No vendors found", vendors: []},
                {status: 200}
            );
        }

        return NextResponse.json({vendors}, {status: 200});
    } catch (error) {
        console.error("Error fetching vendors:", error);
        return NextResponse.json(
            {error: "Internal server error"},
            {status: 500}
        );
    }
}

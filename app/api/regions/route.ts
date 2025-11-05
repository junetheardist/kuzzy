import {NextResponse} from "next/server";
import connectDB from "@/lib/mongodb";
import Region from "@/models/Region";
import Country from "@/models/Country";
import mongoose from "mongoose";

export async function GET() {
    try {
        await connectDB();
        const regions = await Region.find().populate("states").populate("country").lean();
        return NextResponse.json({success: true, data: regions}, {status: 200});
    } catch (err) {
        return NextResponse.json({success: false, error: (err as Error).message}, {status: 500});
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        console.log(body);
        const {name, parentId: countryId} = body;
        if (!name || !countryId) return NextResponse.json({
            success: false,
            error: "name and country are required"
        }, {status: 400});
        if (!mongoose.Types.ObjectId.isValid(countryId)) return NextResponse.json({
            success: false,
            error: "Invalid country id"
        }, {status: 400});

        const region = await Region.create({name, country: countryId, states: []});

        await Country.findByIdAndUpdate(countryId, {$addToSet: {regions: region._id}});

        return NextResponse.json({success: true, data: region}, {status: 201});
    } catch (err) {
        return NextResponse.json({success: false, error: (err as Error).message}, {status: 500});
    }
}

import {NextResponse} from "next/server";
import connectDB from "@/lib/mongodb";
import Street from "@/models/Street";
import City from "@/models/City";
import mongoose from "mongoose";

export async function GET() {
    try {
        await connectDB();
        const streets = await Street.find().populate("city").populate("state").populate("region").populate("country").lean();
        return NextResponse.json({success: true, data: streets}, {status: 200});
    } catch (err) {
        return NextResponse.json({success: false, error: (err as Error).message}, {status: 500});
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const {name, country, region, state, city} = body;
        if (!name || !country || !region || !state || !city) return NextResponse.json({
            success: false,
            error: "Missing required fields"
        }, {status: 400});

        if (!mongoose.Types.ObjectId.isValid(country) || !mongoose.Types.ObjectId.isValid(region) || !mongoose.Types.ObjectId.isValid(state) || !mongoose.Types.ObjectId.isValid(city)) {
            return NextResponse.json({success: false, error: "Invalid ids"}, {status: 400});
        }

        const street = await Street.create({name, country, region, state, city});

        // push to city.streets
        await City.findByIdAndUpdate(city, {$addToSet: {streets: street._id}});

        return NextResponse.json({success: true, data: street}, {status: 201});
    } catch (err) {
        return NextResponse.json({success: false, error: (err as Error).message}, {status: 500});
    }
}

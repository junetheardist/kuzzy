import {NextResponse} from "next/server";
import connectDB from "@/lib/mongodb";
import City from "@/models/City";
import State from "@/models/State";
import mongoose from "mongoose";

export async function GET() {
    try {
        await connectDB();
        const cities = await City.find().populate("streets").populate("state").populate("region").populate("country").lean();
        return NextResponse.json({success: true, data: cities}, {status: 200});
    } catch (err) {
        return NextResponse.json({success: false, error: (err as Error).message}, {status: 500});
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const {name, parentId2: countryId, parentId1: regionId, parentId: stateId} = body;
        if (!name || !countryId || !regionId || !stateId) return NextResponse.json({
            success: false,
            error: "name, country, region and state are required"
        }, {status: 400});

        if (!mongoose.Types.ObjectId.isValid(countryId) || !mongoose.Types.ObjectId.isValid(regionId) || !mongoose.Types.ObjectId.isValid(stateId)) {
            return NextResponse.json({success: false, error: "Invalid ids"}, {status: 400});
        }

        const city = await City.create({name, country: countryId, region: regionId, state: stateId, streets: []});

        // link to state
        await State.findByIdAndUpdate(stateId, {$addToSet: {cities: city._id}});

        return NextResponse.json({success: true, data: city}, {status: 201});
    } catch (err) {
        return NextResponse.json({success: false, error: (err as Error).message}, {status: 500});
    }
}

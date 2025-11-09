// app/api/states/route.ts
import {NextResponse} from "next/server";
import connectDB from "@/lib/mongodb";
import State from "@/models/State";
import Region from "@/models/Region";
import mongoose from "mongoose";

export async function GET() {
    try {
        await connectDB();
        const states = await State.find().populate("cities").populate("region").populate("country").lean();
        return NextResponse.json({success: true, data: states}, {status: 200});
    } catch (err) {
        return NextResponse.json({success: false, error: (err as Error).message}, {status: 500});
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        console.log(body)
        const {name, parentId1: countryId, parentId: regionId} = body;
        if (!name || !countryId || !regionId) return NextResponse.json({
            success: false,
            error: "name, country and region are required"
        }, {status: 400});
        if (!mongoose.Types.ObjectId.isValid(countryId) || !mongoose.Types.ObjectId.isValid(regionId)) return NextResponse.json({
            success: false,
            error: "Invalid ids"
        }, {status: 400});

        const state = await State.create({name, country: countryId, region: regionId, cities: []});

        // link to region and country
        await Region.findByIdAndUpdate(regionId, {$addToSet: {states: state._id}});

        return NextResponse.json({success: true, data: state}, {status: 201});
    } catch (err) {
        return NextResponse.json({success: false, error: (err as Error).message}, {status: 500});
    }
}

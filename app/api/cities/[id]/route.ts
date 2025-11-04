import {NextResponse} from "next/server";
import connectDB from "@/lib/mongodb";
import City from "@/models/City";
import State from "@/models/State";
import mongoose from "mongoose";

export async function GET(_request: Request, {params}: { params: { id: string } }) {
    try {
        await connectDB();
        const {id} = params;
        if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({
            success: false,
            error: "Invalid id"
        }, {status: 400});

        const city = await City.findById(id).populate("streets").populate("state").populate("region").populate("country");
        if (!city) return NextResponse.json({success: false, error: "Not found"}, {status: 404});

        return NextResponse.json({success: true, data: city}, {status: 200});
    } catch (err) {
        return NextResponse.json({success: false, error: (err as Error).message}, {status: 500});
    }
}

export async function PUT(request: Request, {params}: { params: { id: string } }) {
    try {
        await connectDB();
        const {id} = params;
        const updates = await request.json();
        if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({
            success: false,
            error: "Invalid id"
        }, {status: 400});

        const original = await City.findById(id);
        if (!original) return NextResponse.json({success: false, error: "Not found"}, {status: 404});

        // if state changed, update state's city array
        if (updates.state && updates.state !== String(original.state)) {
            if (!mongoose.Types.ObjectId.isValid(updates.state)) return NextResponse.json({
                success: false,
                error: "Invalid state id"
            }, {status: 400});
            await State.findByIdAndUpdate(original.state, {$pull: {cities: original._id}});
            await State.findByIdAndUpdate(updates.state, {$addToSet: {cities: original._id}});
        }

        const updated = await City.findByIdAndUpdate(id, updates, {new: true});
        return NextResponse.json({success: true, data: updated}, {status: 200});
    } catch (err) {
        return NextResponse.json({success: false, error: (err as Error).message}, {status: 500});
    }
}

export async function DELETE(_request: Request, {params}: { params: { id: string } }) {
    try {
        await connectDB();
        const {id} = params;
        if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({
            success: false,
            error: "Invalid id"
        }, {status: 400});

        const city = await City.findByIdAndDelete(id);
        if (!city) return NextResponse.json({success: false, error: "Not found"}, {status: 404});

        await State.findByIdAndUpdate(city.state, {$pull: {cities: city._id}});

        return NextResponse.json({success: true, data: city}, {status: 200});
    } catch (err) {
        return NextResponse.json({success: false, error: (err as Error).message}, {status: 500});
    }
}

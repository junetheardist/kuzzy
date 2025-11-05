import {NextResponse} from "next/server";
import connectDB from "@/lib/mongodb";
import State from "@/models/State";
import Region from "@/models/Region";
import City from "@/models/City";
import mongoose from "mongoose";

export async function GET(_request: Request, context: {
    params: Promise<{ id: string }>
}) {
    City;
    try {
        await connectDB();
        const {id} = await context.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({
            success: false,
            error: "Invalid id"
        }, {status: 400});

        const state = await State.find({region: id}).populate("cities").populate("region").populate("country");
        if (!state) return NextResponse.json({success: false, error: "Not found"}, {status: 404});

        return NextResponse.json({success: true, data: state}, {status: 200});
    } catch (err) {
        return NextResponse.json({success: false, error: (err as Error).message}, {status: 500});
    }
}

export async function PUT(request: Request, context: {
    params: Promise<{ id: string }>
}) {
    try {
        await connectDB();
        const {id} = await context.params;
        const updates = await request.json();
        if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({
            success: false,
            error: "Invalid id"
        }, {status: 400});

        const original = await State.findById(id);
        if (!original) return NextResponse.json({success: false, error: "Not found"}, {status: 404});

        // if region changed, update parent arrays
        if (updates.region && updates.region !== String(original.region)) {
            if (!mongoose.Types.ObjectId.isValid(updates.region)) return NextResponse.json({
                success: false,
                error: "Invalid region id"
            }, {status: 400});
            await Region.findByIdAndUpdate(original.region, {$pull: {states: original._id}});
            await Region.findByIdAndUpdate(updates.region, {$addToSet: {states: original._id}});
        }

        const updated = await State.findByIdAndUpdate(id, updates, {new: true});
        return NextResponse.json({success: true, data: updated}, {status: 200});
    } catch (err) {
        return NextResponse.json({success: false, error: (err as Error).message}, {status: 500});
    }
}

export async function DELETE(_request: Request, context: {
    params: Promise<{ id: string }>
}) {
    try {
        await connectDB();
        const {id} = await context.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({
            success: false,
            error: "Invalid id"
        }, {status: 400});

        const state = await State.findByIdAndDelete(id);
        if (!state) return NextResponse.json({success: false, error: "Not found"}, {status: 404});

        // remove from region.states
        await Region.findByIdAndUpdate(state.region, {$pull: {states: state._id}});

        return NextResponse.json({success: true, data: state}, {status: 200});
    } catch (err) {
        return NextResponse.json({success: false, error: (err as Error).message}, {status: 500});
    }
}

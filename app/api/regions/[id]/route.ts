import {NextResponse} from "next/server";
import connectDB from "@/lib/mongodb";
import Region from "@/models/Region";
import Country from "@/models/Country";
import mongoose from "mongoose";

export async function GET(_request: Request, context: {
    params: Promise<{ id: string }>
}) {

    try {
        await connectDB();
        const {id} = await context.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({
            success: false,
            error: "Invalid id"
        }, {status: 400});

        const region = await Region.find({country: id}).populate("states").populate("country");
        if (!region) return NextResponse.json({success: false, error: "Not found"}, {status: 404});

        return NextResponse.json({success: true, data: region}, {status: 200});
    } catch (err) {
        console.log(err)
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

        const original = await Region.findById(id);
        if (!original) return NextResponse.json({success: false, error: "Not found"}, {status: 404});

        // handle country switch: update parent arrays
        if (updates.country && updates.country !== String(original.country)) {
            if (!mongoose.Types.ObjectId.isValid(updates.country)) return NextResponse.json({
                success: false,
                error: "Invalid country id"
            }, {status: 400});
            await Country.findByIdAndUpdate(original.country, {$pull: {regions: original._id}});
            await Country.findByIdAndUpdate(updates.country, {$addToSet: {regions: original._id}});
        }

        const updated = await Region.findByIdAndUpdate(id, updates, {new: true});
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

        const region = await Region.findByIdAndDelete(id);
        if (!region) return NextResponse.json({success: false, error: "Not found"}, {status: 404});

        // remove from country.regions
        await Country.findByIdAndUpdate(region.country, {$pull: {regions: region._id}});

        return NextResponse.json({success: true, data: region}, {status: 200});
    } catch (err) {
        return NextResponse.json({success: false, error: (err as Error).message}, {status: 500});
    }
}

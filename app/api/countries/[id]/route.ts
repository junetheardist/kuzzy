import {NextResponse} from "next/server";
import connectDB from "@/lib/mongodb";
import Country from "@/models/Country";
import mongoose from "mongoose";

export async function GET(_request: Request, {params}: { params: { id: string } }) {
    try {
        await connectDB();
        const {id} = params;
        if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({
            success: false,
            error: "Invalid id"
        }, {status: 400});

        const country = await Country.findById(id).populate({path: "regions"});
        if (!country) return NextResponse.json({success: false, error: "Not found"}, {status: 404});

        return NextResponse.json({success: true, data: country}, {status: 200});
    } catch (err) {
        return NextResponse.json({success: false, error: (err as Error).message}, {status: 500});
    }
}

export async function PUT(request: Request, {params}: { params: { id: string } }) {
    try {
        await connectDB();
        const {id} = params;
        if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({
            success: false,
            error: "Invalid id"
        }, {status: 400});

        const updates = await request.json();
        const country = await Country.findByIdAndUpdate(id, updates, {new: true});
        if (!country) return NextResponse.json({success: false, error: "Not found"}, {status: 404});

        return NextResponse.json({success: true, data: country}, {status: 200});
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

        const deleted = await Country.findByIdAndDelete(id);
        if (!deleted) return NextResponse.json({success: false, error: "Not found"}, {status: 404});

        // Optionally: you might want to cascade-delete regions etc. or leave them orphaned.
        return NextResponse.json({success: true, data: deleted}, {status: 200});
    } catch (err) {
        return NextResponse.json({success: false, error: (err as Error).message}, {status: 500});
    }
}

import {NextResponse} from "next/server";
import connectDB from "@/lib/mongodb";
import Street from "@/models/Street";
import City from "@/models/City";
import mongoose from "mongoose";

export async function GET(_request: Request, {params}: { params: { id: string } }) {
    try {
        await connectDB();
        const {id} = params;
        if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({
            success: false,
            error: "Invalid id"
        }, {status: 400});

        const street = await Street.findById(id).populate("city").populate("state").populate("region").populate("country");
        if (!street) return NextResponse.json({success: false, error: "Not found"}, {status: 404});

        return NextResponse.json({success: true, data: street}, {status: 200});
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

        const original = await Street.findById(id);
        if (!original) return NextResponse.json({success: false, error: "Not found"}, {status: 404});

        // if city changed, update city's streets array
        if (updates.city && updates.city !== String(original.city)) {
            if (!mongoose.Types.ObjectId.isValid(updates.city)) return NextResponse.json({
                success: false,
                error: "Invalid city id"
            }, {status: 400});
            await City.findByIdAndUpdate(original.city, {$pull: {streets: original._id}});
            await City.findByIdAndUpdate(updates.city, {$addToSet: {streets: original._id}});
        }

        const updated = await Street.findByIdAndUpdate(id, updates, {new: true});
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

        const street = await Street.findByIdAndDelete(id);
        if (!street) return NextResponse.json({success: false, error: "Not found"}, {status: 404});

        await City.findByIdAndUpdate(street.city, {$pull: {streets: street._id}});

        return NextResponse.json({success: true, data: street}, {status: 200});
    } catch (err) {
        return NextResponse.json({success: false, error: (err as Error).message}, {status: 500});
    }
}

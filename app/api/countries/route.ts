import {NextResponse} from "next/server";
import connectDB from "@/lib/mongodb";
import Country from "@/models/Country";

export async function GET() {
    try {
        await connectDB();
        const countries = await Country.find().lean();
        return NextResponse.json({success: true, data: countries}, {status: 200});
    } catch (err) {
        return NextResponse.json({success: false, error: (err as Error).message}, {status: 500});
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        if (!body.name) return NextResponse.json({success: false, error: "name is required"}, {status: 400});

        const existing = await Country.findOne({name: body.name});
        if (existing) return NextResponse.json({success: false, error: "Country already exists"}, {status: 409});

        const country = await Country.create({name: body.name, regions: body.regions ?? []});
        return NextResponse.json({success: true, data: country}, {status: 201});
    } catch (err) {
        return NextResponse.json({success: false, error: (err as Error).message}, {status: 500});
    }
}

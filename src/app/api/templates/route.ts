import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Template from "@/models/Template";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const templates = await Template.find({
      userId: user.userId,
      company: user.company,
    }).sort({ name: 1 });

    return NextResponse.json(templates);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const template = await Template.create({
      ...body,
      userId: user.userId,
      company: user.company,
    });

    return NextResponse.json(template, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

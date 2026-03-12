import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import MessageLog from "@/models/MessageLog";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const logs = await MessageLog.find({
      userId: user.userId,
      company: user.company,
    }).sort({ createdAt: -1 });

    return NextResponse.json(logs);
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
    const log = await MessageLog.create({
      ...body,
      userId: user.userId,
      company: user.company,
    });

    return NextResponse.json(log, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import TeamMember from "@/models/TeamMember";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await connectDB();
    const decoded = await getAuthUser();
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const team = await TeamMember.find({ userId: decoded.userId }).sort({ createdAt: -1 });
    return NextResponse.json(team);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const decoded = await getAuthUser();
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const member = await TeamMember.create({
      ...data,
      userId: decoded.userId
    });

    return NextResponse.json(member, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

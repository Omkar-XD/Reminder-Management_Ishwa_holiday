import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import TeamMember from "@/models/TeamMember";
import { getAuthUser } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const decoded = await getAuthUser();
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const member = await TeamMember.findOneAndUpdate(
      { _id: id, userId: decoded.userId },
      data,
      { new: true }
    );

    if (!member) return NextResponse.json({ message: "Member not found" }, { status: 404 });
    return NextResponse.json(member);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const decoded = await getAuthUser();
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const member = await TeamMember.findOneAndDelete({ _id: id, userId: decoded.userId });
    if (!member) return NextResponse.json({ message: "Member not found" }, { status: 404 });

    return NextResponse.json({ message: "Member deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

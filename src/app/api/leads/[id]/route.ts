import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { getAuthUser } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const lead = await Lead.findOneAndUpdate(
      { _id: id, userId: user.userId },
      { ...body },
      { new: true }
    );

    if (!lead) return NextResponse.json({ message: "Lead not found" }, { status: 404 });

    return NextResponse.json(lead);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const lead = await Lead.findOneAndDelete({ _id: id, userId: user.userId });
    if (!lead) return NextResponse.json({ message: "Lead not found" }, { status: 404 });

    return NextResponse.json({ message: "Lead deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

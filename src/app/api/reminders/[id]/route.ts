import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Reminder from "@/models/Reminder";
import { getAuthUser } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const updatedReminder = await Reminder.findOneAndUpdate(
      { _id: id, userId: user.userId },
      body,
      { new: true }
    );

    if (!updatedReminder) {
      return NextResponse.json({ message: "Reminder not found" }, { status: 404 });
    }

    return NextResponse.json(updatedReminder);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const deletedReminder = await Reminder.findOneAndDelete({
      _id: id,
      userId: user.userId,
    });

    if (!deletedReminder) {
      return NextResponse.json({ message: "Reminder not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Reminder deleted" });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Reminder from "@/models/Reminder";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const reminders = await Reminder.find({
      userId: user.userId,
      company: user.company,
    }).sort({ dueDate: 1 });

    return NextResponse.json(reminders);
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
    const reminder = await Reminder.create({
      ...body,
      userId: user.userId,
      company: user.company,
    });

    return NextResponse.json(reminder, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

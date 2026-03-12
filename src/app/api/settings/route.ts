import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { getAuthUser } from "@/lib/auth";

export async function PUT(req: Request) {
  try {
    await connectDB();
    const decoded = await getAuthUser();
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { 
      ultramsgInstanceId, ultramsgToken, 
      smtpHost, smtpPort, smtpUser, smtpPass, fromEmail 
    } = await req.json();

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { 
        ultramsgInstanceId, ultramsgToken,
        smtpHost, smtpPort, smtpUser, smtpPass, fromEmail
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Settings updated successfully" });
  } catch (err: any) {
    console.error("Settings update error:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";
import { sendWhatsAppDirectMessage } from "@/lib/whatsapp";

export async function POST(req: Request) {
  try {
    const { to, message } = await req.json();

    if (!to || !message) {
      return NextResponse.json({ error: "Phone number and message are required" }, { status: 400 });
    }

    await connectDB();
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const result = await sendWhatsAppDirectMessage(to, message);

    console.log("Direct WhatsApp API Result:", JSON.stringify(result, null, 2));

    if (result.success) {
      return NextResponse.json({ success: true, data: result.data });
    } else {
      return NextResponse.json({ error: result.error || "Failed to send message via Infobip" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Error sending direct WhatsApp message:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

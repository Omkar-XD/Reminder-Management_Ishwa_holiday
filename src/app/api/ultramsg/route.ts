import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { to, message } = await req.json();

    if (!to || !message) {
      return NextResponse.json({ error: "Phone number and message are required" }, { status: 400 });
    }

    await connectDB();
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await User.findById(user.userId);
    
    const instanceId = dbUser?.ultramsgInstanceId || process.env.ULTRAMSG_INSTANCE_ID;
    const token = dbUser?.ultramsgToken || process.env.ULTRAMSG_TOKEN;

    if (!instanceId || !token) {
      return NextResponse.json({ error: "UltraMsg credentials are not configured" }, { status: 500 });
    }

    // Format phone number for UltraMsg
    let digits = to.replace(/\D/g, "");

    if (digits.length === 10) {
      digits = `91${digits}`;
    } else if (digits.length === 11 && digits.startsWith("0")) {
      digits = `91${digits.substring(1)}`;
    } else if (digits.length > 10 && digits.startsWith("00")) {
      digits = digits.substring(2);
    }

    const formattedPhone = digits;
    const url = `https://api.ultramsg.com/${instanceId}/messages/chat`;

    const params = new URLSearchParams();
    params.append("token", token);
    params.append("to", formattedPhone);
    params.append("body", message);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    const data = await response.json();

    if (data.sent === "true" || data.id) {
      return NextResponse.json({ success: true, data });
    } else {
      return NextResponse.json({ error: data.error || "Failed to send message via UltraMsg" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

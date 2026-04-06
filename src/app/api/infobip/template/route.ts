import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";
import { sendWhatsAppMessage } from "@/lib/whatsapp";

export async function POST(req: Request) {
  try {
    const { to, templateName, variables } = await req.json();

    if (!to || !templateName) {
      return NextResponse.json({ error: "Phone number and template name are required" }, { status: 400 });
    }

    await connectDB();
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    console.log(`Sending WhatsApp Template: ${templateName} to ${to}`);
    
    const result = await sendWhatsAppMessage(to, templateName, variables || []);

    console.log("Template WhatsApp API Result:", JSON.stringify(result, null, 2));

    if (result.success) {
      return NextResponse.json({ success: true, data: result.data });
    } else {
      return NextResponse.json({ 
        error: result.error || "Failed to send template message via Infobip",
        details: result.data
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Error sending template WhatsApp message:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

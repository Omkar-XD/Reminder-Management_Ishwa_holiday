import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Reminder from "@/models/Reminder";
import { getAuthUser } from "@/lib/auth";
import { sendWhatsAppMessage } from "@/lib/whatsapp";

export async function GET() {
  try {
    await connectDB();
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const reminders = await Reminder.find({
      userId: user.userId,
      company: user.company,
    }).sort({ dueDate: 1 }).populate("customerId");

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

    // Check if it should be sent immediately
    const now = new Date();
    if (new Date(reminder.dueDate) <= now && !reminder.whatsappSent) {
      let recipientPhone = reminder.phoneNumber;
      if (!recipientPhone && reminder.customerId) {
        // Need to fetch customer details if not provided directly
        const Customer = (await import("@/models/Customer")).default;
        const customer = await Customer.findById(reminder.customerId);
        if (customer) recipientPhone = customer.phone;
      }

      if (recipientPhone) {
        const templateName = process.env.WHATSAPP_TEMPLATE_NAME || "reminder_template";
        const variables = [
          reminder.title,
          reminder.type,
          new Date(reminder.dueDate).toLocaleDateString(),
        ];

        const sendResult = await sendWhatsAppMessage(recipientPhone, templateName, variables);
        if (sendResult.success) {
          reminder.whatsappSent = true;
          await reminder.save();
        }
      }
    }

    return NextResponse.json(reminder, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

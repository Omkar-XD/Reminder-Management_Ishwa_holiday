import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Reminder from "@/models/Reminder";
import Customer from "@/models/Customer";
import { sendWhatsAppMessage } from "@/lib/whatsapp";

export async function GET(req: Request) {
  try {
    await connectDB();

    // Find pending reminders that are due and haven't been sent via WhatsApp
    const now = new Date();
    const pendingReminders = await Reminder.find({
      status: "pending",
      whatsappSent: false,
      dueDate: { $lte: now },
    }).populate("customerId");

    const results = [];

    for (const reminder of pendingReminders) {
      let recipientPhone = reminder.phoneNumber;

      // If no direct phone number, try getting it from the customer
      if (!recipientPhone && reminder.customerId) {
        // Since we used .populate("customerId"), reminder.customerId is the Customer object
        recipientPhone = (reminder.customerId as any).phone;
      }

      if (recipientPhone) {
        const templateName = process.env.WHATSAPP_TEMPLATE_NAME || "reminder_template";
        const variables = [
          reminder.title,
          reminder.type,
          reminder.dueDate.toLocaleDateString(),
        ];

        const sendResult = await sendWhatsAppMessage(recipientPhone, templateName, variables);

        if (sendResult.success) {
          reminder.whatsappSent = true;
          await reminder.save();
          results.push({ id: reminder._id, status: "sent" });
        } else {
          results.push({ id: reminder._id, status: "failed", error: sendResult.error });
        }
      } else {
        results.push({ id: reminder._id, status: "skipped", reason: "No phone number found" });
      }
    }

    return NextResponse.json({
      message: `Processed ${pendingReminders.length} reminders`,
      results,
    });
  } catch (error: any) {
    console.error("Cron Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

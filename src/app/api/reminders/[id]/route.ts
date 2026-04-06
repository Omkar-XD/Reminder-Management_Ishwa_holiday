import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Reminder from "@/models/Reminder";
import { getAuthUser } from "@/lib/auth";
import { sendWhatsAppMessage } from "@/lib/whatsapp";

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
    ).populate("customerId");

    if (!updatedReminder) {
      return NextResponse.json({ message: "Reminder not found" }, { status: 404 });
    }

    // Check if it should be sent immediately after update
    const now = new Date();
    if (new Date(updatedReminder.dueDate) <= now && !updatedReminder.whatsappSent) {
      let recipientPhone = updatedReminder.phoneNumber;

      if (!recipientPhone && updatedReminder.customerId) {
        recipientPhone = (updatedReminder.customerId as any).phone;
      }

      if (recipientPhone) {
        const templateName = process.env.WHATSAPP_TEMPLATE_NAME || "reminder_template";
        const variables = [
          updatedReminder.title,
          updatedReminder.type,
          new Date(updatedReminder.dueDate).toLocaleDateString(),
        ];

        const sendResult = await sendWhatsAppMessage(recipientPhone, templateName, variables);

        if (sendResult.success) {
          updatedReminder.whatsappSent = true;
          await updatedReminder.save();
        }
      }
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

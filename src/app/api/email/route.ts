import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();
    const decoded = await getAuthUser();
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { to, subject, message } = await req.json();

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const host = user.smtpHost || process.env.SMTP_HOST;
    const port = parseInt(user.smtpPort || process.env.SMTP_PORT || "587");
    const smtpUser = user.smtpUser || process.env.SMTP_USER;
    const smtpPass = user.smtpPass || process.env.SMTP_PASS;
    const fromEmail = user.fromEmail || process.env.FROM_EMAIL;

    if (!host || !smtpUser || !smtpPass) {
      return NextResponse.json({ message: "SMTP configuration missing" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: `"${user.company}" <${fromEmail}>`,
      to,
      subject: subject || `Reminder from ${user.company}`,
      text: message,
      html: `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; rounded: 10px;">
              <h2 style="color: #059669;">${user.company}</h2>
              <p style="white-space: pre-wrap;">${message}</p>
              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
              <p style="font-size: 12px; color: #64748b;">This is an automated reminder from the Ishwa Holidays Administrative Portal.</p>
            </div>`,
    });

    return NextResponse.json({ message: "Email transmitted successfully" });
  } catch (err: any) {
    console.error("Email API error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

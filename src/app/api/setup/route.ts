import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();
    
    const email = "ishwa@gmail.com";
    const password = "ishwa123";
    const company = "Ishwa Holidays";

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Admin already exists", user: email });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      company,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json({ 
      message: "Admin created successfully!", 
      credentials: { email, password } 
    });
  } catch (err: any) {
    console.error("Setup Error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

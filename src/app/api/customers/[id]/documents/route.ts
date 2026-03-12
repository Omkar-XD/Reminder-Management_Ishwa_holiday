import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Customer from "@/models/Customer";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const customer = await Customer.findById(id);
    if (!customer) return NextResponse.json({ message: "Customer not found" }, { status: 404 });
    return NextResponse.json(customer.documents || []);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { fileName, docType, fileData, fileType } = await req.json();

    const customer = await Customer.findById(id);
    if (!customer) return NextResponse.json({ message: "Customer not found" }, { status: 404 });

    const newDoc = {
      name: fileName,
      type: docType,
      url: fileData, // Storing as Base64 for simplicity
      fileType: fileType,
      uploadedAt: new Date()
    };

    customer.documents.push(newDoc);
    await customer.save();

    return NextResponse.json(newDoc, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Customer from "@/models/Customer";
import { getAuthUser } from "@/lib/auth";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string, docId: string }> }) {
  try {
    const { id, docId } = await params;
    await connectDB();
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const customer = await Customer.findById(id);
    if (!customer) return NextResponse.json({ message: "Customer not found" }, { status: 404 });

    customer.documents = customer.documents.filter((doc: any) => doc._id.toString() !== docId);
    await customer.save();

    return NextResponse.json({ message: "Document deleted" });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

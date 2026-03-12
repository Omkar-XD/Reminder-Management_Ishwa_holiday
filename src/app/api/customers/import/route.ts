import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Customer from "@/models/Customer";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    await connectDB();

    const formattedData = data.map((item) => ({
      userId: user.userId,
      company: user.company || "Ishwa Holidays",
      name: item["Name"],
      phone: item["Phone Number"] || item["Mobile"] || item["Phone"],
      email: item["Email"] || item["E-Mail ID"] || item["E-mail"],
      passportNo: item["Passport No"],
      visaNo: item["Visa No"],
      companyName: item["Company Name"],
      pwd1: item["PWD"],
      userIdExcel: item["User ID"],
      pwd2: item["PWD_1"] || item["PWD_2"] || item["PWD"],
      work: item["Work"],
      applicationDate: item["Application Date"],
      applicationNumber: item["Application Number"],
      puneFRO: item["Pune FRO"],
      status: item["Status"] || "Active",
      remark: item["Remark"],
    }));

    const validData = formattedData.filter((item) => item.name);

    if (validData.length === 0) {
      return NextResponse.json({ success: true, message: "No valid data to import", count: 0 });
    }

    const result = await Customer.insertMany(validData);

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${result.length} customer(s)`,
      count: result.length,
    });
  } catch (error) {
    console.error("Import Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

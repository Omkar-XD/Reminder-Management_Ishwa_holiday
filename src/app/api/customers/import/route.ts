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
      name: item["Name"] || item["Full Name"],
      phone: item["Phone Number"] || item["Mobile"] || item["Phone"] || item["Mobile Number"],
      email: item["Email"] || item["E-Mail ID"] || item["E-mail"] || item["Email Address"],
      dob: item["DOB"] || item["Date of Birth"],
      gender: item["Gender"],
      maritalStatus: item["Marital Status"],
      studentId: item["Document ID"] || item["Student ID"] || item["ID"],
      passportNo: item["Passport No"],
      passportExpiry: item["Passport Expiry"] || item["P_Expiry"],
      visaNo: item["Visa No"],
      visaExpiry: item["Visa Expiry"] || item["V_Expiry"],
      companyName: item["Company Name"] || item["Organization Name"],
      companyId: item["Company ID"] || item["Registration No"],
      companyEmail: item["Company Mail"] || item["Corporate Email"],
      companyContact: item["Company Contact"] || item["Primary Phone"],
      companyRepresentative: item["Representative"] || item["Point of Contact"],
      status: item["Status"] || "Active",
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

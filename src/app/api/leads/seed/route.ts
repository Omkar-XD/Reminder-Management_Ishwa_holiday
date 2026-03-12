import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Lead from "@/models/Lead";
import User from "@/models/User";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const existingLeads = await Lead.countDocuments({ userId: user.userId });
    if (existingLeads > 6) {
        return NextResponse.json({ message: "Seed already exists", count: existingLeads });
    }

    const leads = [
        {
          userId: user.userId,
          company: user.company,
          name: "Rahul Sharma",
          phone: "9876543210",
          email: "rahul@example.com",
          source: "Facebook",
          status: "New",
          assignedTo: "Unassigned",
          destination: "Switzerland",
          budget: "2-3 Lakhs",
          notes: "Interested in honeymoon package for June.",
          followUpDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
        },
        {
          userId: user.userId,
          company: user.company,
          name: "Anjali Gupta",
          phone: "9123456789",
          email: "anjali@test.com",
          source: "Website",
          status: "Contacted",
          assignedTo: user.company === "Ishwa Holidays" ? "Sarthak" : "Admin",
          destination: "Dubai",
          budget: "1.5 Lakhs",
          notes: "Looking for family trip for 4 people.",
          followUpDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
        },
        {
          userId: user.userId,
          company: user.company,
          name: "Vikram Singh",
          phone: "8887776665",
          email: "vikram@singh.com",
          source: "Referral",
          status: "Interested",
          assignedTo: "Manager",
          destination: "Thailand",
          budget: "80k - 1 Lakh",
          notes: "Group trip with friends (6 members).",
          followUpDate: new Date()
        },
        {
          userId: user.userId,
          company: user.company,
          name: "Priya Patel",
          phone: "7776665554",
          email: "priya@travel.com",
          source: "Manual",
          status: "New",
          assignedTo: "Unassigned",
          destination: "Bali",
          budget: "1.2 Lakhs",
          notes: "Interested in wellness and spa resorts.",
          followUpDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
        },
        {
          userId: user.userId,
          company: user.company,
          name: "Amit Kumar",
          phone: "9998887776",
          email: "amit.k@india.com",
          source: "Facebook",
          status: "Converted",
          assignedTo: "Sales Expert",
          destination: "Maldives",
          budget: "4 Lakhs",
          notes: "Booking confirmed for water villa.",
          followUpDate: null
        },
        {
          userId: user.userId,
          company: user.company,
          name: "Sneha Reddy",
          phone: "9112223334",
          email: "sneha.r@gmail.com",
          source: "Other",
          status: "New",
          assignedTo: "Unassigned",
          destination: "Paris",
          budget: "3.5 Lakhs",
          notes: "Planning for anniversary trip in October.",
          followUpDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
        }
    ];

    await Lead.insertMany(leads);
    return NextResponse.json({ message: "Seeded 6 leads successfully" });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

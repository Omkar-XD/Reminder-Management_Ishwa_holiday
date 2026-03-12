const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Manual .env parser
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  });
}

const TeamMemberSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  name: String,
  role: String,
  status: { type: String, enum: ["Office", "On-Trip", "Away"] },
  phone: String,
  color: String
});

const TeamMember = mongoose.models.TeamMember || mongoose.model("TeamMember", TeamMemberSchema);

const teamData = [
    { name: "Suresh Menon", role: "Tour Lead", status: "On-Trip", phone: "+91 98XXX", color: "from-blue-500 to-indigo-600" },
    { name: "Priya Das", role: "Sr. Agent", status: "Office", phone: "+91 97XXX", color: "from-indigo-500 to-violet-600" },
    { name: "Vikram Singh", role: "Logistics", status: "Office", phone: "+91 96XXX", color: "from-purple-500 to-violet-600" },
    { name: "Meera Nair", role: "Customer Rel.", status: "Away", phone: "+91 95XXX", color: "from-slate-400 to-slate-500" },
    { name: "Rahul Sharma", role: "Ops Lead", status: "Office", phone: "+91 94XXX", color: "from-orange-400 to-rose-500" },
    { name: "Sneha Patil", role: "Visa Expert", status: "Office", phone: "+91 93XXX", color: "from-pink-500 to-rose-600" },
    { name: "Amit Verma", role: "Ground Ops", status: "On-Trip", phone: "+91 92XXX", color: "from-cyan-500 to-blue-600" },
    { name: "Anjali Gupta", role: "Accounts", status: "Office", phone: "+91 91XXX", color: "from-amber-400 to-yellow-600" },
];

async function seed() {
    if (!process.env.MONGODB_URI) {
        console.error("MONGODB_URI not found");
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB");
        
        // Get first user to associate
        const User = mongoose.models.User || mongoose.model("User", new mongoose.Schema({ email: String }));
        const user = await User.findOne();
        if (!user) {
            console.log("No user found to associate team with.");
            process.exit(1);
        }

        await TeamMember.deleteMany({ userId: user._id });
        console.log("Cleared existing team for user:", user._id);
        
        for (const member of teamData) {
            await TeamMember.create({
                ...member,
                userId: user._id
            });
        }

        console.log("Team (8 members) seeded successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
}

seed();

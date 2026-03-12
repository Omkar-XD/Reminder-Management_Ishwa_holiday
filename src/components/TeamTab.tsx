"use client";

import { 
  FiPlus, FiPhone, FiCheckCircle, FiMoreHorizontal, FiShield, FiBriefcase, FiZap
} from "react-icons/fi";

export default function TeamTab() {
  const team = [
    { name: "Suresh Menon", role: "Tour Lead", status: "On-Trip", phone: "+91 98XXX", color: "from-blue-500 to-emerald-600" },
    { name: "Priya Das", role: "Sr. Agent", status: "Office", phone: "+91 97XXX", color: "from-emerald-500 to-teal-600" },
    { name: "Vikram Singh", role: "Logistics", status: "Office", phone: "+91 96XXX", color: "from-purple-500 to-violet-600" },
    { name: "Meera Nair", role: "Customer Rel.", status: "Away", phone: "+91 95XXX", color: "from-slate-400 to-slate-500" },
    { name: "Rahul Sharma", role: "Ops Lead", status: "Office", phone: "+91 94XXX", color: "from-orange-400 to-rose-500" },
    { name: "Sneha Patil", role: "Visa Expert", status: "Office", phone: "+91 93XXX", color: "from-pink-500 to-rose-600" },
    { name: "Amit Verma", role: "Ground Ops", status: "On-Trip", phone: "+91 92XXX", color: "from-cyan-500 to-blue-600" },
    { name: "Anjali Gupta", role: "Accounts", status: "Office", phone: "+91 91XXX", color: "from-amber-400 to-yellow-600" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* Operative Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Active Agents", val: team.length, color: "text-emerald-600", bg: "bg-emerald-50", icon: <FiBriefcase /> },
          { label: "Field Leads", val: "4", color: "text-blue-600", bg: "bg-blue-50", icon: <FiShield /> },
          { label: "Ops Health", val: "98%", color: "text-purple-600", bg: "bg-purple-50", icon: <FiZap /> },
          { label: "Duty Officers", val: "2", color: "text-rose-600", bg: "bg-rose-50", icon: <FiPhone /> },
        ].map((s, i) => (
          <div key={i} className="bg-white p-7 rounded-[35px] border border-emerald-50 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center text-lg`}>{s.icon}</div>
                <span className="text-[10px] font-black text-emerald-300 uppercase tracking-widest leading-none">Live</span>
            </div>
            <p className="text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em] mb-1">{s.label}</p>
            <h3 className={`text-2xl font-black text-emerald-950 tracking-tighter uppercase`}>{s.val}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white p-12 rounded-[60px] border border-emerald-50 shadow-sm relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50 rounded-full blur-3xl opacity-50 -mr-40 -mt-40"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <div>
            <h2 className="text-3xl font-black text-emerald-950 uppercase tracking-tighter">Support Infrastructure</h2>
            <p className="text-[10px] text-emerald-500/60 font-black uppercase tracking-[0.3em] mt-2">Personnel deployment & operational status</p>
          </div>
          <button className="bg-emerald-950 text-white px-8 py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-black active:scale-95 transition-all flex items-center gap-3">
            <FiPlus size={18} /> Add Operative
          </button>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {team.map((member, i) => (
            <div key={i} className="group relative flex flex-col items-center p-10 rounded-[50px] bg-emerald-50/20 text-center hover:bg-white hover:shadow-2xl hover:shadow-emerald-900/5 transition-all duration-500 border border-transparent hover:border-emerald-100">

              {/* Status Badge */}
              <div className="absolute top-8 right-8 flex items-center gap-2 px-4 py-1.5 bg-white rounded-full shadow-lg border border-emerald-50">
                <div className={`w-2 h-2 rounded-full ${member.status === 'On-Trip' ? 'bg-amber-500 animate-pulse' : 
                                    member.status === 'Away' ? 'bg-slate-300' : 
                                    'bg-emerald-500 animate-pulse'
                                    }`} />
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-950/40">{member.status}</span>
              </div>

              <div className={`w-24 h-24 rounded-[35px] bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-3xl font-black mb-8 shadow-xl group-hover:scale-110 transition-all duration-500 group-hover:-rotate-6 border-4 border-white`}>
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>

              <h4 className="font-black text-emerald-950 text-xl tracking-tighter mb-1 uppercase italic">{member.name}</h4>
              <p className="text-[10px] font-black uppercase text-emerald-500/60 tracking-[0.2em] mb-8">{member.role}</p>

              <div className="flex gap-4 mt-auto">
                <button className="w-12 h-12 bg-white rounded-2xl text-emerald-300 hover:text-emerald-950 shadow-sm border border-emerald-50 flex items-center justify-center transition-all hover:scale-110">
                  <FiPhone size={20} />
                </button>
                <button className="w-12 h-12 bg-white rounded-2xl text-emerald-300 hover:text-emerald-600 shadow-sm border border-emerald-50 flex items-center justify-center transition-all hover:scale-110">
                  <FiCheckCircle size={20} />
                </button>
                <button className="w-12 h-12 bg-white rounded-2xl text-emerald-300 hover:text-emerald-950 shadow-sm border border-emerald-50 flex items-center justify-center transition-all hover:scale-110">
                  <FiMoreHorizontal size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

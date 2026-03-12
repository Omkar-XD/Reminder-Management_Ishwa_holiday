"use client";

import { useState } from "react";
import { 
  FiPlus, FiPhone, FiCheckCircle, FiMoreHorizontal, FiShield, FiBriefcase, FiZap, FiX, FiTrash2, FiEdit2, FiMail
} from "react-icons/fi";

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  status: "Office" | "On-Trip" | "Away";
  phone: string;
  email?: string;
  color: string;
}

interface TeamTabProps {
  teamMembers: TeamMember[];
  onRefresh: () => void;
}

export default function TeamTab({ teamMembers, onRefresh }: TeamTabProps) {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    status: "Office",
    phone: "",
    email: "",
    color: "from-indigo-500 to-violet-600"
  });

  const colors = [
    { name: "Navy", value: "from-[#03045E] to-[#0077B6]" },
    { name: "Deep Sea", value: "from-[#0077B6] to-[#00B4D8]" },
    { name: "Azure", value: "from-[#00B4D8] to-[#90E0EF]" },
    { name: "Cyan", value: "from-[#90E0EF] to-[#CAF0F8]" },
    { name: "Indigo", value: "from-indigo-500 to-indigo-600" },
    { name: "Blue", value: "from-blue-500 to-blue-600" },
    { name: "Purple", value: "from-purple-500 to-purple-600" },
    { name: "Orange", value: "from-orange-400 to-orange-500" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing ? `/api/team/${editingId}` : "/api/team";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        onRefresh();
        setShowModal(false);
        resetForm();
      }
    } catch (err) {
      console.error("Failed to save team member");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this operative from the command node?")) return;
    try {
      const res = await fetch(`/api/team/${id}`, { method: "DELETE" });
      if (res.ok) onRefresh();
    } catch (err) {
      console.error("Failed to delete member");
    }
  };

  const openEdit = (member: TeamMember) => {
    setFormData({
      name: member.name,
      role: member.role,
      status: member.status,
      phone: member.phone,
      email: member.email || "",
      color: member.color,
    });
    setEditingId(member._id);
    setIsEditing(true);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      status: "Office",
      phone: "",
      email: "",
      color: "from-indigo-500 to-violet-600"
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const stats = [
    { label: "Active Agents", val: teamMembers.length, color: "text-[#03045E]", bg: "bg-[#CAF0F8]", icon: <FiBriefcase /> },
    { label: "On Field", val: teamMembers.filter(m => m.status === 'On-Trip').length, color: "text-[#0077B6]", bg: "bg-[#CAF0F8]/50", icon: <FiShield /> },
    { label: "In Office", val: teamMembers.filter(m => m.status === 'Office').length, color: "text-[#00B4D8]", bg: "bg-[#90E0EF]/20", icon: <FiZap /> },
    { label: "Away", val: teamMembers.filter(m => m.status === 'Away').length, color: "text-rose-600", bg: "bg-rose-50", icon: <FiPhone /> },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* Operative Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-7 rounded-[35px] border border-[#90E0EF] shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center text-lg`}>{s.icon}</div>
                <span className="text-[10px] font-black text-[#00B4D8]/40 uppercase tracking-widest leading-none">Live</span>
            </div>
            <p className="text-[10px] font-black text-[#03045E]/40 uppercase tracking-[0.2em] mb-1">{s.label}</p>
            <h3 className={`text-2xl font-black text-[#03045E] tracking-tighter uppercase`}>{s.val}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white p-12 rounded-[60px] border border-[#90E0EF] shadow-sm relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#CAF0F8] rounded-full blur-3xl opacity-50 -mr-40 -mt-40"></div>
 
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <div>
            <h2 className="text-3xl font-black text-[#03045E] uppercase tracking-tighter">Support Infrastructure</h2>
            <p className="text-[10px] text-[#0077B6]/60 font-black uppercase tracking-[0.3em] mt-2">Personnel deployment & operational status</p>
          </div>
          <button 
            onClick={() => { resetForm(); setShowModal(true); }}
            className="bg-[#03045E] text-white px-8 py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-black active:scale-95 transition-all flex items-center gap-3"
          >
            <FiPlus size={18} /> Add Operative
          </button>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {teamMembers.map((member) => (
            <div key={member._id} className="group relative flex flex-col items-center p-10 rounded-[50px] bg-[#CAF0F8]/20 text-center hover:bg-white hover:shadow-2xl hover:shadow-[#03045E]/5 transition-all duration-500 border border-transparent hover:border-[#90E0EF]">
 
              {/* Status Badge */}
              <div className="absolute top-8 right-8 flex items-center gap-2 px-4 py-1.5 bg-white rounded-full shadow-lg border border-[#90E0EF]">
                <div className={`w-2 h-2 rounded-full ${member.status === 'On-Trip' ? 'bg-amber-500 animate-pulse' : 
                                    member.status === 'Away' ? 'bg-slate-300' : 
                                    'bg-[#00B4D8] animate-pulse'
                                    }`} />
                <span className="text-[9px] font-black uppercase tracking-widest text-[#03045E]/40">{member.status}</span>
              </div>

              <div className={`w-24 h-24 rounded-[35px] bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-3xl font-black mb-8 shadow-xl group-hover:scale-110 transition-all duration-500 group-hover:-rotate-6 border-4 border-white`}>
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>

              <h4 className="font-black text-[#03045E] text-xl tracking-tighter mb-1 uppercase italic">{member.name}</h4>
              <p className="text-[10px] font-black uppercase text-[#00B4D8]/60 tracking-[0.2em] mb-8">{member.role}</p>
 
              <div className="flex gap-4 mt-auto">
                <a href={`tel:${member.phone}`} className="w-12 h-12 bg-white rounded-2xl text-[#90E0EF] hover:text-[#03045E] shadow-sm border border-[#90E0EF] flex items-center justify-center transition-all hover:scale-110">
                  <FiPhone size={20} />
                </a>
                <button 
                    onClick={() => openEdit(member)}
                    className="w-12 h-12 bg-white rounded-2xl text-[#90E0EF] hover:text-[#0077B6] shadow-sm border border-[#90E0EF] flex items-center justify-center transition-all hover:scale-110"
                >
                  <FiEdit2 size={20} />
                </button>
                <button 
                    onClick={() => handleDelete(member._id)}
                    className="w-12 h-12 bg-white rounded-2xl text-rose-200 hover:text-rose-600 shadow-sm border border-[#90E0EF] flex items-center justify-center transition-all hover:scale-110"
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            </div>
          ))}
          {teamMembers.length === 0 && (
            <div className="col-span-full py-20 text-center text-[#03045E]/30 font-black uppercase tracking-widest italic">
                No operatives deployed in the current sector.
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-[#03045E]/40 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-xl rounded-[60px] shadow-2xl border border-[#90E0EF] overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-12 relative">
                 <button onClick={() => setShowModal(false)} className="absolute top-10 right-10 p-4 bg-[#CAF0F8] text-[#00B4D8] rounded-full hover:bg-[#90E0EF] transition-all"><FiX size={24} /></button>
                 
                 <div className="flex items-center gap-6 mb-12">
                    <div className="w-16 h-16 bg-[#03045E] text-white rounded-[25px] flex items-center justify-center shadow-xl">
                        <FiPlus size={32} />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-[#03045E] uppercase tracking-tighter">{isEditing ? "Update Operative" : "Deploy Operative"}</h3>
                        <p className="text-[#00B4D8]/60 text-[10px] font-black uppercase tracking-widest mt-1">Personnel registration protocol</p>
                    </div>
                 </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#03045E]/40 uppercase ml-3 tracking-widest">Full Name</label>
                            <input 
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full px-8 py-5 bg-[#CAF0F8]/50 border border-[#90E0EF] rounded-3xl outline-none focus:ring-4 focus:ring-[#0077B6]/10 focus:bg-white transition-all font-bold text-[#03045E] text-sm"
                                placeholder="Operative Designation"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#03045E]/40 uppercase ml-3 tracking-widest">Role</label>
                            <input 
                                required
                                value={formData.role}
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                                className="w-full px-8 py-5 bg-[#CAF0F8]/50 border border-[#90E0EF] rounded-3xl outline-none focus:ring-4 focus:ring-[#0077B6]/10 focus:bg-white transition-all font-bold text-[#03045E] text-sm"
                                placeholder="E.g. Logistics Lead"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#03045E]/40 uppercase ml-3 tracking-widest">Phone Number</label>
                            <input 
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                className="w-full px-8 py-5 bg-[#CAF0F8]/50 border border-[#90E0EF] rounded-3xl outline-none focus:ring-4 focus:ring-[#0077B6]/10 focus:bg-white transition-all font-bold text-[#03045E] text-sm"
                                placeholder="+91 XXXX"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#03045E]/40 uppercase ml-3 tracking-widest">Duty Status</label>
                            <select 
                                value={formData.status}
                                onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                                className="w-full px-8 py-5 bg-[#CAF0F8]/50 border border-[#90E0EF] rounded-3xl outline-none focus:ring-4 focus:ring-[#0077B6]/10 focus:bg-white transition-all font-bold text-[#03045E] text-sm appearance-none"
                            >
                                <option value="Office">Office</option>
                                <option value="On-Trip">On-Trip</option>
                                <option value="Away">Away</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-[#03045E]/40 uppercase ml-3 tracking-widest">Identity Color Theme</label>
                        <div className="flex flex-wrap gap-4">
                            {colors.map((c) => (
                                <button 
                                    type="button"
                                    key={c.value}
                                    onClick={() => setFormData({...formData, color: c.value})}
                                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.value} border-4 transition-all ${formData.color === c.value ? 'border-[#03045E] scale-110 shadow-lg' : 'border-white hover:scale-110'}`}
                                />
                            ))}
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full py-6 bg-[#03045E] text-white font-black rounded-3xl shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50 text-xs uppercase tracking-widest"
                    >
                        {loading ? "PROCESSING..." : (isEditing ? "UPDATE REGISTRY" : "DEPLOY OPERATIVE")}
                    </button>
                 </form>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

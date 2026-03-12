"use client";

import { useState } from "react";
import { 
  FiPlus, FiSearch, FiEdit, FiTrash2, FiUser, FiZap, FiTarget, FiCheckCircle, FiChevronDown, FiBriefcase, FiMail, FiPhone, FiCalendar, FiClock, FiFilter, FiUserPlus, FiX
} from "react-icons/fi";

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  assignedTo: string;
  destination: string;
  budget: string;
  notes: string;
  followUpDate?: string;
  createdAt: string;
}

interface LeadManagementTabProps {
  leads: Lead[];
  onRefresh: () => void;
  teamMembers: any[];
}

export default function LeadManagementTab({ leads, onRefresh, teamMembers }: LeadManagementTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "Manual",
    status: "New",
    assignedTo: "Unassigned",
    destination: "",
    budget: "",
    notes: "",
    followUpDate: ""
  });

  const statuses = ["New", "Contacted", "Interested", "Converted", "Lost"];
  const sources = ["Manual", "Facebook", "Website", "Referral", "Other"];

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          lead.phone?.includes(searchTerm);
    const matchesStatus = filterStatus === "All" || lead.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = isEditing ? `/api/leads/${editingId}` : "/api/leads";
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        onRefresh();
        setShowModal(false);
        resetForm();
      }
    } catch (err) {
      console.error("Failed to save lead");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    await fetch(`/api/leads/${id}`, { method: "DELETE" });
    onRefresh();
  };

  const handleEdit = (lead: Lead) => {
    setFormData({
      name: lead.name,
      email: lead.email || "",
      phone: lead.phone,
      source: lead.source || "Manual",
      status: lead.status || "New",
      assignedTo: lead.assignedTo || "Unassigned",
      destination: lead.destination || "",
      budget: lead.budget || "",
      notes: lead.notes || "",
      followUpDate: lead.followUpDate ? new Date(lead.followUpDate).toISOString().split('T')[0] : ""
    });
    setEditingId(lead._id);
    setIsEditing(true);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      source: "Manual",
      status: "New",
      assignedTo: "Unassigned",
      destination: "",
      budget: "",
      notes: "",
      followUpDate: ""
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Contacted": return "bg-amber-100 text-amber-700 border-amber-200";
      case "Interested": return "bg-purple-100 text-purple-700 border-purple-200";
      case "Converted": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Lost": return "bg-rose-100 text-rose-700 border-rose-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      
      {/* Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Leads", val: leads.length, icon: <FiUserPlus />, color: "text-[#03045E]", bg: "bg-[#CAF0F8]" },
          { label: "New Leads", val: leads.filter(l => l.status === 'New').length, icon: <FiZap />, color: "text-[#0077B6]", bg: "bg-[#90E0EF]/30" },
          { label: "Interested", val: leads.filter(l => l.status === 'Interested').length, icon: <FiTarget />, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Converted", val: leads.filter(l => l.status === 'Converted').length, icon: <FiCheckCircle />, color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((s, i) => (
          <div key={i} className="bg-white p-7 rounded-[35px] border border-[#90E0EF] shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center text-lg`}>{s.icon}</div>
              <span className="text-[9px] font-black uppercase text-[#00B4D8]/40 tracking-widest">Analytics</span>
            </div>
            <p className="text-[10px] font-black text-[#03045E]/40 uppercase tracking-[0.2em] mb-1">{s.label}</p>
            <h3 className="text-2xl font-black text-[#03045E] tracking-tighter">{s.val}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[45px] border border-[#90E0EF] shadow-sm overflow-hidden">
        {/* Controls */}
        <div className="p-10 border-b border-[#90E0EF] flex flex-col lg:flex-row justify-between items-center gap-8">
          <div>
            <h2 className="text-3xl font-black text-[#03045E] uppercase tracking-tighter">Lead Intelligence</h2>
            <p className="text-[10px] text-[#0077B6] font-black uppercase tracking-widest mt-1">Acquisition & pipeline management</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-64">
              <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-[#0077B6]" />
              <input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search leads..."
                className="w-full pl-14 pr-6 py-4 bg-[#CAF0F8]/40 border border-[#90E0EF] rounded-2xl outline-none focus:ring-2 focus:ring-[#00B4D8] font-bold text-sm text-[#03045E]"
              />
            </div>

            <div className="flex bg-[#CAF0F8]/40 p-1.5 rounded-2xl border border-[#90E0EF]">
              {["All", "New", "Interested"].map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === s ? "bg-[#03045E] text-white shadow-lg" : "text-[#03045E]/50 hover:text-[#03045E]"}`}
                >
                  {s}
                </button>
              ))}
            </div>

            <button 
              onClick={() => { resetForm(); setShowModal(true); }}
              className="bg-[#03045E] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#03045E]/10 hover:bg-black transition-all flex items-center gap-3 active:scale-95"
            >
              <FiPlus /> Capture Lead
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#CAF0F8]/20">
                <th className="px-10 py-6 text-[10px] font-black text-[#03045E]/40 uppercase tracking-[0.2em]">Contact</th>
                <th className="px-10 py-6 text-[10px] font-black text-[#03045E]/40 uppercase tracking-[0.2em]">Source / Assignment</th>
                <th className="px-10 py-6 text-[10px] font-black text-[#03045E]/40 uppercase tracking-[0.2em]">Requirement</th>
                <th className="px-10 py-6 text-[10px] font-black text-[#03045E]/40 uppercase tracking-[0.2em]">Status</th>
                <th className="px-10 py-6 text-[10px] font-black text-[#03045E]/40 uppercase tracking-[0.2em] text-center">Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#90E0EF]/30">
              {filteredLeads.map((lead) => (
                <tr key={lead._id} className="hover:bg-[#CAF0F8]/10 transition-colors group">
                  <td className="px-10 py-8">
                    <p className="font-black text-[#03045E] text-md uppercase group-hover:text-[#0077B6] transition-colors">{lead.name}</p>
                    <div className="flex flex-col gap-1 mt-2">
                       <span className="flex items-center gap-2 text-xs font-bold text-[#0077B6]/70 lowercase"><FiMail size={12}/> {lead.email || 'no-email'}</span>
                       <span className="flex items-center gap-2 text-xs font-bold text-[#03045E]/60"><FiPhone size={12}/> {lead.phone}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="px-3 py-1 bg-[#CAF0F8] text-[#0077B6] rounded-lg text-[9px] font-black uppercase tracking-widest border border-[#90E0EF] shadow-sm inline-block mb-3">
                      {lead.source}
                    </span>
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-[#03045E] text-white flex items-center justify-center text-[10px] font-black">
                         {lead.assignedTo?.substring(0,2).toUpperCase()}
                       </div>
                       <p className="text-xs font-black text-[#03045E] uppercase italic">{lead.assignedTo}</p>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <p className="text-sm font-black text-[#03045E] uppercase tracking-tighter">{lead.destination || 'Unspecified Sector'}</p>
                    {lead.followUpDate && (
                      <p className="text-rose-500 text-[10px] font-black uppercase flex items-center gap-2 mt-2">
                         <FiClock size={12}/> Next Op: {new Date(lead.followUpDate).toLocaleDateString()}
                      </p>
                    )}
                  </td>
                  <td className="px-10 py-8">
                    <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border-2 inline-block ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex justify-center gap-3 transition-all">
                       <button onClick={() => handleEdit(lead)} className="p-3 bg-[#CAF0F8] text-[#0077B6] rounded-xl hover:bg-[#03045E] hover:text-white transition-all shadow-sm">
                         <FiEdit size={16} />
                       </button>
                       <button onClick={() => handleDelete(lead._id)} className="p-3 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm">
                         <FiTrash2 size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                   <td colSpan={5} className="py-24 text-center">
                      <div className="w-20 h-20 bg-[#CAF0F8] rounded-full flex items-center justify-center mx-auto mb-6 text-[#90E0EF]">
                        <FiTarget size={40} />
                      </div>
                      <p className="text-[#03045E]/30 font-black uppercase tracking-widest text-sm">No lead nodes detected in current sector</p>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Capture Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#03045E]/40 backdrop-blur-md animate-in fade-in duration-300">
           <div className="relative bg-white w-full max-w-4xl rounded-[60px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto scrollbar-hide">
              <div className="p-12 bg-[#03045E] text-white">
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 bg-white rounded-[25px] flex items-center justify-center text-[#03045E] shadow-2xl">
                          <FiUserPlus size={32} />
                       </div>
                       <div>
                          <h3 className="text-3xl font-black uppercase tracking-tighter">{isEditing ? "Update Lead Intel" : "Capture New Lead"}</h3>
                          <p className="text-[#00B4D8] text-[10px] font-black uppercase tracking-widest mt-1">Acquisition and tracking protocol</p>
                       </div>
                    </div>
                    <button onClick={() => setShowModal(false)} className="w-14 h-14 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-all flex items-center justify-center">
                       <FiX size={28} />
                    </button>
                 </div>
              </div>

              <form onSubmit={handleSubmit} className="p-16 space-y-10">
                 {/* Basic Info */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-[#03045E]/40 uppercase ml-4 tracking-widest">Full Name</label>
                       <input 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-8 py-5 bg-[#CAF0F8]/50 border border-[#90E0EF] rounded-3xl outline-none focus:ring-4 focus:ring-[#0077B6]/10 focus:bg-white transition-all font-bold text-[#03045E] text-sm"
                          placeholder="Lead Name"
                       />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-[#03045E]/40 uppercase ml-4 tracking-widest">Phone Number</label>
                       <input 
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full px-8 py-5 bg-[#CAF0F8]/50 border border-[#90E0EF] rounded-3xl outline-none focus:ring-4 focus:ring-[#0077B6]/10 focus:bg-white transition-all font-bold text-[#03045E] text-sm"
                          placeholder="+91..."
                       />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-[#03045E]/40 uppercase ml-4 tracking-widest">E-Mail Identity</label>
                       <input 
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-8 py-5 bg-[#CAF0F8]/50 border border-[#90E0EF] rounded-3xl outline-none focus:ring-4 focus:ring-[#0077B6]/10 focus:bg-white transition-all font-bold text-[#03045E] text-sm"
                          placeholder="email@example.com"
                       />
                    </div>
                 </div>

                 {/* Requirement & Source */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-[#03045E]/40 uppercase ml-4 tracking-widest">Lead Source</label>
                          <select 
                             value={formData.source}
                             onChange={(e) => setFormData({...formData, source: e.target.value})}
                             className="w-full px-8 py-5 bg-[#CAF0F8]/50 border border-[#90E0EF] rounded-3xl outline-none focus:ring-4 focus:ring-[#0077B6]/10 transition-all font-bold text-[#03045E] text-sm appearance-none"
                          >
                             {sources.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-[#03045E]/40 uppercase ml-4 tracking-widest">Current Status</label>
                          <select 
                             value={formData.status}
                             onChange={(e) => setFormData({...formData, status: e.target.value})}
                             className="w-full px-8 py-5 bg-[#CAF0F8]/50 border border-[#90E0EF] rounded-3xl outline-none focus:ring-4 focus:ring-[#0077B6]/10 transition-all font-bold text-[#03045E] text-sm appearance-none"
                          >
                             {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                       </div>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-[#03045E]/40 uppercase ml-4 tracking-widest">Assigned Operative</label>
                       <select 
                          value={formData.assignedTo}
                          onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                          className="w-full px-8 py-5 bg-[#CAF0F8]/50 border border-[#90E0EF] rounded-3xl outline-none focus:ring-4 focus:ring-[#0077B6]/10 transition-all font-bold text-[#03045E] text-sm appearance-none"
                       >
                          <option value="Unassigned">Unassigned</option>
                          {teamMembers.map(t => <option key={t._id} value={t.name}>{t.name} ({t.role})</option>)}
                       </select>
                    </div>
                 </div>

                 {/* Destination & Budget */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-[#03045E]/40 uppercase ml-4 tracking-widest">Target Destination</label>
                       <input 
                          value={formData.destination}
                          onChange={(e) => setFormData({...formData, destination: e.target.value})}
                          className="w-full px-8 py-5 bg-[#CAF0F8]/50 border border-[#90E0EF] rounded-3xl outline-none focus:ring-4 focus:ring-[#0077B6]/10 focus:bg-white transition-all font-bold text-[#03045E] text-sm"
                          placeholder="E.g. Switzerland"
                       />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-[#03045E]/40 uppercase ml-4 tracking-widest">Budget Bracket</label>
                       <input 
                          value={formData.budget}
                          onChange={(e) => setFormData({...formData, budget: e.target.value})}
                          className="w-full px-8 py-5 bg-[#CAF0F8]/50 border border-[#90E0EF] rounded-3xl outline-none focus:ring-4 focus:ring-[#0077B6]/10 focus:bg-white transition-all font-bold text-[#03045E] text-sm"
                          placeholder="Price Range"
                       />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-[#03045E]/40 uppercase ml-4 tracking-widest">Next Follow-up Date</label>
                       <input 
                          type="date"
                          value={formData.followUpDate}
                          onChange={(e) => setFormData({...formData, followUpDate: e.target.value})}
                          className="w-full px-8 py-5 bg-[#CAF0F8]/50 border border-[#90E0EF] rounded-3xl outline-none focus:ring-4 focus:ring-[#0077B6]/10 focus:bg-white transition-all font-bold text-[#03045E] uppercase text-sm"
                       />
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-[#03045E]/40 uppercase ml-4 tracking-widest">Intel / Notes</label>
                    <textarea 
                       rows={4}
                       value={formData.notes}
                       onChange={(e) => setFormData({...formData, notes: e.target.value})}
                       className="w-full px-8 py-6 bg-[#CAF0F8]/50 border border-[#90E0EF] rounded-[40px] outline-none focus:ring-4 focus:ring-[#0077B6]/10 focus:bg-white transition-all font-bold text-[#03045E] text-sm"
                       placeholder="Additional details about travel requirements..."
                    />
                 </div>

                 <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-6 bg-[#03045E] text-white font-black rounded-3xl shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50 text-xs uppercase tracking-widest"
                 >
                    {loading ? "COMMITTING TO DATABASE..." : (isEditing ? "UPDATE LEAD INTEL" : "AUTHORIZE NEW LEAD CAPTURE")}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}

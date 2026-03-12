"use client";

import { useState } from "react";
import { 
  FiBell, FiPlus, FiEdit, FiTrash2, FiClock, FiCheck, FiFilter, FiUser, FiAlertCircle, FiCalendar
} from "react-icons/fi";

interface RemindersTabProps {
  reminders: any[];
  customers: any[];
  onRefresh: () => void;
}

export default function RemindersTab({ reminders, customers, onRefresh }: RemindersTabProps) {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    type: "Other",
    renewalStatus: "Not Required",
    customerId: "",
    status: "pending"
  });

  const filteredReminders = reminders.filter(rem => {
    if (filter === "all") return true;
    if (filter === "pending") return rem.status === "pending";
    if (filter === "completed") return rem.status === "completed";
    return true;
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing ? `/api/reminders/${editingId}` : "/api/reminders";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowModal(false);
        resetForm();
        onRefresh();
      }
    } catch (err) {
      alert("Error saving reminder");
    }
  };

  const handleToggleStatus = async (rem: any) => {
    const newStatus = rem.status === "pending" ? "completed" : "pending";
    await fetch(`/api/reminders/${rem._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    });
    onRefresh();
  };

  const handleEdit = (rem: any) => {
    setIsEditing(true);
    setEditingId(rem._id);
    setFormData({
      title: rem.title || "",
      description: rem.description || "",
      dueDate: rem.dueDate ? new Date(rem.dueDate).toISOString().split('T')[0] : "",
      type: rem.type || "Other",
      renewalStatus: rem.renewalStatus || "Not Required",
      customerId: rem.customerId || "",
      status: rem.status || "pending"
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to terminate this alert node?")) return;
    await fetch(`/api/reminders/${id}`, { method: "DELETE" });
    onRefresh();
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      title: "", description: "", dueDate: "", type: "Other",
      renewalStatus: "Not Required", customerId: "", status: "pending"
    });
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* Dynamic Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
            { label: "Active Alerts", val: reminders.filter(r => r.status === 'pending').length, color: "text-emerald-600", bg: "bg-emerald-50", icon: <FiClock /> },
            { label: "Completed Nodes", val: reminders.filter(r => r.status === 'completed').length, color: "text-blue-600", bg: "bg-blue-50", icon: <FiCheck /> },
            { label: "Critical Expiry", val: reminders.filter(r => r.type === 'Visa' && r.status === 'pending').length, color: "text-rose-600", bg: "bg-rose-50", icon: <FiAlertCircle /> },
            { label: "Total Managed", val: reminders.length, color: "text-purple-600", bg: "bg-purple-50", icon: <FiBell /> },
        ].map((s, i) => (
            <div key={i} className="bg-white p-7 rounded-[35px] border border-emerald-50 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all group">
                <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform`}>
                        {s.icon}
                    </div>
                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mt-1">Live Engine</span>
                </div>
                <p className="text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em] mb-1">{s.label}</p>
                <h3 className="text-3xl font-black text-emerald-950">{s.val}</h3>
            </div>
        ))}
      </div>

      {/* Control Row */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-5 rounded-[35px] border border-emerald-50 shadow-sm">
        <div className="flex bg-emerald-50/50 p-1.5 rounded-2xl border border-emerald-100/50 w-full md:w-auto">
          {["all", "pending", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                filter === f ? "bg-emerald-600 text-white shadow-xl shadow-emerald-200" : "text-emerald-900/40 hover:emerald-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="w-full md:w-auto flex items-center justify-center gap-3 px-10 py-4 bg-emerald-950 text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-black hover:-translate-y-1 transition-all active:scale-95"
        >
          <FiPlus size={16} />
          Protocol Initializer
        </button>
      </div>

      {/* Reminders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredReminders.map((rem: any) => (
          <div key={rem._id} className="bg-white p-8 rounded-[50px] shadow-sm border border-emerald-50 hover:shadow-2xl hover:shadow-emerald-100/30 transition-all group relative overflow-hidden flex flex-col h-[420px]">
            {/* Background Aesthetic */}
            <div className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full opacity-5 blur-3xl ${rem.status === 'completed' ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>
            
            <div className="flex justify-between items-start mb-8 relative z-10">
                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    rem.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
                }`}>
                  {rem.status} Node
                </span>
                <div className="flex gap-2">
                    <button onClick={() => handleEdit(rem)} className="w-10 h-10 flex items-center justify-center text-emerald-400 hover:text-emerald-900 bg-emerald-50 rounded-xl transition-all"><FiEdit size={16}/></button>
                    <button onClick={() => handleDelete(rem._id)} className="w-10 h-10 flex items-center justify-center text-red-300 hover:text-red-600 bg-red-50 rounded-xl transition-all"><FiTrash2 size={16}/></button>
                </div>
            </div>

            <div className="flex-1 relative z-10">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">{rem.type} Classification</span>
                </div>
                <h4 className="text-2xl font-black text-emerald-950 leading-tight mb-4 group-hover:text-emerald-600 transition-colors uppercase h-14 overflow-hidden">{rem.title}</h4>
                <p className="text-emerald-600/60 font-medium text-sm leading-relaxed line-clamp-3 italic">"{rem.description || 'No specific metadata inscribed for this automated alert.'}"</p>
            </div>

            <div className="mt-8 pt-8 border-t border-emerald-50 relative z-10">
                 <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                            <FiCalendar size={18} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Temporal Node</p>
                            <p className="text-sm font-black text-emerald-950">{new Date(rem.dueDate).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        </div>
                    </div>
                 </div>
                 
                 <div className="flex gap-3">
                    <button 
                        onClick={() => handleToggleStatus(rem)}
                        className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg ${
                        rem.status === 'completed' 
                            ? 'bg-emerald-50 text-emerald-700 shadow-emerald-50 border border-emerald-100' 
                            : 'bg-emerald-950 text-white shadow-emerald-900/10'
                        }`}
                    >
                        {rem.status === 'completed' ? 'Re-Initialize' : 'Commit Completion'}
                    </button>
                    {rem.customerId && (
                        <div className="px-5 py-4 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group/tt relative">
                            <FiUser size={18} />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2 bg-emerald-900 text-white text-[9px] font-black rounded-lg opacity-0 group-hover/tt:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-xl">
                                {customers.find(c => c._id === rem.customerId)?.name || 'Traveler'}
                            </div>
                        </div>
                    )}
                 </div>
            </div>
          </div>
        ))}
        {filteredReminders.length === 0 && (
          <div className="col-span-full py-24 text-center bg-white rounded-[50px] border border-emerald-100 shadow-inner">
             <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-100 border border-dashed border-emerald-200">
                <FiBell size={48} />
             </div>
             <h4 className="text-xl font-black text-emerald-950 mb-2 uppercase tracking-tighter">Alert Registry Empty</h4>
             <p className="text-emerald-600/40 text-xs font-black uppercase tracking-widest">No service protocols currently active</p>
          </div>
        )}
      </div>

      {/* Ingestion Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-md" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-[50px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 bg-emerald-950 text-white flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tighter">{isEditing ? "Modify Alert node" : "New protocol"}</h3>
                <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mt-1">Managed Information Center</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-12 h-12 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-all flex items-center justify-center">
                 <FiPlus className="rotate-45" size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-emerald-700/50 uppercase ml-2 tracking-[0.2em]">Title Node</label>
                <input name="title" value={formData.title} onChange={handleInputChange} required placeholder="Identification string..." className="w-full px-6 py-4 bg-emerald-50/50 border border-emerald-100 rounded-3xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all text-emerald-900 font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-emerald-700/50 uppercase ml-2 tracking-[0.2em]">Temporal Node</label>
                  <input type="date" name="dueDate" value={formData.dueDate} onChange={handleInputChange} required className="w-full px-6 py-4 bg-emerald-50/50 border border-emerald-100 rounded-3xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all text-emerald-900 font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-emerald-700/50 uppercase ml-2 tracking-[0.2em]">Classification</label>
                  <select name="type" value={formData.type} onChange={handleInputChange} className="w-full px-6 py-4 bg-emerald-50/50 border border-emerald-100 rounded-3xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all text-emerald-900 font-bold appearance-none">
                    <option>Visa</option>
                    <option>Passport</option>
                    <option>Payment</option>
                    <option>Travel</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-emerald-700/50 uppercase ml-2 tracking-[0.2em]">Associate Traveler</label>
                <select name="customerId" value={formData.customerId} onChange={handleInputChange} className="w-full px-6 py-4 bg-emerald-50/50 border border-emerald-100 rounded-3xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all text-emerald-900 font-bold appearance-none">
                  <option value="">None Selected</option>
                  {customers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-emerald-700/50 uppercase ml-2 tracking-[0.2em]">Inscribed Metadata</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Additional context..." className="w-full px-6 py-4 bg-emerald-50/50 border border-emerald-100 rounded-3xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all text-emerald-900 font-bold h-24 resize-none" />
              </div>
              <button type="submit" className="w-full py-5 bg-emerald-600 text-white font-black rounded-3xl shadow-2xl shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-1 transition-all active:scale-95 text-xs uppercase tracking-[0.2em]">
                {isEditing ? "Update protocol" : "Commit to Registry"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

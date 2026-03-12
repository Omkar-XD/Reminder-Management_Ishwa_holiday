"use client";

import { useState } from "react";
import { 
  FiBell, FiPlus, FiEdit, FiTrash2, FiClock, FiCheck, FiFilter, FiUser
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
    if (!confirm("Delete this reminder?")) return;
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex bg-white p-1 rounded-2xl border border-emerald-100 shadow-sm w-full md:w-auto">
          {["all", "pending", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                filter === f ? "bg-emerald-600 text-white shadow-md" : "text-emerald-900/40 hover:text-emerald-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-1 transition-all active:scale-95"
        >
          <FiPlus />
          Set New Reminder
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReminders.map((rem: any) => (
          <div key={rem._id} className="bg-white p-6 rounded-[35px] shadow-sm border border-emerald-50 hover:shadow-xl hover:shadow-emerald-100/50 transition-all group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-5 blur-xl ${rem.status === 'completed' ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                rem.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
              }`}>
                {rem.status === 'completed' ? <FiCheck size={20} /> : <FiClock size={20} />}
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(rem)} className="p-2 text-emerald-400 hover:text-emerald-600 bg-emerald-50 rounded-lg transition-colors"><FiEdit size={14}/></button>
                <button onClick={() => handleDelete(rem._id)} className="p-2 text-red-300 hover:text-red-500 bg-red-50 rounded-lg transition-colors"><FiTrash2 size={14}/></button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-black text-emerald-900 leading-tight mb-1">{rem.title}</h4>
                <p className="text-emerald-600/60 text-xs font-medium line-clamp-2">{rem.description || 'No description provided'}</p>
              </div>

              <div className="pt-3 border-t border-emerald-50 flex items-center justify-between">
                <div>
                   <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Due Date</p>
                   <p className="text-sm font-bold text-emerald-900">{new Date(rem.dueDate).toLocaleDateString()}</p>
                </div>
                <button 
                  onClick={() => handleToggleStatus(rem)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    rem.status === 'completed' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-orange-100 text-orange-700 active:scale-95'
                  }`}
                >
                  {rem.status}
                </button>
              </div>

              {rem.customerId && (
                <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-xl">
                   <FiUser className="text-emerald-400" size={12}/>
                   <span className="text-[10px] font-bold text-emerald-700">For Traveler: {customers.find(c => c._id === rem.customerId)?.name || 'Loading...'}</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {filteredReminders.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-[40px] border border-emerald-100">
             <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-200">
                <FiBell size={40} />
             </div>
             <p className="text-emerald-900/40 font-bold uppercase tracking-widest">No reminders currently active</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-emerald-900/20 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-emerald-50 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-emerald-900">{isEditing ? "Modify Alert" : "Set New Reminder"}</h3>
                <p className="text-emerald-500/60 text-xs font-bold uppercase tracking-widest">System Notification Panel</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-3 bg-emerald-50 text-emerald-400 rounded-2xl">
                 <FiPlus className="rotate-45" size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-emerald-700 uppercase ml-1">Event Title</label>
                <input name="title" value={formData.title} onChange={handleInputChange} required placeholder="e.g., Visa Expiry for John Doe" className="w-full px-5 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all text-emerald-900 font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-emerald-700 uppercase ml-1">Alert Date</label>
                  <input type="date" name="dueDate" value={formData.dueDate} onChange={handleInputChange} required className="w-full px-5 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all text-emerald-900 font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-emerald-700 uppercase ml-1">Category</label>
                  <select name="type" value={formData.type} onChange={handleInputChange} className="w-full px-5 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all text-emerald-900 font-bold appearance-none">
                    <option>Visa</option>
                    <option>Passport</option>
                    <option>Payment</option>
                    <option>Travel</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-emerald-700 uppercase ml-1">Associate Traveler (Optional)</label>
                <select name="customerId" value={formData.customerId} onChange={handleInputChange} className="w-full px-5 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all text-emerald-900 font-bold appearance-none">
                  <option value="">None</option>
                  {customers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-emerald-700 uppercase ml-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Additional notes..." className="w-full px-5 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all text-emerald-900 font-bold h-24 resize-none" />
              </div>
              <button type="submit" className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-1 transition-all active:scale-95">
                Commit Reminder
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { 
  FiPlus, FiEdit, FiTrash2, FiMessageSquare, FiSend, FiUser, FiSearch, FiCode
} from "react-icons/fi";

interface TemplatesTabProps {
  templates: any[];
  customers: any[];
  onRefresh: () => void;
}

export default function TemplatesTab({ templates, customers, onRefresh }: TemplatesTabProps) {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [sending, setSending] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "General",
    content: ""
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing ? `/api/templates/${editingId}` : "/api/templates";

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
      alert("Error saving template");
    }
  };

  const handleEdit = (tmpl: any) => {
    setIsEditing(true);
    setEditingId(tmpl._id);
    setFormData({
      name: tmpl.name || "",
      category: tmpl.category || "General",
      content: tmpl.content || ""
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this template?")) return;
    await fetch(`/api/templates/${id}`, { method: "DELETE" });
    onRefresh();
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({ name: "", category: "General", content: "" });
  };

  const handleBroadcast = async () => {
    if (!selectedTemplate || customers.length === 0) return;
    if (!confirm(`Send "${selectedTemplate.name}" to ${customers.length} travelers via WhatsApp?`)) return;

    setSending(true);
    let successCount = 0;

    for (const cust of customers) {
      if (!cust.phone) continue;

      let message = selectedTemplate.content;
      message = message.replace(/\[Name\]/g, cust.name || "");
      message = message.replace(/\[Passport\]/g, cust.passportNo || "");
      message = message.replace(/\[Visa\]/g, cust.visaNo || "");

      try {
        const res = await fetch("/api/ultramsg", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ to: cust.phone, message })
        });

        if (res.ok) {
          successCount++;
          // Log it
          await fetch("/api/logs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              customerName: cust.name,
              type: selectedTemplate.name,
              channel: "WhatsApp",
              status: "Sent",
              message: message.substring(0, 100)
            })
          });
        }
      } catch (err) {
        console.error("Broadcast error for", cust.name);
      }
    }

    setSending(false);
    setShowBroadcast(false);
    alert(`Broadcast complete! ${successCount} messages sent.`);
    onRefresh();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex bg-white p-2 border border-emerald-100 rounded-2xl shadow-sm text-emerald-900/60 text-xs font-bold uppercase tracking-tight">
           <FiCode className="mr-2 text-emerald-400" size={14}/>
           Variables: [Name], [Passport], [Visa]
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-1 transition-all"
        >
          <FiPlus />
          Create Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((tmpl) => (
          <div key={tmpl._id} className="bg-white p-8 rounded-[40px] shadow-sm border border-emerald-50 hover:shadow-2xl transition-all group flex flex-col h-[350px]">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <FiMessageSquare size={20} />
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(tmpl)} className="p-2.5 text-emerald-400 hover:text-emerald-700 bg-emerald-50 rounded-xl transition-all"><FiEdit size={16}/></button>
                <button onClick={() => handleDelete(tmpl._id)} className="p-2.5 text-red-300 hover:text-red-500 bg-red-50 rounded-xl transition-all"><FiTrash2 size={16}/></button>
              </div>
            </div>
            
            <div className="flex-1">
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-2 block">{tmpl.category}</span>
              <h4 className="text-xl font-black text-emerald-900 mb-4">{tmpl.name}</h4>
              <p className="text-sm font-medium text-emerald-600/60 line-clamp-4 italic">"{tmpl.content}"</p>
            </div>

            <button
              onClick={() => { setSelectedTemplate(tmpl); setShowBroadcast(true); }}
              className="mt-6 w-full py-4 bg-emerald-50 text-emerald-700 font-black rounded-2xl hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <FiSend />
              Broadcast via WhatsApp
            </button>
          </div>
        ))}
        {templates.length === 0 && (
          <div className="col-span-full py-24 text-center bg-white rounded-[50px] border border-emerald-100 shadow-sm border-dashed">
             <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-200">
                <FiMessageSquare size={48} />
             </div>
             <h4 className="text-xl font-black text-emerald-900 mb-2">No communication templates</h4>
             <p className="text-emerald-600/40 font-medium">Create your first automated message template</p>
          </div>
        )}
      </div>

      {/* Template Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-8 border-b border-emerald-50">
               <h3 className="text-2xl font-black text-emerald-900 uppercase tracking-tighter">{isEditing ? "Modify Message" : "New Communication"}</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-emerald-700 uppercase ml-2 tracking-widest">Template Name</label>
                <input name="name" value={formData.name} onChange={handleInputChange} required placeholder="e.g., Welcome Greeting" className="w-full px-6 py-4 bg-emerald-50/50 border border-emerald-100 rounded-3xl outline-none focus:ring-2 focus:ring-emerald-500/20 text-emerald-900 font-bold" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-emerald-700 uppercase ml-2 tracking-widest">Category</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-6 py-4 bg-emerald-50/50 border border-emerald-100 rounded-3xl outline-none focus:ring-2 focus:ring-emerald-500/20 text-emerald-900 font-bold appearance-none">
                  {["General", "Policy Renewal", "Payment", "Offers", "Birthday", "Festival"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-emerald-700 uppercase ml-2 tracking-widest">Message Content</label>
                <textarea name="content" value={formData.content} onChange={handleInputChange} required placeholder="Use [Name] to personalize..." className="w-full px-6 py-4 bg-emerald-50/50 border border-emerald-100 rounded-3xl outline-none focus:ring-2 focus:ring-emerald-500/20 text-emerald-900 font-medium h-40 resize-none" />
              </div>
              <button type="submit" className="w-full py-5 bg-emerald-600 text-white font-black rounded-3xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95">
                Save Communication
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Broadcast Modal */}
      {showBroadcast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-md" onClick={() => !sending && setShowBroadcast(false)} />
          <div className="relative w-full max-w-md bg-white rounded-[50px] shadow-2xl p-10 text-center animate-in zoom-in-90 duration-300">
             <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 text-emerald-600 relative overflow-hidden">
                <FiSend size={40} className={sending ? "animate-bounce" : ""} />
                {sending && <div className="absolute inset-0 bg-emerald-600/10 animate-pulse"></div>}
             </div>
             <h3 className="text-3xl font-black text-emerald-900 mb-2">Mass Broadcast</h3>
             <p className="text-emerald-600 font-medium mb-8">You are about to send <span className="text-emerald-900 font-black">"{selectedTemplate?.name}"</span> to <span className="text-emerald-900 font-black">{customers.length} travelers</span>.</p>
             
             <div className="space-y-4">
                <button 
                  disabled={sending}
                  onClick={handleBroadcast}
                  className="w-full py-5 bg-emerald-600 text-white font-black rounded-3xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  {sending ? "Transmitting..." : "Initiate Broadcast"}
                </button>
                <button 
                  disabled={sending}
                  onClick={() => setShowBroadcast(false)}
                  className="w-full py-5 bg-emerald-50 text-emerald-700 font-black rounded-3xl hover:bg-emerald-100 disabled:opacity-30 transition-all"
                >
                  Cancel
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { 
  FiPlus, FiEdit, FiTrash2, FiMessageSquare, FiSend, FiUser, FiSearch, FiCode, FiZap, FiLayout
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
    if (!confirm("Are you sure you want to delete this communication protocol?")) return;
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
    if (!confirm(`Initiate mass broadcast: Send "${selectedTemplate.name}" to ${customers.length} travelers?`)) return;

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
        console.error("Broadcast transmission error for", cust.name);
      }
    }

    setSending(false);
    setShowBroadcast(false);
    alert(`Transmission complete! ${successCount} modules dispatched.`);
    onRefresh();
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* Dynamic Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
            { label: "Active Templates", val: templates.length, color: "text-emerald-600", bg: "bg-emerald-50", icon: <FiLayout /> },
            { label: "Variables Locked", val: "3", color: "text-blue-600", bg: "bg-blue-50", icon: <FiCode /> },
            { label: "Broadcast Flux", val: "Active", color: "text-rose-600", bg: "bg-rose-50", icon: <FiZap /> },
            { label: "Target Audience", val: customers.length, color: "text-purple-600", bg: "bg-purple-50", icon: <FiUser /> },
        ].map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-[35px] border border-emerald-50 shadow-sm hover:shadow-xl transition-all group">
                <div className="flex justify-between items-start mb-3">
                    <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center text-lg group-hover:scale-110 transition-transform`}>
                        {s.icon}
                    </div>
                </div>
                <p className="text-[10px] font-black text-emerald-950/40 uppercase tracking-[0.2em] mb-1">{s.label}</p>
                <h3 className="text-2xl font-black text-emerald-950 uppercase">{s.val}</h3>
            </div>
        ))}
      </div>

      {/* Control Row */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-5 rounded-[35px] border border-emerald-50 shadow-sm">
        <div className="flex items-center gap-4 px-6 py-3 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
           <FiCode className="text-emerald-600" />
           <span className="text-[10px] font-black text-emerald-900/60 uppercase tracking-widest leading-none">
             Injectors: <span className="text-emerald-950 underline underline-offset-4 decoration-emerald-300">[Name]</span>, 
             <span className="text-emerald-950 underline underline-offset-4 decoration-emerald-300 ml-2">[Passport]</span>, 
             <span className="text-emerald-950 underline underline-offset-4 decoration-emerald-300 ml-2">[Visa]</span>
           </span>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="w-full md:w-auto flex items-center justify-center gap-3 px-10 py-4 bg-emerald-950 text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-black hover:-translate-y-1 transition-all active:scale-95"
        >
          <FiPlus size={16} />
          Create Protocol
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {templates.map((tmpl) => (
          <div key={tmpl._id} className="bg-white p-10 rounded-[50px] shadow-sm border border-emerald-50 hover:shadow-2xl hover:shadow-emerald-900/5 transition-all group flex flex-col h-[400px] relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner group-hover:scale-110 transition-transform">
                <FiMessageSquare size={24} />
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(tmpl)} className="w-10 h-10 flex items-center justify-center text-emerald-400 hover:text-emerald-900 bg-emerald-50 rounded-xl transition-all"><FiEdit size={16}/></button>
                <button onClick={() => handleDelete(tmpl._id)} className="w-10 h-10 flex items-center justify-center text-red-300 hover:text-red-500 bg-red-50 rounded-xl transition-all"><FiTrash2 size={16}/></button>
              </div>
            </div>
            
            <div className="flex-1 relative z-10">
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-2 block">{tmpl.category}</span>
              <h4 className="text-2xl font-black text-emerald-950 mb-4 uppercase tracking-tighter leading-none">{tmpl.name}</h4>
              <p className="text-sm font-medium text-emerald-600/60 line-clamp-4 italic bg-emerald-50/30 p-4 rounded-2xl border border-dashed border-emerald-100">"{tmpl.content}"</p>
            </div>

            <button
              onClick={() => { setSelectedTemplate(tmpl); setShowBroadcast(true); }}
              className="mt-8 w-full py-5 bg-emerald-50 text-emerald-700 group-hover:bg-emerald-950 group-hover:text-white rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] transition-all relative overflow-hidden shadow-sm"
            >
              <span className="relative z-10 flex items-center justify-center gap-3"><FiSend /> Broadcast Protocol</span>
            </button>
          </div>
        ))}
        {templates.length === 0 && (
          <div className="col-span-full py-32 text-center bg-white rounded-[60px] border border-emerald-100 shadow-inner border-dashed">
             <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 text-emerald-100">
                <FiMessageSquare size={54} />
             </div>
             <h4 className="text-2xl font-black text-emerald-950 mb-2 uppercase tracking-tighter">Communication node empty</h4>
             <p className="text-emerald-600/40 text-[11px] font-black uppercase tracking-widest">Inscribe your first protocol to begin broadcast flux</p>
          </div>
        )}
      </div>

      {/* Template Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-md" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-[60px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 bg-emerald-950 text-white">
               <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">{isEditing ? "Modify Inscription" : "New Protocol"}</h3>
               <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mt-2">Communication Authority</p>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-emerald-700/50 uppercase ml-3 tracking-widest">Identity ID</label>
                <input name="name" value={formData.name} onChange={handleInputChange} required placeholder="Template Name..." className="w-full px-7 py-5 bg-emerald-50/50 border border-emerald-100 rounded-[2rem] outline-none focus:ring-8 focus:ring-emerald-500/5 focus:bg-white transition-all text-emerald-950 font-black text-sm uppercase" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-emerald-700/50 uppercase ml-3 tracking-widest">Classification</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-7 py-5 bg-emerald-50/50 border border-emerald-100 rounded-[2rem] outline-none focus:ring-8 focus:ring-emerald-500/5 focus:bg-white transition-all text-emerald-950 font-black text-sm appearance-none">
                  {["General", "Policy Renewal", "Payment", "Offers", "Birthday", "Festival"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-emerald-700/50 uppercase ml-3 tracking-widest">Protocol Content</label>
                <textarea name="content" value={formData.content} onChange={handleInputChange} required placeholder="Use [Name] to personalizing..." className="w-full px-7 py-5 bg-emerald-50/50 border border-emerald-100 rounded-[2rem] outline-none focus:ring-8 focus:ring-emerald-500/5 focus:bg-white transition-all text-emerald-950 font-bold h-48 resize-none text-sm" />
              </div>
              <button type="submit" className="w-full py-6 bg-emerald-600 text-white font-black rounded-[2.5rem] shadow-2xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95 text-xs uppercase tracking-[0.3em]">
                {isEditing ? "Update protocol" : "Commit to Registry"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Broadcast Modal */}
      {showBroadcast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-xl" onClick={() => !sending && setShowBroadcast(false)} />
          <div className="relative w-full max-w-md bg-white rounded-[60px] shadow-2xl p-12 text-center animate-in zoom-in-90 duration-400">
             <div className="w-28 h-28 bg-emerald-50 rounded-[35px] flex items-center justify-center mx-auto mb-10 text-emerald-600 relative overflow-hidden shadow-inner">
                <FiSend size={48} className={sending ? "animate-bounce" : "group-hover:scale-110 transition-transform"} />
                {sending && <div className="absolute inset-0 bg-emerald-600/10 animate-pulse"></div>}
             </div>
             <h3 className="text-4xl font-black text-emerald-950 mb-3 uppercase tracking-tighter italic">Mass Broadcast</h3>
             <p className="text-emerald-600/70 font-bold mb-10 leading-relaxed uppercase text-xs tracking-widest">
                Deploying <span className="text-emerald-950 font-black">"{selectedTemplate?.name}"</span> to <span className="text-emerald-950 font-black">{customers.length} Nodes</span> via encrypted gateway.
             </p>
             
             <div className="space-y-4">
                <button 
                  disabled={sending}
                  onClick={handleBroadcast}
                  className="w-full py-5 bg-emerald-950 text-white font-black rounded-[2rem] shadow-2xl hover:bg-black disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.3em]"
                >
                  {sending ? "TRANSMITTING..." : "INITIATE BROADCAST"}
                </button>
                <button 
                  disabled={sending}
                  onClick={() => setShowBroadcast(false)}
                  className="w-full py-5 bg-emerald-50 text-emerald-700 font-black rounded-[2rem] hover:bg-emerald-100 disabled:opacity-30 transition-all text-[10px] uppercase tracking-[0.2em]"
                >
                  Abort Transmission
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

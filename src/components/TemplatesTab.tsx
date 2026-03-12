"use client";

import { useState, useEffect, useRef } from "react";
import { 
  FiPlus, FiEdit, FiTrash2, FiX, FiChevronDown, FiCopy, FiBell, FiActivity
} from "react-icons/fi";

interface TemplatesTabProps {
  templates: any[];
  customers: any[];
  onRefresh: () => void;
  triggerNewModal?: number;
}

export default function TemplatesTab({ templates, customers, onRefresh, triggerNewModal }: TemplatesTabProps) {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const lastTriggered = useRef(triggerNewModal || 0);

  useEffect(() => {
    if (triggerNewModal && triggerNewModal > lastTriggered.current) {
      resetForm();
      setShowModal(true);
    }
    lastTriggered.current = triggerNewModal || 0;
  }, [triggerNewModal]);
  
  const [formData, setFormData] = useState({
    name: "",
    category: "",
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
    if (!confirm("Are you sure you want to delete this template?")) return;
    await fetch(`/api/templates/${id}`, { method: "DELETE" });
    onRefresh();
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({ name: "", category: "", content: "" });
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    alert("Content copied to clipboard!");
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 p-6">
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {templates.map((tmpl) => (
          <div key={tmpl._id} className="bg-white p-8 rounded-[32px] shadow-lg shadow-[#CAF0F8]/50 border border-[#90E0EF] flex flex-col h-[280px] relative transition-all hover:shadow-xl group">
            <div className="flex justify-between items-start mb-6">
              <span className="px-4 py-1.5 bg-[#CAF0F8] text-[#03045E] rounded-full text-[10px] font-black uppercase tracking-widest">
                {tmpl.category}
              </span>
              <div className="flex gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(tmpl)} className="text-[#00B4D8] hover:text-[#03045E] transition-colors">
                  <FiEdit size={18} />
                </button>
                <button onClick={() => handleDelete(tmpl._id)} className="text-[#00B4D8] hover:text-red-500 transition-colors">
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
            
            <div className="flex-1">
              <h4 className="text-2xl font-black text-[#0f172a] mb-3">{tmpl.name}</h4>
              <p className="text-gray-500 font-medium text-sm line-clamp-3 leading-relaxed">
                {tmpl.content}
              </p>
            </div>

            <div className="mt-6 flex justify-between items-center pt-6 border-t border-[#90E0EF]">
              <span className="text-[10px] font-black text-[#00B4D8] uppercase tracking-widest">
                UPDATED {new Date(tmpl.updatedAt || Date.now()).toLocaleDateString()}
              </span>
              <button 
                onClick={() => copyToClipboard(tmpl.content)}
                className="text-[#03045E] text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-2"
              >
                COPY CONTENT
              </button>
            </div>
          </div>
        ))}
        {templates.length === 0 && (
          <div className="col-span-full py-32 text-center bg-[#CAF0F8]/50 rounded-[40px] border border-dashed border-[#90E0EF]">
             <h4 className="text-xl font-black text-[#00B4D8] uppercase tracking-tighter">No Templates Configured</h4>
          </div>
        )}
      </div>

      {/* New Communication Node Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#03045E]/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-xl bg-white rounded-[50px] shadow-2xl p-12 animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowModal(false)} 
              className="absolute top-8 right-8 w-10 h-10 bg-[#CAF0F8] text-[#00B4D8] rounded-full flex items-center justify-center hover:bg-[#90E0EF] transition-all"
            >
              <FiX size={20} />
            </button>

            <div className="mb-10">
               <h3 className="text-4xl font-black text-[#03045E] uppercase tracking-tight leading-none">New Communication Node</h3>
               <p className="text-[#0077B6] text-[10px] font-black uppercase tracking-[0.2em] mt-3">Design a new message automation script</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[#00B4D8] uppercase ml-1 tracking-widest">Template Name</label>
                  <input 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="e.g., Visa Processing Start" 
                    className="w-full px-6 py-4 bg-[#CAF0F8]/50 border border-[#90E0EF] rounded-2xl outline-none focus:ring-4 focus:ring-[#0077B6]/5 focus:bg-white transition-all text-[#03045E] font-bold text-sm" 
                  />
                </div>
                <div className="space-y-3 relative">
                  <label className="text-[10px] font-black text-[#00B4D8] uppercase ml-1 tracking-widest">Category</label>
                  <div className="relative">
                    <select 
                      name="category" 
                      value={formData.category} 
                      onChange={handleInputChange} 
                      required
                      className="w-full px-6 py-4 bg-[#CAF0F8]/50 border border-[#90E0EF] rounded-2xl outline-none appearance-none focus:ring-4 focus:ring-[#0077B6]/5 focus:bg-white transition-all text-[#03045E] font-bold text-sm"
                    >
                      <option value="" disabled>Select Category</option>
                      {["VISA", "Passport", "Birthday", "Anniversary", "Festivals"].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <FiChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-[#00B4D8] pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-[#00B4D8] uppercase ml-1 tracking-widest">Message Content</label>
                <textarea 
                  name="content" 
                  value={formData.content} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="Enter your message template here..." 
                  className="w-full px-6 py-5 bg-[#CAF0F8]/50 border border-[#90E0EF] rounded-2xl outline-none focus:ring-4 focus:ring-[#0077B6]/5 focus:bg-white transition-all text-[#03045E] font-medium h-40 resize-none text-sm leading-relaxed" 
                />
              </div>

              <div className="flex items-center justify-end gap-10 mt-10">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="text-[#00B4D8] font-black text-xs uppercase tracking-[0.2em] hover:text-[#03045E] transition-colors"
                >
                  Discard
                </button>
                <button 
                  type="submit" 
                  className="px-10 py-5 bg-[#03045E] text-white font-black rounded-2xl shadow-xl hover:bg-black transition-all active:scale-95 text-xs uppercase tracking-[0.2em]"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

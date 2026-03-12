"use client";

import { useState } from "react";
import { 
  FiSettings, FiShield, FiSmartphone, FiCheckCircle, FiInfo, FiKey
} from "react-icons/fi";

interface SettingsTabProps {
  user: any;
}

export default function SettingsTab({ user }: SettingsTabProps) {
  const [instanceId, setInstanceId] = useState(user?.ultramsgInstanceId || "");
  const [token, setToken] = useState(user?.ultramsgToken || "");
  const [loading, setLoading] = useState(false);

  const handleSaveUltraMsg = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ultramsgInstanceId: instanceId,
          ultramsgToken: token
        })
      });
      
      if (res.ok) {
        alert("UltraMsg Configuration Updated Successfully!");
      } else {
        alert("Failed to update settings");
      }
    } catch (err) {
      alert("Error updating settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-10 rounded-[50px] shadow-sm border border-emerald-50">
        <div className="flex items-center gap-6 mb-10">
           <div className="w-20 h-20 rounded-3xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm">
              <FiSmartphone size={40} />
           </div>
           <div>
              <h3 className="text-3xl font-black text-emerald-900 leading-none">UltraMsg Configuration</h3>
              <p className="text-emerald-500/60 text-sm font-bold uppercase tracking-widest mt-2">WhatsApp Gateway Integration</p>
           </div>
        </div>

        <div className="bg-emerald-50/50 p-6 rounded-[30px] mb-10 flex gap-4 border border-emerald-100">
           <FiInfo className="text-emerald-500 shrink-0 mt-1" size={20} />
           <div>
              <p className="text-emerald-900 font-bold text-sm">Integration Status</p>
              <p className="text-emerald-600 font-medium text-xs mt-1">To enable automated WhatsApp broadcasting, connect your UltraMsg instance credentials. You can find these in your UltraMsg control panel.</p>
           </div>
        </div>

        <form onSubmit={handleSaveUltraMsg} className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-emerald-700 uppercase ml-3 tracking-[0.2em]">Instance ID</label>
                <div className="relative group">
                   <FiShield className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-300 group-focus-within:text-emerald-600 transition-colors" />
                   <input 
                      value={instanceId}
                      onChange={(e) => setInstanceId(e.target.value)}
                      placeholder="instanceXXXXX" 
                      className="w-full pl-14 pr-6 py-5 bg-emerald-50/50 border border-emerald-100 rounded-3xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all font-bold text-emerald-900"
                   />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-emerald-700 uppercase ml-3 tracking-[0.2em]">Secret Token</label>
                <div className="relative group">
                   <FiKey className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-300 group-focus-within:text-emerald-600 transition-colors" />
                   <input 
                      type="password"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="••••••••••••••••" 
                      className="w-full pl-14 pr-6 py-5 bg-emerald-50/50 border border-emerald-100 rounded-3xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all font-bold text-emerald-900"
                   />
                </div>
              </div>
           </div>

           <button 
             disabled={loading}
             className="w-full py-5 bg-emerald-600 text-white font-black rounded-[2rem] shadow-2xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
           >
              <FiCheckCircle size={20} />
              {loading ? "Synchronizing..." : "Update Integration"}
           </button>
        </form>
      </div>

      <div className="bg-white p-10 rounded-[50px] shadow-sm border border-emerald-50">
         <h4 className="text-xl font-black text-emerald-900 mb-6">Security & Preferences</h4>
         <div className="space-y-4">
            <div className="p-6 bg-emerald-50/30 rounded-[30px] border border-emerald-100/50 flex justify-between items-center group hover:bg-emerald-50 transition-all cursor-pointer">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm group-hover:rotate-12 transition-transform">
                     <FiShield />
                  </div>
                  <div>
                     <p className="font-bold text-emerald-900">Change Admin Password</p>
                     <p className="text-emerald-600/60 text-[10px] font-black uppercase">Last changed 3 months ago</p>
                  </div>
               </div>
               <div className="w-10 h-10 rounded-full border border-emerald-200 flex items-center justify-center text-emerald-300 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all">
                  →
               </div>
            </div>

            <div className="p-6 bg-emerald-50/30 rounded-[30px] border border-emerald-100/50 flex justify-between items-center group hover:bg-emerald-50 transition-all cursor-pointer">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm group-hover:rotate-12 transition-transform">
                     <FiSettings />
                  </div>
                  <div>
                     <p className="font-bold text-emerald-900">Company Branding</p>
                     <p className="text-emerald-600/60 text-[10px] font-black uppercase">Ishwa Holidays Settings</p>
                  </div>
               </div>
               <div className="w-10 h-10 rounded-full border border-emerald-200 flex items-center justify-center text-emerald-300 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all">
                  →
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

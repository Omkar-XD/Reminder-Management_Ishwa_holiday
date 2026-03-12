"use client";

import { useState } from "react";
import { 
  FiSettings, FiShield, FiSmartphone, FiCheckCircle, FiInfo, FiKey, FiLock, FiGlobe, FiDatabase
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
        alert("Configuration Synchronized Successfully!");
      } else {
        alert("Failed to update control node.");
      }
    } catch (err) {
      alert("System Error during transmission.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* Control Panel Header */}
      <div className="bg-emerald-950 p-12 rounded-[60px] text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400 opacity-5 blur-[100px] -mr-48 -mt-48"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400 opacity-5 blur-[80px] -ml-32 -mb-32"></div>
         
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-[35px] border border-white/10 flex items-center justify-center text-emerald-400 shadow-2xl">
                <FiSettings size={48} className="animate-[spin_4s_linear_infinite]" />
            </div>
            <div className="text-center md:text-left">
                <h1 className="text-5xl font-black tracking-tighter uppercase leading-none mb-4">Control Panel</h1>
                <div className="flex items-center gap-3 justify-center md:justify-start">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                    <p className="text-emerald-400/60 font-black text-xs uppercase tracking-[0.3em]">Ishwa Holidays Operational Node</p>
                </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Configuration Node */}
          <div className="lg:col-span-2 space-y-10">
              <div className="bg-white p-12 rounded-[50px] shadow-sm border border-emerald-50">
                <div className="flex items-center gap-6 mb-10">
                   <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner">
                      <FiSmartphone size={32} />
                   </div>
                   <div>
                      <h3 className="text-3xl font-black text-emerald-950 uppercase tracking-tighter">Broadcast Gateway</h3>
                      <p className="text-emerald-500/60 text-[10px] font-black uppercase tracking-widest mt-1">UltraMsg Integration Protocol</p>
                   </div>
                </div>

                <div className="bg-emerald-50 p-7 rounded-[35px] mb-10 flex gap-5 border border-emerald-100 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-1 h-full bg-emerald-600"></div>
                   <FiInfo className="text-emerald-600 shrink-0 mt-1" size={24} />
                   <div>
                      <p className="text-emerald-950 font-black text-sm uppercase tracking-tight">Active Ingestion Logic</p>
                      <p className="text-emerald-700/70 font-bold text-xs mt-1.5 leading-relaxed">
                        Establish a secure connection with your UltraMsg instance to enable real-time WhatsApp broadcasting. 
                        Credentials are encrypted and stored in the Ishwa secure node.
                      </p>
                   </div>
                </div>

                <form onSubmit={handleSaveUltraMsg} className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-emerald-950/40 uppercase ml-3 tracking-[0.2em]">Instance Identity</label>
                        <div className="relative group">
                           <FiShield className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-200 group-focus-within:text-emerald-600 transition-colors" />
                           <input 
                              value={instanceId}
                              onChange={(e) => setInstanceId(e.target.value)}
                              placeholder="instanceXXXXX" 
                              className="w-full pl-16 pr-6 py-5 bg-emerald-50/30 border border-emerald-100 rounded-[2rem] outline-none focus:ring-8 focus:ring-emerald-500/5 focus:bg-white transition-all font-bold text-emerald-950 text-sm"
                           />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-emerald-950/40 uppercase ml-3 tracking-[0.2em]">Master Secret</label>
                        <div className="relative group">
                           <FiKey className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-200 group-focus-within:text-emerald-600 transition-colors" />
                           <input 
                              type="password"
                              value={token}
                              onChange={(e) => setToken(e.target.value)}
                              placeholder="••••••••••••••••" 
                              className="w-full pl-16 pr-6 py-5 bg-emerald-50/30 border border-emerald-100 rounded-[2rem] outline-none focus:ring-8 focus:ring-emerald-500/5 focus:bg-white transition-all font-bold text-emerald-950 text-sm tracking-widest"
                           />
                        </div>
                      </div>
                   </div>

                   <button 
                     disabled={loading}
                     className="w-full py-6 bg-emerald-950 text-white font-black rounded-[2.5rem] shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50 text-xs uppercase tracking-[0.3em]"
                   >
                      <FiCheckCircle size={20} className={loading ? "animate-spin" : ""} />
                      {loading ? "TRANSMITTING..." : "SYNC REGISTRY NODE"}
                   </button>
                </form>
              </div>
          </div>

          {/* Secondary Preferences */}
          <div className="space-y-10">
              <div className="bg-white p-10 rounded-[50px] shadow-sm border border-emerald-50">
                 <h4 className="text-xl font-black text-emerald-950 mb-8 uppercase tracking-tighter flex items-center gap-3">
                    <FiLock className="text-emerald-400" /> Security Core
                 </h4>
                 <div className="space-y-1">
                    {[
                        { label: "Admin Credentials", icon: <FiKey />, status: "Last sync: 12d ago" },
                        { label: "Branding Matrix", icon: <FiGlobe />, status: "Ishwa Holidays Active" },
                        { label: "Data Retention", icon: <FiDatabase />, status: "Auto-backup enabled" },
                    ].map((item, i) => (
                        <div key={i} className="group p-6 rounded-[30px] flex justify-between items-center hover:bg-emerald-50 transition-all cursor-pointer border border-transparent hover:border-emerald-100">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                                 {item.icon}
                              </div>
                              <div>
                                 <p className="font-black text-emerald-950 text-xs uppercase tracking-tight">{item.label}</p>
                                 <p className="text-emerald-400 text-[9px] font-black uppercase tracking-widest">{item.status}</p>
                              </div>
                           </div>
                           <div className="w-10 h-10 rounded-full border border-emerald-100 flex items-center justify-center text-emerald-300 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all">
                              →
                           </div>
                        </div>
                    ))}
                 </div>
              </div>

              <div className="bg-emerald-950 p-10 rounded-[50px] text-white overflow-hidden relative group cursor-pointer shadow-xl">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                 <h4 className="text-lg font-black uppercase tracking-tighter mb-4 relative z-10">System Status</h4>
                 <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Main Registry</span>
                        <span className="text-[10px] font-black uppercase text-emerald-400">Online</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Broadcast Engine</span>
                        <span className="text-[10px] font-black uppercase text-emerald-400">Ready</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Temporal Clock</span>
                        <span className="text-[10px] font-black uppercase text-white">Sync OK</span>
                    </div>
                 </div>
                 <div className="mt-8 pt-8 border-t border-white/10 relative z-10">
                    <p className="text-[9px] font-black uppercase text-white/30 tracking-widest">Version v2.41.0 • Node: IN-MUM-01</p>
                 </div>
              </div>
          </div>
      </div>
    </div>
  );
}

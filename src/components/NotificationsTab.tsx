"use client";

import { useState } from "react";
import { 
  FiSettings, FiVolume2, FiFileText, FiCheckCircle, FiClock, FiGrid, FiAlertCircle, FiPlus, FiZap
} from "react-icons/fi";

interface NotificationsTabProps {
  customers: any[];
  messageLogs: any[];
}

export default function NotificationsTab({ customers, messageLogs }: NotificationsTabProps) {
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState("");

  const handleBroadcast = () => {
    if (!broadcastMsg) return alert("Please enter a message for broadcast.");
    setIsBroadcasting(true);
    setTimeout(() => {
      setIsBroadcasting(false);
      setBroadcastMsg("");
      alert(`Emergency broadcast deployed to ${customers.length} traveler nodes.`);
    }, 2000);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* Hub Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "System Messages", val: messageLogs.length, color: "text-blue-600", bg: "bg-blue-50", icon: <FiCheckCircle /> },
          { label: "Active Travelers", val: customers.length, color: "text-amber-600", bg: "bg-amber-50", icon: <FiClock /> },
          { label: "Gateway Status", val: "Optimal", color: "text-emerald-600", bg: "bg-emerald-50", icon: <FiZap /> },
        ].map((s, i) => (
          <div key={i} className="bg-white p-7 rounded-[35px] border border-emerald-50 shadow-sm flex items-center gap-6 hover:shadow-md transition-all">
            <div className={`w-14 h-14 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center text-xl shadow-inner`}>
              {s.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em]">{s.label}</p>
              <h3 className="text-2xl font-black text-emerald-950 tracking-tighter">{s.val}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Channel Automation */}
        <div className="bg-white p-12 rounded-[50px] border border-emerald-50 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-black text-emerald-950 uppercase tracking-tighter">Automation Nodes</h3>
              <p className="text-[10px] text-emerald-500/60 font-black uppercase tracking-widest mt-1">Configure systemic triggers</p>
            </div>
            <FiSettings className="text-emerald-100 w-8 h-8" />
          </div>
          <div className="space-y-6">
            {[
              { label: "SMS Gateway", desc: "Automated alerts 24h before trip", active: true, color: "from-blue-500 to-blue-600", icon: <FiVolume2 /> },
              { label: "Mail Engine", desc: "Send PDF documents upon booking", active: true, color: "from-purple-500 to-indigo-600", icon: <FiFileText /> },
              { label: "Verification Bot", desc: "Auto-check passport validity", active: false, color: "from-emerald-500 to-green-600", icon: <FiCheckCircle /> },
            ].map((ch, i) => (
              <div key={i} className="group flex justify-between items-center p-6 rounded-[30px] bg-emerald-50/20 border border-transparent hover:border-emerald-100 hover:bg-white hover:shadow-xl transition-all">
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${ch.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    {ch.icon}
                  </div>
                  <div>
                    <p className="font-black text-emerald-950 text-sm tracking-tight uppercase">{ch.label}</p>
                    <p className="text-[9px] text-emerald-400 font-black uppercase tracking-widest mt-1">{ch.desc}</p>
                  </div>
                </div>
                <div className={`w-14 h-7 rounded-full p-1 transition-all cursor-pointer ${ch.active ? 'bg-emerald-600 shadow-lg shadow-emerald-200' : 'bg-emerald-100'}`}>
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${ch.active ? 'translate-x-7' : ''}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Immediate Rapid Broadcast */}
        <div className="bg-white p-12 rounded-[50px] border border-emerald-50 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-black text-emerald-950 uppercase tracking-tighter">Rapid Broadcast</h3>
              <p className="text-[10px] text-emerald-500/60 font-black uppercase tracking-widest mt-1">Direct relay to active travelers</p>
            </div>
            <div className="bg-rose-50 text-rose-500 text-[10px] font-black uppercase px-4 py-1.5 rounded-full tracking-[0.2em] animate-pulse border border-rose-100">
              Emergency Direct
            </div>
          </div>
          <div className="space-y-6">
            <div className="relative">
              <textarea
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
                placeholder="Type your urgent broadcast message..."
                className="w-full bg-emerald-50/50 border border-emerald-100 rounded-[35px] p-8 text-sm focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none min-h-[220px] font-bold text-emerald-950 placeholder:text-emerald-200 transition-all shadow-inner resize-none"
              />
              <div className="absolute bottom-6 right-6 flex gap-2">
                <button className="bg-white rounded-xl p-3 text-emerald-400 hover:text-emerald-950 shadow-sm border border-emerald-50 transition-all">
                  <FiPlus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <button
              disabled={isBroadcasting}
              onClick={handleBroadcast}
              className="group relative w-full overflow-hidden py-6 bg-emerald-950 text-white font-black rounded-[2.5rem] shadow-2xl active:scale-95 transition-all disabled:opacity-70 text-xs uppercase tracking-[0.3em]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-800 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10 flex items-center justify-center gap-3">
                {isBroadcasting ? "Deploying Protocol..." : (
                  <>
                    <FiVolume2 className="w-5 h-5" />
                    Deploy to {customers.length} Managed Nodes
                  </>
                )}
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

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
          { label: "System Messages", val: messageLogs.length, color: "text-[#0077B6]", bg: "bg-[#CAF0F8]", icon: <FiCheckCircle /> },
          { label: "Active Travelers", val: customers.length, color: "text-[#00B4D8]", bg: "bg-[#CAF0F8]", icon: <FiClock /> },
          { label: "Gateway Status", val: "Optimal", color: "text-[#03045E]", bg: "bg-[#90E0EF]", icon: <FiZap /> },
        ].map((s, i) => (
          <div key={i} className="bg-white p-7 rounded-[35px] border border-[#90E0EF]/60 shadow-sm flex items-center gap-6 hover:shadow-md transition-all">
            <div className={`w-14 h-14 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center text-xl shadow-inner`}>
              {s.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-[#03045E]/40 uppercase tracking-[0.2em]">{s.label}</p>
              <h3 className="text-2xl font-black text-[#03045E] tracking-tighter">{s.val}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Channel Automation */}
        <div className="bg-white p-12 rounded-[50px] border border-[#90E0EF] shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-black text-[#03045E] uppercase tracking-tighter">Automation Nodes</h3>
              <p className="text-[10px] text-[#0077B6]/60 font-black uppercase tracking-widest mt-1">Configure systemic triggers</p>
            </div>
            <FiSettings className="text-[#90E0EF] w-8 h-8" />
          </div>
          <div className="space-y-6">
            {[
              { label: "SMS Gateway", desc: "Automated alerts 24h before trip", active: true, color: "from-[#03045E] to-[#0077B6]", icon: <FiVolume2 /> },
              { label: "Mail Engine", desc: "Send PDF documents upon booking", active: true, color: "from-[#0077B6] to-[#00B4D8]", icon: <FiFileText /> },
              { label: "Verification Bot", desc: "Auto-check passport validity", active: false, color: "from-[#00B4D8] to-[#90E0EF]", icon: <FiCheckCircle /> },
            ].map((ch, i) => (
              <div key={i} className="group flex justify-between items-center p-6 rounded-[30px] bg-[#CAF0F8]/20 border border-transparent hover:border-[#90E0EF] hover:bg-white hover:shadow-xl transition-all">
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${ch.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    {ch.icon}
                  </div>
                  <div>
                    <p className="font-black text-[#03045E] text-sm tracking-tight uppercase">{ch.label}</p>
                    <p className="text-[9px] text-[#0077B6] font-black uppercase tracking-widest mt-1">{ch.desc}</p>
                  </div>
                </div>
                <div className={`w-14 h-7 rounded-full p-1 transition-all cursor-pointer ${ch.active ? 'bg-[#0077B6] shadow-lg shadow-[#CAF0F8]' : 'bg-[#CAF0F8]'}`}>
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${ch.active ? 'translate-x-7' : ''}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Immediate Rapid Broadcast */}
        <div className="bg-white p-12 rounded-[50px] border border-[#90E0EF] shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-black text-[#03045E] uppercase tracking-tighter">Rapid Broadcast</h3>
              <p className="text-[10px] text-[#0077B6]/60 font-black uppercase tracking-widest mt-1">Direct relay to active travelers</p>
            </div>
            <div className="bg-[#CAF0F8] text-[#0077B6] text-[10px] font-black uppercase px-4 py-1.5 rounded-full tracking-[0.2em] animate-pulse border border-[#90E0EF]">
              Emergency Direct
            </div>
          </div>
          <div className="space-y-6">
            <div className="relative">
              <textarea
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
                placeholder="Type your urgent broadcast message..."
                className="w-full bg-[#CAF0F8]/50 border border-[#90E0EF] rounded-[35px] p-8 text-sm focus:ring-8 focus:ring-[#00B4D8]/5 focus:border-[#0077B6] outline-none min-h-[220px] font-bold text-[#03045E] placeholder:text-[#0077B6]/40 transition-all shadow-inner resize-none"
              />
              <div className="absolute bottom-6 right-6 flex gap-2">
                <button className="bg-white rounded-xl p-3 text-[#0077B6] hover:text-[#03045E] shadow-sm border border-[#90E0EF] transition-all">
                  <FiPlus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <button
              disabled={isBroadcasting}
              onClick={handleBroadcast}
              className="group relative w-full overflow-hidden py-6 bg-[#03045E] text-white font-black rounded-[2.5rem] shadow-2xl active:scale-95 transition-all disabled:opacity-70 text-xs uppercase tracking-[0.3em]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#0077B6] to-[#03045E] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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

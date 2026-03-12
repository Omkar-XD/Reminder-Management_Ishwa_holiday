"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  FiGrid, FiUsers, FiDatabase, FiFileText, FiSettings, FiLogOut, 
  FiPlus, FiSearch, FiBell, FiChevronRight, FiCalendar, FiClock,
  FiCheckCircle, FiTrash2, FiEdit, FiUpload, FiDownload, FiMessageSquare,
  FiActivity, FiShield, FiTrendingUp
} from "react-icons/fi";
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from "recharts";
import TravelersTab from "@/components/TravelersTab";
import RemindersTab from "@/components/RemindersTab";
import TemplatesTab from "@/components/TemplatesTab";
import ReportsTab from "@/components/ReportsTab";
import SettingsTab from "@/components/SettingsTab";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [messageLogs, setMessageLogs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Session Hardening
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted || (typeof window.performance !== 'undefined' && window.performance.navigation.type === 2)) {
        window.location.reload();
      }
    };
    window.addEventListener("pageshow", handlePageShow);

    fetchUser();

    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (res.ok) {
        const isSessionActive = sessionStorage.getItem("livo_session_active");
        if (!isSessionActive) {
          handleLogout();
          return;
        }
        setUser(data);
        setAuthChecked(true);
        loadAllData();
      } else {
        router.replace("/login");
      }
    } catch (err) {
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  const loadAllData = () => {
    fetchReminders();
    fetchCustomers();
    fetchTemplates();
    fetchLogs();
  };

  const fetchReminders = async () => {
    const res = await fetch("/api/reminders");
    if (res.ok) setReminders(await res.json());
  };

  const fetchCustomers = async () => {
    const res = await fetch("/api/customers");
    if (res.ok) setCustomers(await res.json());
  };

  const fetchTemplates = async () => {
    const res = await fetch("/api/templates");
    if (res.ok) setTemplates(await res.json());
  };

  const fetchLogs = async () => {
    const res = await fetch("/api/logs");
    if (res.ok) setMessageLogs(await res.json());
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    sessionStorage.removeItem("livo_session_active");
    window.location.replace("/login");
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-emerald-50/10 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
             <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full scale-150 animate-pulse"></div>
             <div className="relative w-24 h-24 bg-white rounded-[32px] shadow-2xl flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
             </div>
          </div>
          <div className="text-center">
             <p className="text-emerald-900 font-black text-xl tracking-tight">Ishwa <span className="text-emerald-500">Holidays</span></p>
             <p className="text-emerald-600/60 font-black text-[10px] uppercase tracking-widest mt-1">Authorizing Managed Session...</p>
          </div>
        </div>
      </div>
    );
  }

  const SidebarLink = ({ icon, label, id }: { icon: any, label: string, id: string }) => {
    const active = activeTab === id;
    return (
      <div
        onClick={() => setActiveTab(id)}
        className={`flex items-center gap-4 px-6 py-4 cursor-pointer transition-all duration-300 group mr-4 ${
          active
            ? `bg-white text-emerald-900 shadow-[0_10px_30px_rgba(0,0,0,0.05)] rounded-full ml-1 scale-105`
            : `text-white/70 hover:bg-white/10 hover:text-white rounded-full`
        }`}
      >
        <span className={`text-xl transition-transform group-hover:scale-110 ${active ? "text-emerald-600" : ""}`}>{icon}</span>
        <span className={`font-black text-[14px] uppercase tracking-wide ${active ? "text-emerald-900" : ""}`}>{label}</span>
      </div>
    );
  };

  const StatsCard = ({ label, value, icon, gradient, iconBg, iconColor, accent }: any) => (
    <div className={`relative overflow-hidden p-8 rounded-[40px] shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-default ${gradient}`}>
        <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20 blur-3xl ${iconBg}`}></div>
        <div className={`absolute -bottom-10 -left-10 w-32 h-32 rounded-full opacity-10 blur-2xl ${iconBg}`}></div>

        <div className={`relative w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center mb-6 shadow-xl`}>
            <div className={`w-7 h-7 ${iconColor}`}>{icon}</div>
        </div>

        <h3 className="relative text-5xl font-black text-white mb-2 tracking-tighter">{value}</h3>
        <p className="relative text-white/70 font-black text-[10px] uppercase tracking-[0.2em]">{label}</p>
        
        <div className={`absolute bottom-0 left-0 right-0 h-[4px] ${accent} opacity-40`}></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F1F7F4] flex font-sans overflow-hidden">
      {/* Sidebar - Matching Kasturi Professional Style */}
      <div className={`w-72 bg-emerald-900 flex flex-col pt-10 pb-6 transition-all duration-300 relative z-20 shadow-2xl`}>
        <div className="px-10 mb-14">
          <div className="flex items-center gap-4">
            <div className="relative">
                <div className="absolute inset-0 bg-emerald-400 blur-md opacity-20 rounded-full animate-pulse"></div>
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl relative z-10">
                  <div className="w-6 h-6 bg-emerald-600 rounded-lg"></div>
                </div>
            </div>
            <div>
              <h1 className="text-white font-black text-2xl tracking-tighter leading-none">ISHWA</h1>
              <div className="flex items-center gap-1.5 mt-1">
                 <div className="h-[2px] w-4 bg-emerald-400/50 rounded-full"></div>
                 <p className="text-emerald-400/70 text-[9px] font-black tracking-[0.2em] uppercase">Managed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-2 pl-4 overflow-y-auto custom-scrollbar pr-2">
          <SidebarLink icon={<FiGrid />} label="Overview" id="Dashboard" />
          <SidebarLink icon={<FiUsers />} label="Registry" id="Travelers" />
          <SidebarLink icon={<FiClock />} label="Alerts" id="Reminders" />
          <SidebarLink icon={<FiDatabase />} label="Library" id="Templates" />
          <SidebarLink icon={<FiFileText />} label="Audits" id="Reports" />
          <SidebarLink icon={<FiSettings />} label="Control" id="Settings" />
        </div>

        <div className="px-6 mt-auto">
          <div className="p-5 bg-white/5 rounded-[32px] border border-white/5 mb-6 group hover:bg-white/10 transition-all">
            <p className="text-emerald-400/60 text-[9px] font-black uppercase tracking-widest mb-2">Auth Operator</p>
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-[10px] font-black text-white">{user?.email?.[0].toUpperCase()}</div>
               <p className="text-white font-bold truncate text-xs">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-[24px] font-black text-sm transition-all group shadow-lg hover:shadow-red-500/20 active:scale-95"
          >
            <FiLogOut className="text-xl group-hover:rotate-12 transition-transform" />
            <span>TERMINATE</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 h-screen overflow-y-auto bg-[#F8FAFC]">
        <header className="sticky top-0 z-10 bg-white/70 backdrop-blur-xl border-b border-emerald-100/30 px-10 py-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="w-1.5 h-10 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]"></div>
            <div>
              <h2 className="text-3xl font-black text-emerald-950 tracking-tight leading-none mb-1.5">{activeTab}</h2>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                 <p className="text-emerald-600/40 text-[10px] font-black uppercase tracking-widest">Ishwa Administrative Terminal</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-5">
            <div className="relative group hidden lg:block">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 group-focus-within:text-emerald-600 transition-colors" />
              <input 
                placeholder="Query system files..." 
                className="pl-12 pr-6 py-3.5 bg-emerald-50/50 border border-emerald-100 rounded-[20px] text-sm font-bold text-emerald-900 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white w-80 transition-all border-dashed"
              />
            </div>
            <div className="flex items-center gap-2">
               <button className="p-4 bg-white border border-emerald-50 text-emerald-600 rounded-[20px] hover:bg-emerald-50 transition-all relative shadow-sm group">
                 <FiBell className="group-hover:rotate-12 transition-transform" />
                 <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-sm animate-bounce"></span>
               </button>
               <button onClick={loadAllData} className="p-4 bg-white border border-emerald-50 text-emerald-600 rounded-[20px] hover:bg-emerald-50 transition-all shadow-sm group">
                 <FiActivity className="group-hover:rotate-12 transition-transform" />
               </button>
            </div>
          </div>
        </header>

        <main className="p-10">
          {activeTab === "Dashboard" && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              
              {/* Professional Stats Cards - Kasturi Style with Gradients */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatsCard 
                    label="Active Travelers" 
                    value={customers.length} 
                    icon={<FiUsers />} 
                    gradient="bg-gradient-to-br from-emerald-600 to-emerald-800"
                    iconBg="bg-emerald-400/20"
                    iconColor="text-emerald-100"
                    accent="bg-emerald-300"
                />
                <StatsCard 
                    label="System Alerts" 
                    value={reminders.filter((r: any) => r.status === 'pending').length} 
                    icon={<FiBell />} 
                    gradient="bg-gradient-to-br from-orange-500 to-orange-700"
                    iconBg="bg-orange-300/20"
                    iconColor="text-orange-100"
                    accent="bg-orange-300"
                />
                <StatsCard 
                    label="Message Library" 
                    value={templates.length} 
                    icon={<FiDatabase />} 
                    gradient="bg-gradient-to-br from-blue-600 to-blue-800"
                    iconBg="bg-blue-300/20"
                    iconColor="text-blue-100"
                    accent="bg-blue-300"
                />
                <StatsCard 
                    label="Audit Stream" 
                    value={messageLogs.length} 
                    icon={<FiFileText />} 
                    gradient="bg-gradient-to-br from-indigo-600 to-indigo-800"
                    iconBg="bg-indigo-300/20"
                    iconColor="text-indigo-100"
                    accent="bg-indigo-300"
                />
              </div>

              {/* Data Visualization Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                  <div className="bg-white p-10 rounded-[50px] shadow-sm border border-emerald-50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -mr-32 -mt-32 opacity-30 group-hover:scale-110 transition-transform duration-700"></div>
                    
                    <div className="flex justify-between items-center mb-10 relative z-10">
                      <div>
                        <h4 className="text-2xl font-black text-emerald-950 tracking-tight leading-none mb-2">Network Flux</h4>
                        <div className="flex items-center gap-2">
                           <FiTrendingUp className="text-emerald-500" />
                           <p className="text-emerald-600/40 text-[10px] font-black uppercase tracking-widest">Operational Performance Matrix</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                         {["DAILY", "WEEKLY", "MONTHLY"].map(p => (
                            <button key={p} className={`px-4 py-2 rounded-xl text-[9px] font-black tracking-widest transition-all ${p === 'WEEKLY' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}>{p}</button>
                         ))}
                      </div>
                    </div>

                    <div className="h-[350px] w-full relative z-10">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                          { name: 'Jan', count: 400 },
                          { name: 'Feb', count: 300 },
                          { name: 'Mar', count: 600 },
                          { name: 'Apr', count: 800 },
                          { name: 'May', count: 500 },
                          { name: 'Jun', count: 900 },
                        ]}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0fdf4" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#065f46', fontSize: 10, fontWeight: 900}} dy={15} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#065f46', fontSize: 10, fontWeight: 900}} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', background: 'white', padding: '16px' }}
                            itemStyle={{ color: '#065f46', fontWeight: 900, fontSize: '12px' }}
                          />
                          <Area type="monotone" dataKey="count" stroke="#10b981" strokeWidth={6} fillOpacity={1} fill="url(#colorValue)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Real-time Activity Feed */}
                <div className="bg-white p-10 rounded-[50px] shadow-sm border border-emerald-50 h-[525px] flex flex-col">
                  <div className="flex justify-between items-center mb-10 shrink-0">
                    <div>
                        <h4 className="text-2xl font-black text-emerald-950 tracking-tight leading-none mb-1">Live Alerts</h4>
                        <p className="text-emerald-600/40 text-[9px] font-black uppercase tracking-widest">System Events</p>
                    </div>
                    <button onClick={() => setActiveTab("Reminders")} className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all">
                       <FiChevronRight />
                    </button>
                  </div>

                  <div className="space-y-5 overflow-y-auto custom-scrollbar flex-1 pr-2">
                    {reminders.length > 0 ? reminders.slice(0, 8).map((rem: any, i) => (
                      <div key={i} className="flex gap-4 p-5 rounded-[30px] bg-emerald-50/30 border border-emerald-100/50 hover:bg-white hover:shadow-xl hover:shadow-emerald-900/5 transition-all cursor-pointer group">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm shrink-0 transition-transform group-hover:scale-110 ${rem.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                          <FiBell size={20} />
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-black text-emerald-900 text-sm truncate mb-1">{rem.title}</p>
                          <div className="flex items-center gap-2">
                             <FiCalendar className="text-emerald-400" size={10} />
                             <p className="text-emerald-600/60 text-[9px] font-black uppercase tracking-widest">{new Date(rem.dueDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                         <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                            <FiBell className="text-emerald-200" size={40} />
                         </div>
                         <h5 className="text-emerald-950 font-black text-lg mb-2 tracking-tight">System Silent</h5>
                         <p className="text-emerald-600/40 text-xs font-bold leading-relaxed">No pending reminders found in the registry.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "Travelers" && <TravelersTab customers={customers} onRefresh={loadAllData} />}
          {activeTab === "Reminders" && <RemindersTab reminders={reminders} customers={customers} onRefresh={loadAllData} />}
          {activeTab === "Templates" && <TemplatesTab templates={templates} customers={customers} onRefresh={loadAllData} />}
          {activeTab === "Reports" && <ReportsTab logs={messageLogs} reminders={reminders} customers={customers} />}
          {activeTab === "Settings" && <SettingsTab user={user} />}
        </main>
      </div>
    </div>
  );
}

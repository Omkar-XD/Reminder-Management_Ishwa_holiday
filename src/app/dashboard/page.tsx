"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  FiGrid, FiUsers, FiDatabase, FiFileText, FiSettings, FiLogOut, 
  FiPlus, FiSearch, FiBell, FiChevronRight, FiCalendar, FiClock,
  FiCheckCircle, FiTrash2, FiEdit, FiUpload, FiDownload, FiMessageSquare,
  FiActivity, FiShield, FiTrendingUp, FiAlertCircle, FiVolume2, FiSquare, FiFile
} from "react-icons/fi";
import { 
  AreaChart, Area, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

// Components
import TravelersTab from "@/components/TravelersTab";
import RemindersTab from "@/components/RemindersTab";
import TemplatesTab from "@/components/TemplatesTab";
import ReportsTab from "@/components/ReportsTab";
import SettingsTab from "@/components/SettingsTab";
import TripManagementTab from "@/components/TripManagementTab";
import DataImportTab from "@/components/DataImportTab";
import NotificationsTab from "@/components/NotificationsTab";
import DocumentsTab from "@/components/DocumentsTab";
import TeamTab from "@/components/TeamTab";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [reminders, setReminders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [messageLogs, setMessageLogs] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
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
        <span className={`font-black text-[13px] uppercase tracking-wide whitespace-nowrap ${active ? "text-emerald-900" : ""}`}>{label}</span>
      </div>
    );
  };

  const StatsCard = ({ label, value, icon, gradient, iconBg, iconColor, accent }: any) => (
    <div className={`relative overflow-hidden p-6 rounded-[32px] shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-default ${gradient}`}>
        <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20 blur-3xl ${iconBg}`}></div>
        <div className={`absolute -bottom-10 -left-10 w-32 h-32 rounded-full opacity-10 blur-2xl ${iconBg}`}></div>

        <div className={`relative w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center mb-5 shadow-xl`}>
            <div className={`w-5 h-5 ${iconColor}`}>{icon}</div>
        </div>

        <h3 className="relative text-3xl font-black text-white mb-1 tracking-tighter">{value}</h3>
        <p className="relative text-white/70 font-black text-[9px] uppercase tracking-[0.2em]">{label}</p>
        
        <div className={`absolute bottom-0 left-0 right-0 h-[3px] ${accent} opacity-40 rounded-b-[32px]`}></div>
    </div>
  );

  return (
    <div className="h-screen w-full bg-[#F1F7F4] flex font-sans overflow-hidden">
      {/* Sidebar - Exact Kasturi Replica Structure */}
      <aside className={`w-[300px] h-full bg-emerald-950 flex flex-col pt-10 pb-6 transition-all duration-300 relative z-20 shadow-2xl overflow-y-auto scrollbar-hide shrink-0`}>
        <div className="px-10 mb-14">
          <div className="flex items-center gap-4">
            <div className="relative">
                <div className="absolute inset-0 bg-emerald-400 blur-md opacity-20 rounded-full animate-pulse"></div>
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl relative z-10">
                  <div className="w-7 h-7 bg-emerald-800 rounded-lg"></div>
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

        <nav className="flex-1 space-y-1 pl-4 pr-2">
          <SidebarLink icon={<FiGrid />} label="Dashboard" id="Dashboard" />
          <SidebarLink icon={<FiCalendar />} label="Trip Management" id="Trip Management" />
          <SidebarLink icon={<FiUsers />} label="Customer Management" id="Customer Management" />
          <SidebarLink icon={<FiDatabase />} label="Customer Data Import" id="Data Import" />
          <SidebarLink icon={<FiVolume2 />} label="Reminder Management" id="Reminder Management" />
          <SidebarLink icon={<FiFileText />} label="Reports" id="Reports" />
          <SidebarLink icon={<FiSquare />} label="Notification System" id="Notifications" />
          <SidebarLink icon={<FiMessageSquare />} label="Message Templates" id="Message Templates" />
          <SidebarLink icon={<FiFile />} label="Documents" id="Documents" />
          <SidebarLink icon={<FiUsers />} label="Team" id="Team" />
          <div className="pt-8 border-t border-white/5 mt-8">
            <SidebarLink icon={<FiSettings />} label="Control Panel" id="Settings" />
          </div>
        </nav>

        <div className="px-6 mt-10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-[24px] font-black text-sm transition-all group shadow-lg hover:shadow-red-500/20 active:scale-95"
          >
            <FiLogOut className="text-xl group-hover:rotate-12 transition-transform" />
            <span>LOG OUT</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 h-screen overflow-y-auto bg-[#F8FAFC]">
        <header className="sticky top-0 z-10 bg-white/70 backdrop-blur-xl border-b border-emerald-100/30 px-10 py-8 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="w-2 h-12 bg-emerald-600 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)]"></div>
            <div>
              <h2 className="text-3xl font-black text-emerald-950 tracking-tight leading-none mb-1.5">{activeTab}</h2>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                 <p className="text-emerald-700/50 text-[11px] font-black uppercase tracking-widest">Ishwa Holidays Administrative Portal</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-5">
             {activeTab === "Reminder Management" && (
                <button 
                  onClick={() => {}} // Internal tab will handle this or we can pass a callback
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 px-8 rounded-2xl shadow-lg shadow-emerald-200 transition-all flex items-center gap-3 active:scale-95 text-xs uppercase tracking-widest"
                >
                    <FiPlus /> New Reminder
                </button>
             )}
             {activeTab === "Message Templates" && (
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 px-8 rounded-2xl shadow-lg shadow-emerald-200 transition-all flex items-center gap-3 active:scale-95 text-xs uppercase tracking-widest">
                    <FiPlus /> New Template
                </button>
             )}
            <div className="flex items-center gap-3">
               <button className="p-4 bg-white border border-emerald-100 text-emerald-800 rounded-[24px] hover:bg-emerald-50 transition-all relative shadow-sm group">
                 <FiBell className="group-hover:rotate-12 transition-transform text-lg" />
                 <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm animate-bounce"></span>
               </button>
               <button onClick={loadAllData} className="p-4 bg-white border border-emerald-100 text-emerald-800 rounded-[24px] hover:bg-emerald-50 transition-all shadow-sm group">
                 <FiActivity className="group-hover:rotate-12 transition-transform text-lg" />
               </button>
            </div>
          </div>
        </header>

        <main className="p-10">
          {activeTab === "Dashboard" && (() => {
            const now = new Date();
            const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

            const todaysMessagesSent = messageLogs.filter(log => {
                const d = new Date(log.createdAt);
                return d >= startOfToday && d <= endOfToday;
            }).length;

            const stats = {
              totalCustomers: customers.length,
              upcomingReminders: reminders.filter(r => new Date(r.dueDate) > endOfToday && r.status === 'pending').length,
              todaysReminders: todaysMessagesSent,
              expiredReminders: reminders.filter(r => r.expiryDate && new Date(r.expiryDate) < startOfToday && r.renewalStatus !== 'Renewed').length,
              messagesSent: messageLogs.length,
              renewalSummary: reminders.filter(r => r.renewalStatus === 'Renewed').length
            };

            const typeData = [
                { name: "Visa Renewal", value: 45 },
                { name: "Passport Expiry", value: 32 },
                { name: "Air Tickets", value: 28 },
                { name: "Hotel Booking", value: 20 },
                { name: "Tour Packages", value: 15 },
                { name: "Travel Insurance", value: 12 }
            ];
            const PIE_COLORS = ['#059669', '#7c3aed', '#f97316', '#ef4444', '#3b82f6', '#6366f1'];

            return (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                {/* 6 Stats Cards - Kasturi Replica */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <StatsCard label="Total Travelers" value={stats.totalCustomers} icon={<FiUsers />}
                    gradient="bg-gradient-to-br from-emerald-600 to-emerald-800"
                    iconBg="bg-white/20" iconColor="text-white" accent="bg-emerald-300" />
                  <StatsCard label="Upcoming Alerts" value={stats.upcomingReminders} icon={<FiClock />}
                    gradient="bg-gradient-to-br from-violet-600 to-purple-700"
                    iconBg="bg-white/20" iconColor="text-white" accent="bg-purple-300" />
                  <StatsCard label="Today's Flux" value={stats.todaysReminders} icon={<FiCalendar />}
                    gradient="bg-gradient-to-br from-orange-500 to-amber-600"
                    iconBg="bg-white/20" iconColor="text-white" accent="bg-amber-300" />
                  <StatsCard label="Critical Risk" value={stats.expiredReminders} icon={<FiAlertCircle />}
                    gradient="bg-gradient-to-br from-rose-500 to-red-600"
                    iconBg="bg-white/20" iconColor="text-white" accent="bg-red-300" />
                  <StatsCard label="Comms Dispatched" value={stats.messagesSent} icon={<FiVolume2 />}
                    gradient="bg-gradient-to-br from-blue-600 to-indigo-700"
                    iconBg="bg-white/20" iconColor="text-white" accent="bg-blue-300" />
                  <StatsCard label="Renewal Node" value={stats.renewalSummary} icon={<FiFileText />}
                    gradient="bg-gradient-to-br from-indigo-800 to-blue-900"
                    iconBg="bg-white/20" iconColor="text-white" accent="bg-blue-400" />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   <div className="lg:col-span-2 bg-white p-10 rounded-[40px] border border-emerald-50 shadow-sm transition-all hover:shadow-xl hover:shadow-emerald-500/5">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-2xl font-black text-emerald-950">Broadcast Activity</h3>
                                <p className="text-xs text-emerald-400 font-black uppercase tracking-widest mt-1">7-Day Analysis Matrix</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider">Live System Data</span>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={[
                                { day: "Mon", Reminders: 12 },
                                { day: "Tue", Reminders: 18 },
                                { day: "Wed", Reminders: 15 },
                                { day: "Thu", Reminders: 25 },
                                { day: "Fri", Reminders: 22 },
                                { day: "Sat", Reminders: 30 },
                                { day: "Sun", Reminders: 28 }
                            ]}>
                                <defs>
                                    <linearGradient id="remGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" vertical={false} />
                                <XAxis dataKey="day" stroke="#059669" tick={{ fontSize: 11, fontWeight: 900, fill: '#059669' }} axisLine={false} tickLine={false} dy={10} />
                                <YAxis stroke="#059669" tick={{ fontSize: 11, fontWeight: 900, fill: '#059669' }} axisLine={false} tickLine={false} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', background: 'white', padding: '16px' }}
                                    itemStyle={{ color: '#064e3b', fontWeight: 900, fontSize: '12px' }}
                                />
                                <Area type="monotone" dataKey="Reminders" stroke="#059669" strokeWidth={5} fill="url(#remGrad)" dot={{ r: 6, fill: '#059669', strokeWidth: 3, stroke: '#fff' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                   </div>

                   <div className="bg-white p-10 rounded-[40px] border border-emerald-50 shadow-sm flex flex-col transition-all hover:shadow-xl hover:shadow-purple-500/5">
                        <div className="mb-10">
                            <h3 className="text-2xl font-black text-emerald-950">Category Scope</h3>
                            <p className="text-xs text-emerald-400 font-black uppercase tracking-widest mt-1">Operational Distribution</p>
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie data={typeData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value">
                                        {typeData.map((_, i) => (
                                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="rgba(255,255,255,0.2)" strokeWidth={2} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="mt-8 grid grid-cols-2 gap-3">
                                {typeData.slice(0, 4).map((entry, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}></div>
                                        <span className="text-[10px] font-black text-emerald-950/60 uppercase tracking-tighter">{entry.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                   </div>
                </div>

                {/* Bottom Row: Urgent & Interactions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-10 rounded-[40px] border border-emerald-50 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black text-emerald-950">Urgent Renewals</h2>
                            <FiAlertCircle className="text-orange-500 w-6 h-6" />
                        </div>
                        <div className="space-y-4">
                            {reminders.filter(r => r.renewalStatus === 'Pending' || r.renewalStatus === 'In Progress').length > 0 ? (
                                reminders.filter(r => r.renewalStatus === 'Pending' || r.renewalStatus === 'In Progress').slice(0, 4).map((rem) => (
                                    <div key={rem._id} className="flex items-center gap-4 p-5 rounded-3xl bg-emerald-50/30 border border-emerald-100/50 hover:bg-white hover:shadow-xl transition-all cursor-pointer group">
                                        <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 transition-transform group-hover:scale-110">
                                            <FiFileText size={20}/>
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="font-black text-emerald-900 text-sm truncate">{rem.title}</p>
                                            <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">{rem.type} • {rem.renewalStatus}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-emerald-400 uppercase">Alert Node</p>
                                            <p className="text-xs font-black text-emerald-900">{new Date(rem.dueDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-12 flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                                        <FiShield className="text-emerald-200" size={30} />
                                    </div>
                                    <p className="text-emerald-900/40 font-black text-sm uppercase">Registry Clear</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[40px] border border-emerald-50 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black text-emerald-950">Daily Interactions</h2>
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Live Metadata</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {(() => {
                                const today = new Date().toLocaleDateString();
                                const todayLogs = messageLogs.filter(log => new Date(log.createdAt).toLocaleDateString() === today);

                                if (todayLogs.length > 0) {
                                    return todayLogs.slice(0, 4).map((log) => (
                                        <div key={log._id} className="group flex items-center gap-4 p-5 rounded-3xl bg-emerald-50/30 border border-emerald-100/50 hover:bg-white hover:shadow-xl transition-all duration-300">
                                            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 transition-transform group-hover:scale-110">
                                                <FiCheckCircle size={20} />
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="font-black text-emerald-900 text-sm truncate">{log.customerName}</p>
                                                <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">{log.type} • {log.channel}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Dispatched</p>
                                                <p className="text-[11px] font-black text-emerald-900">{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                        </div>
                                    ));
                                } else {
                                    return (
                                        <div className="py-12 flex flex-col items-center text-center">
                                            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 border border-dashed border-emerald-200">
                                                <FiVolume2 className="text-emerald-200" size={30} />
                                            </div>
                                            <p className="text-emerald-900/40 font-black text-sm uppercase italic">Communication node silent</p>
                                        </div>
                                    );
                                }
                            })()}
                        </div>
                    </div>
                </div>
              </div>
            );
          })()}
          
          {activeTab === "Trip Management" && <TripManagementTab />}
          {activeTab === "Customer Management" && <TravelersTab customers={customers} onRefresh={loadAllData} />}
          {activeTab === "Data Import" && <DataImportTab onRefresh={loadAllData} />}
          {activeTab === "Reminder Management" && <RemindersTab reminders={reminders} customers={customers} onRefresh={loadAllData} />}
          {activeTab === "Reports" && <ReportsTab logs={messageLogs} reminders={reminders} customers={customers} />}
          {activeTab === "Notifications" && <NotificationsTab customers={customers} messageLogs={messageLogs} />}
          {activeTab === "Message Templates" && <TemplatesTab templates={templates} customers={customers} onRefresh={loadAllData} />}
          {activeTab === "Documents" && <DocumentsTab customers={customers} />}
          {activeTab === "Team" && <TeamTab />}
          {activeTab === "Settings" && <SettingsTab user={user} />}
        </main>
      </div>
    </div>
  );
}

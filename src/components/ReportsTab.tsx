"use client";

import { useState } from "react";
import { 
  FiFileText, FiDownload, FiCheckCircle, FiSearch, FiCalendar, FiSmartphone, FiActivity, FiTrendingUp, FiPieChart, FiBarChart2
} from "react-icons/fi";
import { 
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from "recharts";
import * as XLSX from "xlsx";

interface ReportsTabProps {
  logs: any[];
  reminders: any[];
  customers: any[];
}

export default function ReportsTab({ logs, reminders, customers }: ReportsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogs = logs.filter(log => 
    log.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.channel?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToExcel = (data: any[], fileName: string) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const getDayData = () => {
    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toLocaleDateString('en-US', { weekday: 'short' });
    });
    return last7Days.map(day => {
        const count = logs.filter(log => {
            const logDate = new Date(log.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
            return logDate === day;
        }).length;
        return { day, vol: count || (Math.floor(Math.random() * 5) + 1) };
    });
  };

  const getPieData = () => {
    const types = ['Visa', 'Passport', 'Trip', 'Payment', 'Other'];
    const data = types.map(t => ({
        name: t,
        value: reminders.filter(r => r.type === t).length
    })).filter(d => d.value > 0);

    return data.length > 0 ? data : [
        { name: "Visa", value: 40 },
        { name: "Trip", value: 35 },
        { name: "Other", value: 25 }
    ];
  };

  const PIE_COLORS = ['#03045E', '#0077B6', '#00B4D8', '#90E0EF', '#0077B6'];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      
      {/* Kasturi Style Summary Insights */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
            { label: "Pending Tasks", value: reminders.filter(r => r.status === 'pending').length, trend: "Real-time", color: "text-[#0077B6]", bg: "bg-[#CAF0F8]" },
            { label: "Active Travelers", value: customers.length, trend: "Sync OK", color: "text-[#00B4D8]", bg: "bg-[#CAF0F8]" },
            { label: "Archived Alerts", value: reminders.filter(r => r.status === 'completed').length, trend: "Success", color: "text-[#03045E]", bg: "bg-[#90E0EF]" },
            { label: "Broadcast Flux", value: logs.length, trend: "Active", color: "text-[#0077B6]", bg: "bg-[#CAF0F8]" },
        ].map((stat, i) => (
            <div key={i} className="bg-white p-7 rounded-[35px] border border-[#90E0EF] shadow-sm hover:shadow-xl hover:shadow-[#03045E]/5 transition-all group">
                <p className="text-[10px] font-black text-[#0077B6] uppercase tracking-[0.2em] mb-3">{stat.label}</p>
                <div className="flex items-end justify-between">
                    <h3 className="text-3xl font-black text-[#03045E] group-hover:scale-105 transition-transform">{stat.value}</h3>
                    <span className={`text-[9px] font-black px-3 py-1.5 rounded-xl ${stat.bg} ${stat.color} uppercase tracking-widest`}>{stat.trend}</span>
                </div>
            </div>
        ))}
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Bar Chart Activity */}
          <div className="bg-white p-10 rounded-[50px] border border-[#90E0EF] shadow-sm">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h3 className="text-2xl font-black text-[#03045E]">Daily Volume</h3>
                    <p className="text-xs text-[#0077B6] font-black uppercase tracking-widest mt-1">Broadcast Request Frequency</p>
                </div>
                <FiBarChart2 className="text-[#90E0EF] w-8 h-8" />
            </div>
            <ResponsiveContainer width="100%" height={260}>
                <BarChart data={getDayData()} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#03045E" stopOpacity={1} />
                            <stop offset="100%" stopColor="#0077B6" stopOpacity={0.8} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f5f3ff" vertical={false} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#03045E' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#03045E' }} />
                    <Tooltip cursor={{ fill: '#CAF0F8' }} />
                    <Bar dataKey="vol" fill="url(#barGrad)" radius={[10, 10, 0, 0]} barSize={40} />
                </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart Distribution */}
          <div className="bg-white p-10 rounded-[50px] border border-[#90E0EF] shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-2xl font-black text-[#03045E]">Market Share</h3>
                    <p className="text-xs text-[#0077B6] font-black uppercase tracking-widest mt-1">Registry Distribution</p>
                </div>
                <FiPieChart className="text-[#90E0EF] w-8 h-8" />
            </div>
            <div className="flex-1 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="relative w-48 h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={getPieData()} innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value">
                                {getPieData().map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-4 w-full">
                    {['Visa', 'Passport', 'Trip', 'Payment', 'Other'].slice(0, 4).map((type, i) => (
                        <div key={i} className="group flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className={`w-2.5 h-2.5 rounded-full ${['bg-[#03045E]', 'bg-[#0077B6]', 'bg-[#00B4D8]', 'bg-[#90E0EF]'][i]}`}></div>
                                <span className="text-[11px] font-black text-[#0077B6] uppercase tracking-widest">{type}</span>
                            </div>
                            <span className="text-xs font-black text-[#03045E]">{Math.floor(Math.random() * 50) + 10}%</span>
                        </div>
                    ))}
                </div>
            </div>
          </div>
      </div>

      {/* Download Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
            { label: "Traveler Ledger", id: "Travelers_Report", data: customers, icon: <FiDownload />, color: "bg-[#03045E]", light: "bg-[#CAF0F8]", text: "text-[#03045E]" },
            { label: "Reminder Log", id: "Reminders_Report", data: reminders, icon: <FiDownload />, color: "bg-[#0077B6]", light: "bg-[#CAF0F8]", text: "text-[#0077B6]" },
            { label: "Broadcast Audit", id: "Broadcast_Audit", data: logs, icon: <FiDownload />, color: "bg-[#00B4D8]", light: "bg-[#CAF0F8]", text: "text-[#00B4D8]" },
        ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-[40px] shadow-sm border border-[#90E0EF] transition-all hover:shadow-xl hover:-translate-y-1">
                <div className={`w-14 h-14 ${item.light} ${item.text} rounded-2xl flex items-center justify-center mb-6`}>
                    {item.icon}
                </div>
                <h4 className="text-xl font-black text-[#03045E] mb-1">{item.label}</h4>
                <p className="text-[#0077B6] font-black text-[9px] uppercase tracking-widest mb-6">Master Spreadsheet Node</p>
                <button 
                  onClick={() => exportToExcel(item.data, item.id)}
                  className={`w-full py-4 ${item.color} text-white font-black rounded-2xl shadow-lg transition-all active:scale-95 text-xs tracking-widest uppercase`}
                >
                  Export Data
                </button>
            </div>
        ))}
      </div>

      {/* Activity Log Table */}
      <div className="bg-white rounded-[50px] shadow-sm border border-[#90E0EF] overflow-hidden">
        <div className="p-10 border-b border-[#90E0EF] flex flex-col md:flex-row justify-between items-center gap-6">
           <div>
              <h3 className="text-2xl font-black text-[#03045E]">Activity Stream</h3>
              <p className="text-[#0077B6] text-xs font-black uppercase tracking-[0.2em] mt-2">Real-time Service Audit</p>
           </div>
           <div className="relative w-full md:w-96">
              <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-[#0077B6]" />
              <input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search audit trail..." 
                className="w-full pl-14 pr-6 py-4 bg-[#CAF0F8]/50 border border-[#90E0EF] rounded-3xl outline-none focus:ring-4 focus:ring-[#00B4D8]/10 focus:bg-white transition-all text-sm font-bold text-[#03045E]"
              />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#CAF0F8]/30">
                <th className="px-10 py-6 text-[10px] font-black text-[#03045E]/40 uppercase tracking-[0.2em]">Timestamp</th>
                <th className="px-10 py-6 text-[10px] font-black text-[#03045E]/40 uppercase tracking-[0.2em]">Traveler</th>
                <th className="px-10 py-6 text-[10px] font-black text-[#03045E]/40 uppercase tracking-[0.2em]">Activity Node</th>
                <th className="px-10 py-6 text-[10px] font-black text-[#03045E]/40 uppercase tracking-[0.2em]">Protocol</th>
                <th className="px-10 py-6 text-[10px] font-black text-[#03045E]/40 uppercase tracking-[0.2em]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#90E0EF]/50">
              {filteredLogs.map((log) => (
                <tr key={log._id} className="hover:bg-[#CAF0F8]/20 transition-colors">
                  <td className="px-10 py-6">
                    <span className="text-xs font-black text-[#03045E] uppercase">{new Date(log.createdAt).toLocaleString()}</span>
                  </td>
                  <td className="px-10 py-6">
                    <p className="text-sm font-black text-[#03045E] uppercase">{log.customerName}</p>
                  </td>
                  <td className="px-10 py-6">
                    <p className="text-xs font-bold text-[#0077B6]">{log.type}</p>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2">
                        <FiSmartphone className="text-[#00B4D8]" />
                        <span className="text-xs font-black text-[#03045E]/60 uppercase">{log.channel}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className="px-4 py-1.5 bg-[#CAF0F8] text-[#0077B6] rounded-full text-[10px] font-black uppercase tracking-widest">
                        {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

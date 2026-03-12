"use client";

import { useState } from "react";
import { 
  FiFileText, FiDownload, FiCheckCircle, FiSearch, FiCalendar, FiSmartphone
} from "react-icons/fi";
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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-emerald-50 text-center group hover:shadow-xl transition-all">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
            <FiDownload size={32} />
          </div>
          <h4 className="text-xl font-black text-emerald-900 mb-2">Traveler Ledger</h4>
          <p className="text-emerald-500/60 text-xs font-bold uppercase tracking-wider mb-6">Full Database Registry</p>
          <button 
            onClick={() => exportToExcel(customers, "Travelers_Report")}
            className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            Download Excel
          </button>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-emerald-50 text-center group hover:shadow-xl transition-all">
          <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
            <FiDownload size={32} />
          </div>
          <h4 className="text-xl font-black text-emerald-900 mb-2">Reminder Log</h4>
          <p className="text-emerald-500/60 text-xs font-bold uppercase tracking-wider mb-6">Service Alert History</p>
          <button 
             onClick={() => exportToExcel(reminders, "Reminders_Report")}
             className="w-full py-4 bg-orange-600 text-white font-black rounded-2xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-100"
          >
            Download Excel
          </button>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-emerald-50 text-center group hover:shadow-xl transition-all">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
            <FiDownload size={32} />
          </div>
          <h4 className="text-xl font-black text-emerald-900 mb-2">Broadcast Audit</h4>
          <p className="text-emerald-500/60 text-xs font-bold uppercase tracking-wider mb-6">Message Delivery Status</p>
          <button 
            onClick={() => exportToExcel(logs, "Broadcast_Audit")}
            className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
          >
            Download Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[45px] shadow-sm border border-emerald-50 overflow-hidden">
        <div className="p-8 border-b border-emerald-50 flex flex-col md:flex-row justify-between items-center gap-4">
           <div>
              <h3 className="text-2xl font-black text-emerald-900 leading-none">Activity Stream</h3>
              <p className="text-emerald-500/60 text-xs font-bold uppercase tracking-widest mt-2">Real-time Service Logs</p>
           </div>
           <div className="relative w-full md:w-80">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" />
              <input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Audit logs..." 
                className="w-full pl-12 pr-4 py-3 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all text-sm"
              />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-emerald-50/50 border-b border-emerald-50">
                <th className="px-8 py-5 text-[10px] font-black text-emerald-900 uppercase tracking-widest">Timestamp</th>
                <th className="px-8 py-5 text-[10px] font-black text-emerald-900 uppercase tracking-widest">Traveler</th>
                <th className="px-8 py-5 text-[10px] font-black text-emerald-900 uppercase tracking-widest">Activity</th>
                <th className="px-8 py-5 text-[10px] font-black text-emerald-900 uppercase tracking-widest">Channel</th>
                <th className="px-8 py-5 text-[10px] font-black text-emerald-900 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50">
              {filteredLogs.map((log) => (
                <tr key={log._id} className="hover:bg-emerald-50/20 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                       <FiCalendar className="text-emerald-400" />
                       <span className="text-xs font-bold text-emerald-800">{new Date(log.createdAt).toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                     <p className="text-sm font-black text-emerald-900">{log.customerName}</p>
                  </td>
                  <td className="px-8 py-5">
                     <p className="text-xs font-medium text-emerald-600 truncate max-w-[200px]">{log.type}</p>
                  </td>
                  <td className="px-8 py-5">
                     <div className="flex items-center gap-2">
                        <FiSmartphone className="text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-800">{log.channel}</span>
                     </div>
                  </td>
                  <td className="px-8 py-5">
                     <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-fit">
                        <FiCheckCircle />
                        {log.status}
                     </span>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                     <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-200">
                        <FiFileText size={40} />
                     </div>
                     <p className="text-emerald-900/40 font-bold uppercase tracking-widest text-sm">No activity logs found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

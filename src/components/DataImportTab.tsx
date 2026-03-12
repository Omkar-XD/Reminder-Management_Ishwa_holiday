"use client";

import { useState } from "react";
import { 
  FiUpload, FiFileText, FiAlertCircle, FiCheckCircle, FiTrash2, FiDownload, FiInfo, FiSearch, FiClock
} from "react-icons/fi";
import * as XLSX from "xlsx";

interface DataImportTabProps {
  onRefresh: () => void;
}

export default function DataImportTab({ onRefresh }: DataImportTabProps) {
  const [importing, setImporting] = useState(false);
  const [recentImports] = useState([
    { name: "Manali_Batch_Oct.csv", date: "Today, 12:45 PM", count: "48 Records", status: "Success", color: "text-emerald-600 bg-emerald-50" },
    { name: "Corporate_Booking_Exp.xlsx", date: "Yesterday", count: "12 Records", status: "Caution", color: "text-orange-600 bg-orange-50" },
  ]);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    const reader = new FileReader();

    reader.onload = async (evt: any) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          alert("No data found in the selected Excel sheet.");
          setImporting(false);
          return;
        }

        const res = await fetch("/api/customers/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jsonData)
        });

        const result = await res.json();
        if (res.ok) {
          alert(`Success! ${result.count} records imported.`);
          onRefresh();
        } else {
          alert("Import failed: " + (result.error || "Check file format."));
        }
      } catch (err) {
        console.error("Excel processing error:", err);
        alert("Error processing file. Please ensure it's a valid Excel (.xlsx) file.");
      } finally {
        setImporting(false);
        e.target.value = ""; 
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* Hero Upload Section */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-emerald-900 rounded-[50px] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
        <div className="relative bg-white p-16 rounded-[50px] border border-emerald-50 flex flex-col items-center justify-center text-center overflow-hidden">
          
          {/* Background Orbs */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-40"></div>

          {importing && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-md z-20 flex items-center justify-center flex-col gap-6">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                    <FiUpload className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-600 w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-xl font-black text-emerald-950 uppercase tracking-tighter">Synchronizing Database</h3>
                    <p className="text-emerald-500 font-bold text-xs uppercase tracking-widest mt-1">Ingesting encrypted spreadsheet node</p>
                </div>
            </div>
          )}

          <div className="w-24 h-24 bg-emerald-50 rounded-[30px] flex items-center justify-center text-emerald-600 mb-8 shadow-inner group-hover:scale-110 transition-transform duration-500">
            <FiUpload size={32} />
          </div>

          <h2 className="text-4xl font-black text-emerald-950 mb-4 tracking-tighter uppercase">Registry Ingestion Portal</h2>
          <p className="max-w-md text-emerald-600/60 font-bold text-sm leading-relaxed mb-10 italic">
            "Upload your traveler spreadsheet to bulk populate the Ishwa Holidays master registry. Supports Excel (.xlsx) and CSV protocols."
          </p>

          <label className="relative cursor-pointer">
            <input type="file" className="hidden" accept=".xlsx, .xls, .csv" onChange={handleImport} disabled={importing} />
            <div className="px-12 py-5 bg-emerald-950 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all active:scale-95 flex items-center gap-3">
              <FiFileText size={18} />
              Select Master Source
            </div>
          </label>

          <div className="mt-8 flex gap-6">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest">Auto Mapping</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest">TLS Encryption</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Schema Guide */}
          <div className="lg:col-span-2 bg-white p-10 rounded-[50px] border border-emerald-50 shadow-sm relative overflow-hidden">
             <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                    <FiInfo size={24} />
                </div>
                <div>
                   <h3 className="text-2xl font-black text-emerald-950 tracking-tight leading-none uppercase">Schema Protocol</h3>
                   <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mt-1.5">Required Data Nodes</p>
                </div>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Name", status: "Required", color: "from-emerald-500 to-emerald-700" },
                    { label: "Phone", status: "Required", color: "from-blue-500 to-blue-700" },
                    { label: "Email", status: "Dynamic", color: "from-violet-500 to-violet-700" },
                    { label: "Passport", status: "Optional", color: "from-orange-500 to-orange-700" },
                    { label: "Visa", status: "Optional", color: "from-rose-500 to-rose-700" },
                    { label: "Company", status: "Optional", color: "from-cyan-500 to-cyan-700" },
                    { label: "Remarks", status: "Optional", color: "from-slate-500 to-slate-700" },
                    { label: "Birth Date", status: "Sync", color: "from-amber-500 to-amber-700" },
                ].map((col, i) => (
                    <div key={i} className="p-5 rounded-3xl bg-emerald-50/30 border border-emerald-100/50 hover:bg-white hover:shadow-xl transition-all">
                        <p className="font-black text-emerald-950 text-xs mb-1 uppercase tracking-tight">{col.label}</p>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                            col.status === 'Required' ? 'bg-emerald-100 text-emerald-700' : 'bg-white/50 text-emerald-400'
                        }`}>{col.status}</span>
                    </div>
                ))}
             </div>

             <div className="mt-10 p-5 rounded-3xl bg-emerald-950 text-emerald-100 flex gap-4 items-start shadow-xl">
                 <FiAlertCircle className="text-emerald-400 w-5 h-5 flex-shrink-0" />
                 <p className="text-[10px] font-bold leading-relaxed tracking-wide">
                    ENGINE LOGIC: The system automatically normalizes headers. For example, <span className="text-emerald-400 font-extrabold">"Mobile Number"</span> maps to <span className="text-emerald-400 font-extrabold">"Phone"</span> across all spreadsheet dialects.
                 </p>
             </div>
          </div>

          {/* Sync History */}
          <div className="bg-white p-10 rounded-[50px] border border-emerald-50 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                  <h3 className="text-xl font-black text-emerald-950 uppercase tracking-tighter">Sync Archive</h3>
                  <FiClock className="text-emerald-200" />
              </div>
              <div className="space-y-4">
                  {recentImports.map((imp, i) => (
                      <div key={i} className="group p-5 rounded-3xl bg-emerald-50/30 border border-transparent hover:border-emerald-100 hover:bg-white hover:shadow-xl transition-all flex items-center gap-4 cursor-pointer">
                          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-300 group-hover:text-emerald-600 transition-colors">
                            <FiFileText size={20} />
                          </div>
                          <div className="flex-1 overflow-hidden">
                              <p className="font-black text-emerald-900 text-xs truncate uppercase">{imp.name}</p>
                              <p className="text-[9px] text-emerald-400 font-black uppercase tracking-widest mt-1">{imp.date}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${imp.color}`}>
                            {imp.status}
                          </div>
                      </div>
                  ))}
              </div>
              <button className="w-full mt-10 py-4 bg-emerald-50 text-emerald-700 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-emerald-100 transition-all border border-emerald-100">
                View Detailed Logs
              </button>
          </div>
      </div>
    </div>
  );
}

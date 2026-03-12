"use client";

import { useState } from "react";
import { 
  FiSearch, FiFile, FiUpload, FiCheckCircle, FiTrash2, FiEye, FiPaperclip, FiShield, FiUser, FiAlertCircle
} from "react-icons/fi";

interface DocumentsTabProps {
  customers: any[];
}

export default function DocumentsTab({ customers }: DocumentsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showSearchList, setShowSearchList] = useState(false);

  const filteredCustomers = customers.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.passportNo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* Search Header */}
      <div className="bg-white p-12 rounded-[50px] shadow-sm border border-emerald-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50 -mr-32 -mt-32"></div>
        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8">
            <div className="w-20 h-20 bg-emerald-950 text-white rounded-[25px] flex items-center justify-center mx-auto shadow-2xl">
                <FiShield size={40} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-emerald-950 uppercase tracking-tighter">Verification Node Search</h2>
              <p className="text-[10px] text-emerald-500/60 font-black uppercase tracking-[0.3em] mt-2">Document Registry Access Portal</p>
            </div>
            
            <div className="relative group">
                <FiSearch className="absolute left-8 top-1/2 -translate-y-1/2 text-emerald-400 group-focus-within:text-emerald-950 transition-colors" size={20} />
                <input 
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowSearchList(true);
                    }}
                    onFocus={() => setShowSearchList(true)}
                    placeholder="Search traveler name or passport identity..."
                    className="w-full pl-18 pr-8 py-6 bg-emerald-50/50 border border-emerald-100 rounded-[2.5rem] outline-none focus:ring-8 focus:ring-emerald-500/5 focus:bg-white transition-all font-bold text-emerald-950 text-sm shadow-inner"
                />
                
                {showSearchList && searchTerm.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-[35px] shadow-2xl border border-emerald-50 overflow-hidden z-20 animate-in fade-in slide-in-from-top-4">
                      <div className="max-h-[300px] overflow-y-auto">
                          {filteredCustomers.map(cust => (
                            <div 
                              key={cust._id} 
                              onClick={() => {
                                setSelectedCustomer(cust);
                                setShowSearchList(false);
                                setSearchTerm(cust.name);
                              }}
                              className="p-6 hover:bg-emerald-50 cursor-pointer flex justify-between items-center transition-colors border-b border-emerald-50 last:border-0"
                            >
                               <div className="flex items-center gap-4 text-left">
                                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-black text-xs">
                                    {cust.name?.[0]}
                                  </div>
                                  <div>
                                    <p className="font-black text-emerald-950 text-xs uppercase tracking-tight">{cust.name}</p>
                                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{cust.passportNo || 'NO_PASSPORT'}</p>
                                  </div>
                               </div>
                               <FiUser className="text-emerald-200" />
                            </div>
                          ))}
                          {filteredCustomers.length === 0 && (
                            <div className="p-10 text-center text-emerald-900/40 font-black uppercase tracking-widest text-xs">No traveler nodes found</div>
                          )}
                      </div>
                  </div>
                )}
            </div>
        </div>
      </div>

      {selectedCustomer ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in zoom-in-95 duration-500">
           {/* Document Cards */}
           <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-10 rounded-[50px] shadow-sm border border-emerald-50">
                 <div className="flex justify-between items-center mb-10">
                    <h3 className="text-xl font-black text-emerald-950 uppercase tracking-tighter">Document Registry Grid</h3>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Active File Stream</span>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { name: "Passport Scan", type: "PDF/IMG", status: "Missing", icon: <FiFile /> },
                      { name: "Visa Copy", type: "PDF", status: "Verified", date: "Oct 12", icon: <FiCheckCircle /> },
                      { name: "Ticket Itinerary", type: "PDF", status: "Verified", date: "Oct 14", icon: <FiCheckCircle /> },
                      { name: "Hotel Voucher", type: "PDF/DOC", status: "Missing", icon: <FiFile /> },
                    ].map((doc, i) => (
                      <div key={i} className="group p-6 rounded-[35px] bg-emerald-50/30 border border-transparent hover:border-emerald-100 hover:bg-white hover:shadow-xl transition-all relative overflow-hidden">
                        {doc.status === 'Verified' && <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500"></div>}
                        <div className="flex justify-between items-start mb-6">
                           <div className={`w-12 h-12 rounded-2xl ${doc.status === 'Verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-white text-emerald-200'} flex items-center justify-center shadow-sm transition-transform group-hover:scale-110`}>
                             {doc.icon}
                           </div>
                           <div className="flex gap-2">
                              {doc.status === 'Verified' ? (
                                <>
                                  <button className="p-2 text-emerald-400 hover:text-emerald-950 transition-colors"><FiEye /></button>
                                  <button className="p-2 text-red-200 hover:text-red-500 transition-colors"><FiTrash2 /></button>
                                </>
                              ) : (
                                <button className="px-4 py-2 bg-emerald-950 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">Upload</button>
                              )}
                           </div>
                        </div>
                        <p className="font-black text-emerald-950 text-sm uppercase tracking-tight">{doc.name}</p>
                        <div className="flex justify-between items-center mt-2">
                           <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">{doc.type}</p>
                           <p className={`text-[9px] font-black uppercase tracking-widest ${doc.status === 'Verified' ? 'text-emerald-600' : 'text-rose-400'}`}>{doc.status === 'Verified' ? `SYNC: ${doc.date}` : 'PENDING_INGESTION'}</p>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="bg-emerald-950 p-12 rounded-[50px] text-white relative overflow-hidden group transition-all hover:bg-black">
                 <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -mr-24 -mb-24 scale-150 transition-transform group-hover:scale-200"></div>
                 <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400 backdrop-blur-xl border border-white/10">
                            <FiUpload size={32} />
                        </div>
                        <div>
                            <h4 className="text-xl font-black uppercase tracking-tighter">Bulk Archive Ingestion</h4>
                            <p className="text-emerald-400/60 text-[10px] font-black uppercase tracking-widest mt-1">Compress and sync multiple nodes</p>
                        </div>
                    </div>
                    <button className="px-10 py-5 bg-white text-emerald-950 font-black rounded-3xl text-xs uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all">
                        Initialize Sync
                    </button>
                 </div>
              </div>
           </div>

           {/* Traveler Context Card */}
           <div className="space-y-8">
              <div className="bg-white p-10 rounded-[50px] shadow-sm border border-emerald-50">
                 <div className="text-center space-y-6">
                    <div className="w-24 h-24 rounded-[30px] bg-emerald-50 text-emerald-600 flex items-center justify-center text-4xl font-black mx-auto shadow-inner">
                        {selectedCustomer.name?.[0].toUpperCase()}
                    </div>
                    <div>
                        <h4 className="text-2xl font-black text-emerald-950 uppercase tracking-tighter">{selectedCustomer.name}</h4>
                        <p className="text-emerald-500/60 text-[10px] font-black uppercase tracking-widest mt-1">Verified Traveler Node</p>
                    </div>
                 </div>

                 <div className="mt-10 pt-10 border-t border-emerald-50 space-y-6">
                    <div className="p-6 bg-emerald-50/50 rounded-[30px] border border-emerald-100 flex items-center gap-5">
                       <FiPaperclip className="text-emerald-400 shrink-0" size={24} />
                       <div>
                          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Total Assets</p>
                          <p className="text-lg font-black text-emerald-950">12 Files <span className="text-[10px] font-black text-emerald-300 ml-2">4.2 MB</span></p>
                       </div>
                    </div>
                    
                    <div className="space-y-3">
                       <p className="text-[10px] font-black text-emerald-900/30 uppercase tracking-[0.2em] ml-2">Security Compliance</p>
                       <div className="h-3 bg-emerald-50 rounded-full overflow-hidden border border-emerald-100">
                          <div className="h-full bg-emerald-600 rounded-full w-[65%] transition-all duration-1000 shadow-lg"></div>
                       </div>
                       <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest text-right">65% Node Verified</p>
                    </div>
                 </div>

                 <button className="w-full mt-10 py-5 bg-emerald-50 text-emerald-700 font-black rounded-3xl hover:bg-emerald-100 transition-all text-[10px] uppercase tracking-[0.2em]">
                    Generate Verification Report
                 </button>
              </div>

              <div className="p-8 bg-amber-50 rounded-[40px] border border-amber-100 flex gap-5 items-start">
                 <FiAlertCircle className="text-amber-500 shrink-0 mt-1" size={20} />
                 <div>
                    <p className="text-amber-700 font-black text-[10px] uppercase tracking-widest">Audit Required</p>
                    <p className="text-amber-600/80 font-bold text-[11px] leading-relaxed mt-1">
                        Passport Scan is flagged as "Expired". Please update the registry to maintain node integrity.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      ) : (
        <div className="py-24 text-center bg-white rounded-[60px] border border-emerald-50 shadow-inner">
           <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 text-emerald-100 border border-dashed border-emerald-200">
              <FiFile size={48} />
           </div>
           <h4 className="text-2xl font-black text-emerald-950 mb-3 uppercase tracking-tighter">No node selected</h4>
           <p className="text-emerald-600/40 text-[11px] font-black uppercase tracking-widest max-w-sm mx-auto">Use the search gateway above to access the document registry for a specific traveler node.</p>
        </div>
      )}
    </div>
  );
}

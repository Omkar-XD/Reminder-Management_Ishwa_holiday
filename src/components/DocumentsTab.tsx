"use client";

import { useState, useEffect, useRef } from "react";
import { 
  FiSearch, FiFile, FiUpload, FiCheckCircle, FiTrash2, FiEye, FiPaperclip, FiShield, FiUser, FiAlertCircle, FiX
} from "react-icons/fi";

interface DocumentsTabProps {
  customers: any[];
}

export default function DocumentsTab({ customers }: DocumentsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showSearchList, setShowSearchList] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const [uploadDocType, setUploadDocType] = useState("");

  const filteredCustomers = customers.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.passportNo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchList(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      fetchDocuments(selectedCustomer._id);
    }
  }, [selectedCustomer]);

  const fetchDocuments = async (customerId: string) => {
    try {
      const res = await fetch(`/api/customers/${customerId}/documents`);
      if (res.ok) {
        setDocuments(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch documents");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedCustomer) return;

    setIsUploading(uploadDocType);
    
    // Convert to base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Data = reader.result;
      
      try {
        const res = await fetch(`/api/customers/${selectedCustomer._id}/documents`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            docType: uploadDocType,
            fileData: base64Data,
            fileType: file.name.split('.').pop()
          })
        });

        if (res.ok) {
          fetchDocuments(selectedCustomer._id);
        }
      } catch (err) {
        alert("Upload failed");
      } finally {
        setIsUploading(null);
      }
    };
  };

  const handleDelete = async (docId: string) => {
    if (!confirm("Are you sure you want to delete this document from the registry?")) return;
    try {
      const res = await fetch(`/api/customers/${selectedCustomer._id}/documents/${docId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchDocuments(selectedCustomer._id);
      }
    } catch (err) {
      alert("Delete failed");
    }
  };

  const triggerUpload = (type: string) => {
    setUploadDocType(type);
    fileInputRef.current?.click();
  };

  const getDocBySlot = (slotType: string) => {
    return documents.find(d => d.type === slotType);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
      />

      {/* Search Header */}
      <div className="bg-white p-12 rounded-[50px] shadow-sm border border-[#90E0EF] relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#CAF0F8] rounded-full blur-3xl opacity-50 -mr-32 -mt-32"></div>
        <div ref={searchRef} className="relative z-10 max-w-2xl mx-auto text-center space-y-8">
            <div className="w-20 h-20 bg-[#03045E] text-white rounded-[25px] flex items-center justify-center mx-auto shadow-2xl">
                <FiShield size={40} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-[#03045E] uppercase tracking-tighter">Verification Node Search</h2>
              <p className="text-[10px] text-[#0077B6]/60 font-black uppercase tracking-[0.3em] mt-2">Document Registry Access Portal</p>
            </div>
            
            <div className="relative group">
                <FiSearch className="absolute left-8 top-1/2 -translate-y-1/2 text-[#00B4D8] group-focus-within:text-[#03045E] transition-colors" size={20} />
                <input 
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowSearchList(true);
                    }}
                    onFocus={() => setShowSearchList(true)}
                    placeholder="Search traveler name or passport identity..."
                    className="w-full pl-18 pr-8 py-6 bg-[#CAF0F8]/50 border border-[#90E0EF] rounded-[2.5rem] outline-none focus:ring-8 focus:ring-[#0077B6]/5 focus:bg-white transition-all font-bold text-[#03045E] text-sm shadow-inner"
                />
                
                {showSearchList && searchTerm.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-[35px] shadow-2xl border border-[#90E0EF] overflow-hidden z-50 animate-in fade-in slide-in-from-top-4">
                      <div className="max-h-[300px] overflow-y-auto">
                          {filteredCustomers.map(cust => (
                            <div 
                              key={cust._id} 
                              onClick={() => {
                                setSelectedCustomer(cust);
                                setShowSearchList(false);
                                setSearchTerm(cust.name);
                              }}
                              className="p-6 hover:bg-[#CAF0F8] cursor-pointer flex justify-between items-center transition-colors border-b border-[#90E0EF] last:border-0"
                            >
                               <div className="flex items-center gap-4 text-left">
                                  <div className="w-10 h-10 rounded-xl bg-[#CAF0F8] flex items-center justify-center text-[#03045E] font-black text-xs">
                                    {cust.name?.[0]}
                                  </div>
                                  <div>
                                    <p className="font-black text-[#03045E] text-xs uppercase tracking-tight">{cust.name}</p>
                                    <p className="text-[10px] font-black text-[#00B4D8] uppercase tracking-widest">{cust.passportNo || 'NO_PASSPORT'}</p>
                                  </div>
                                </div>
                               <FiUser className="text-[#90E0EF]" />
                            </div>
                          ))}
                          {filteredCustomers.length === 0 && (
                            <div className="p-10 text-center text-[#03045E]/40 font-black uppercase tracking-widest text-xs">No traveler nodes found</div>
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
              <div className="bg-white p-10 rounded-[50px] shadow-sm border border-[#90E0EF]">
                 <div className="flex justify-between items-center mb-10">
                    <h3 className="text-xl font-black text-[#03045E] uppercase tracking-tighter">Document Registry Grid</h3>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#00B4D8]"></span>
                        <span className="text-[10px] font-black text-[#00B4D8] uppercase tracking-widest">Active File Stream</span>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {[
                      { id: 'passport', name: "Passport Scan", type: "PDF/IMG" },
                      { id: 'visa', name: "Visa Copy", type: "PDF" },
                      { id: 'ticket', name: "Ticket Itinerary", type: "PDF" },
                      { id: 'hotel', name: "Hotel Voucher", type: "PDF/DOC" },
                    ].map((slot) => {
                      const doc = getDocBySlot(slot.id);
                      return (
                        <div key={slot.id} className="group p-6 rounded-[35px] bg-[#CAF0F8]/30 border border-transparent hover:border-[#90E0EF] hover:bg-white hover:shadow-xl transition-all relative overflow-hidden">
                          {doc && <div className="absolute top-0 right-0 w-2 h-full bg-[#03045E]"></div>}
                          <div className="flex justify-between items-start mb-6">
                             <div className={`w-12 h-12 rounded-2xl ${doc ? 'bg-[#CAF0F8] text-[#03045E]' : 'bg-white text-[#90E0EF]'} flex items-center justify-center shadow-sm transition-transform group-hover:scale-110`}>
                               {doc ? <FiCheckCircle size={24} /> : <FiFile size={24} />}
                             </div>
                             <div className="flex gap-2">
                                {doc ? (
                                  <>
                                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="p-2 text-[#00B4D8] hover:text-[#03045E] transition-colors"><FiEye /></a>
                                    <button onClick={() => handleDelete(doc._id)} className="p-2 text-red-200 hover:text-red-500 transition-colors"><FiTrash2 /></button>
                                  </>
                                ) : (
                                  <button 
                                    onClick={() => triggerUpload(slot.id)}
                                    disabled={isUploading === slot.id}
                                    className="px-4 py-2 bg-[#03045E] text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all disabled:opacity-50"
                                  >
                                    {isUploading === slot.id ? "Syncing..." : "Upload"}
                                  </button>
                                )}
                             </div>
                          </div>
                          <p className="font-black text-[#03045E] text-sm uppercase tracking-tight">{slot.name}</p>
                          <div className="flex justify-between items-center mt-2">
                             <p className="text-[9px] font-black text-[#00B4D8] uppercase tracking-widest">{slot.type}</p>
                             <p className={`text-[9px] font-black uppercase tracking-widest ${doc ? 'text-[#0077B6]' : 'text-rose-400'}`}>
                               {doc ? `SYNC: ${new Date(doc.uploadedAt).toLocaleDateString([], {month:'short', day:'numeric'})}` : 'PENDING_INGESTION'}
                             </p>
                          </div>
                        </div>
                      );
                    })}
                 </div>

                   {/* Extra Documents List */}
                 {documents.filter(d => !['passport', 'visa', 'ticket', 'hotel'].includes(d.type)).length > 0 && (
                   <div className="mt-10 pt-10 border-t border-[#90E0EF] space-y-4">
                      <p className="text-[10px] font-black text-[#03045E]/30 uppercase tracking-[0.2em] ml-2 mb-4">Supplementary Archive</p>
                      {documents.filter(d => !['passport', 'visa', 'ticket', 'hotel'].includes(d.type)).map((doc) => (
                        <div key={doc._id} className="flex items-center justify-between p-5 bg-[#CAF0F8]/20 rounded-2xl hover:bg-[#CAF0F8] transition-all border border-transparent hover:border-[#90E0EF]">
                           <div className="flex items-center gap-4">
                              <FiFile className="text-[#00B4D8]" />
                              <div>
                                <p className="text-xs font-black text-[#03045E] uppercase">{doc.name}</p>
                                <p className="text-[9px] font-black text-[#00B4D8] uppercase">Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                              </div>
                           </div>
                           <div className="flex gap-4">
                              <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-[#00B4D8] hover:text-[#03045E]"><FiEye /></a>
                              <button onClick={() => handleDelete(doc._id)} className="text-red-300 hover:text-red-500"><FiTrash2 /></button>
                           </div>
                        </div>
                      ))}
                   </div>
                 )}
              </div>

              <div className="bg-[#03045E] p-12 rounded-[50px] text-white relative overflow-hidden group transition-all hover:bg-black">
                 <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -mr-24 -mb-24 scale-150 transition-transform group-hover:scale-200"></div>
                 <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-[#90E0EF] backdrop-blur-xl border border-white/10">
                            <FiUpload size={32} />
                        </div>
                        <div>
                            <h4 className="text-xl font-black uppercase tracking-tighter">Supplementary Node Sync</h4>
                            <p className="text-[#90E0EF]/60 text-[10px] font-black uppercase tracking-widest mt-1">Ingest additional traveler documents</p>
                        </div>
                    </div>
                    <button 
                      onClick={() => triggerUpload("Other")}
                      disabled={isUploading === "Other"}
                      className="px-10 py-5 bg-white text-[#03045E] font-black rounded-3xl text-xs uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all disabled:opacity-50"
                    >
                        {isUploading === "Other" ? "Processing..." : "Initialize Sync"}
                    </button>
                 </div>
              </div>
           </div>

           {/* Traveler Context Card */}
           <div className="space-y-8">
              <div className="bg-white p-10 rounded-[50px] shadow-sm border border-[#90E0EF]">
                 <div className="relative">
                    <button 
                       onClick={() => setSelectedCustomer(null)}
                      className="absolute -top-4 -right-4 w-8 h-8 bg-[#CAF0F8] text-[#0077B6] rounded-full flex items-center justify-center hover:bg-[#90E0EF] transition-all"
                    >
                       <FiX />
                    </button>
                    <div className="text-center space-y-6">
                      <div className="w-24 h-24 rounded-[30px] bg-[#CAF0F8] text-[#03045E] flex items-center justify-center text-4xl font-black mx-auto shadow-inner">
                          {selectedCustomer.name?.[0].toUpperCase()}
                      </div>
                      <div>
                          <h4 className="text-2xl font-black text-[#03045E] uppercase tracking-tighter">{selectedCustomer.name}</h4>
                          <p className="text-[#0077B6]/60 text-[10px] font-black uppercase tracking-widest mt-1">Verified Traveler Node</p>
                      </div>
                    </div>
                 </div>

                 <div className="mt-10 pt-10 border-t border-[#90E0EF] space-y-6">
                    <div className="p-6 bg-[#CAF0F8]/50 rounded-[30px] border border-[#90E0EF] flex items-center gap-5">
                       <FiPaperclip className="text-[#00B4D8] shrink-0" size={24} />
                       <div>
                          <p className="text-[10px] font-black text-[#00B4D8] uppercase tracking-widest mb-1">Managed Assets</p>
                          <p className="text-lg font-black text-[#03045E]">{documents.length} Files</p>
                       </div>
                    </div>
                    
                    <div className="space-y-3">
                       <p className="text-[10px] font-black text-[#03045E]/30 uppercase tracking-[0.2em] ml-2">Compliance Rating</p>
                       <div className="h-3 bg-[#CAF0F8] rounded-full overflow-hidden border border-[#90E0EF]">
                          <div 
                            className="h-full bg-[#0077B6] rounded-full transition-all duration-1000 shadow-lg" 
                            style={{ width: `${Math.min((documents.length / 4) * 100, 100)}%` }}
                          ></div>
                       </div>
                       <p className="text-[9px] font-black text-[#0077B6] uppercase tracking-widest text-right">
                         {Math.min(Math.round((documents.length / 4) * 100), 100)}% Node Verified
                       </p>
                    </div>
                 </div>
              </div>

              {documents.length < 4 && (
                <div className="p-8 bg-amber-50 rounded-[40px] border border-amber-100 flex gap-5 items-start">
                   <FiAlertCircle className="text-amber-500 shrink-0 mt-1" size={20} />
                   <div>
                      <p className="text-amber-700 font-black text-[10px] uppercase tracking-widest">Incomplete Registry</p>
                      <p className="text-amber-600/80 font-bold text-[11px] leading-relaxed mt-1">
                          The traveler node is missing critical identification assets. Please provide Passport and VISA scans.
                      </p>
                   </div>
                </div>
              )}
           </div>
        </div>
      ) : (
        <div className="py-24 text-center bg-white rounded-[60px] border border-[#90E0EF] shadow-inner">
           <div className="w-24 h-24 bg-[#CAF0F8] rounded-full flex items-center justify-center mx-auto mb-8 text-[#90E0EF] border border-dashed border-[#90E0EF]">
              <FiFile size={48} />
           </div>
           <h4 className="text-2xl font-black text-[#03045E] mb-3 uppercase tracking-tighter">No node selected</h4>
           <p className="text-[#0077B6]/40 text-[11px] font-black uppercase tracking-widest max-w-sm mx-auto">Use the search gateway above to access the document registry for a specific traveler node.</p>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { 
  FiPlus, FiUser, FiSearch, FiMessageSquare, FiSend, FiChevronDown, FiGlobe, FiMail, FiCheckCircle
} from "react-icons/fi";

interface DirectReminderProps {
  customers: any[];
  templates: any[];
  onRefresh: () => void;
  prefill?: {
    customerId?: string;
    category?: string;
  };
}

export default function DirectReminder({ customers, templates, onRefresh, prefill }: DirectReminderProps) {
  const [sendMode, setSendMode] = useState<"single" | "bulk">("single");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomers, setSelectedCustomers] = useState<any[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");

  useEffect(() => {
    if (prefill) {
      if (prefill.customerId) {
        const customer = customers.find(c => c._id === prefill.customerId);
        if (customer) {
          setSelectedCustomers([customer]);
          setSearchTerm(customer.name);
          setSendMode("single");
        }
      }
      if (prefill.category) {
        const template = templates.find(t => t.category?.toLowerCase() === prefill.category?.toLowerCase());
        if (template) {
          setSelectedTemplateId(template._id);
        } else {
            // Fallback to name match if category doesn't work
            const templateByName = templates.find(t => t.name?.toLowerCase().includes(prefill.category?.toLowerCase() || ''));
            if (templateByName) setSelectedTemplateId(templateByName._id);
        }
      }
    }
  }, [prefill, customers, templates]);
  const [channel, setChannel] = useState<"whatsapp" | "email" | "both">("whatsapp");
  const [isSending, setIsSending] = useState(false);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowCustomerDropdown(false);
        setShowTemplateDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone?.includes(searchTerm)
  );

  const selectedTemplate = templates.find(t => t._id === selectedTemplateId);

  const handleSelectCustomer = (customer: any) => {
    if (sendMode === "single") {
      setSelectedCustomers([customer]);
      setSearchTerm(customer.name);
    } else {
      if (!selectedCustomers.find(c => c._id === customer._id)) {
        setSelectedCustomers([...selectedCustomers, customer]);
      }
      setSearchTerm("");
    }
    setShowCustomerDropdown(false);
  };

  const handleRemoveCustomer = (id: string) => {
    setSelectedCustomers(selectedCustomers.filter(c => c._id !== id));
  };

  const handleSend = async () => {
    if (selectedCustomers.length === 0 || !selectedTemplateId) {
      alert("Please select traveler(s) and a template.");
      return;
    }

    setIsSending(true);
    let successCount = 0;

    for (const cust of selectedCustomers) {
      let message = selectedTemplate.content;
      // Replace variables
      message = message.replace(/\[Name\]/g, cust.name || "");
      message = message.replace(/\[Document ID\]/g, cust.studentId || "");
      message = message.replace(/\[Passport\]/g, cust.passportNo || "");
      message = message.replace(/\[Visa\]/g, cust.visaNo || "");

      try {
        let sentAny = false;
        
        // WhatsApp Transmission
        if ((channel === "whatsapp" || channel === "both") && cust.phone) {
            const res = await fetch("/api/ultramsg", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ to: cust.phone, message })
            });
            
            if (res.ok) sentAny = true;
            
            // Log WhatsApp attempt
            await fetch("/api/logs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  customerName: cust.name,
                  type: selectedTemplate.name,
                  channel: "WhatsApp",
                  status: res.ok ? "Sent" : "Failed",
                  message: message.substring(0, 100)
                })
            });
        }

        // Email Transmission
        if ((channel === "email" || channel === "both") && cust.email) {
            const res = await fetch("/api/email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                to: cust.email, 
                subject: `${selectedTemplate.name} - Ishwa Holidays`,
                message 
              })
            });
            
            if (res.ok) sentAny = true;

            // Log Email attempt
            await fetch("/api/logs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  customerName: cust.name,
                  type: selectedTemplate.name,
                  channel: "Email",
                  status: res.ok ? "Sent" : "Failed",
                  message: message.substring(0, 100)
                })
            });
        }

        if (sentAny) successCount++;

      } catch (err) {
        console.error("Failed to process reminder for", cust.name, err);
      }
    }

    setIsSending(false);
    alert(`Transmission protocol completed. Success: ${successCount}/${selectedCustomers.length}`);
    setSelectedCustomers([]);
    setSelectedTemplateId("");
    setSearchTerm("");
    onRefresh();
  };

  return (
    <div ref={containerRef} className="bg-white rounded-[40px] shadow-sm border border-[#90E0EF] mb-10 p-10 animate-in fade-in slide-in-from-top-4 duration-500 relative">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-[#03045E] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#CAF0F8]">
          <FiPlus size={20} />
        </div>
        <h2 className="text-2xl font-black text-[#03045E] uppercase tracking-tighter">Send Reminder</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Selection */}
        <div className="space-y-8">
          <div className="bg-[#CAF0F8]/30 p-2 rounded-[24px] flex w-fit">
            <button 
              onClick={() => { setSendMode("single"); setSelectedCustomers([]); }}
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${sendMode === "single" ? "bg-white text-[#03045E] shadow-sm" : "text-[#03045E]/40 hover:text-[#0077B6]"}`}
            >
              Single Person
            </button>
            <button 
              onClick={() => { setSendMode("bulk"); setSelectedCustomers([]); }}
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${sendMode === "bulk" ? "bg-white text-[#03045E] shadow-sm" : "text-[#03045E]/40 hover:text-[#0077B6]"}`}
            >
              Bulk Send
            </button>
          </div>

          <div className="relative">
            <label className="block text-[10px] font-black uppercase text-[#0077B6] mb-3 ml-2 tracking-widest">Select Traveler(s)</label>
            <div className="relative group">
              <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-[#00B4D8] group-focus-within:text-[#03045E] transition-colors" />
              <input 
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowCustomerDropdown(true);
                }}
                onFocus={() => setShowCustomerDropdown(true)}
                placeholder="Search customer by name..."
                className="w-full pl-14 pr-6 py-5 bg-[#CAF0F8]/50 border border-[#90E0EF] rounded-[24px] outline-none focus:ring-4 focus:ring-[#0077B6]/10 focus:bg-white transition-all text-sm font-bold text-[#03045E]"
              />
              
              {showCustomerDropdown && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-[#90E0EF] rounded-[32px] shadow-2xl z-50 overflow-hidden py-3 animate-in fade-in slide-in-from-top-2">
                  <div className="max-h-60 overflow-y-auto scrollbar-hide">
                    {filteredCustomers.length > 0 ? filteredCustomers.map(cust => (
                      <div 
                        key={cust._id}
                        onClick={() => handleSelectCustomer(cust)}
                        className="px-6 py-4 hover:bg-[#CAF0F8] cursor-pointer flex items-center justify-between group/item"
                      >
                        <div>
                          <p className="font-black text-[#03045E] text-xs uppercase">{cust.name}</p>
                          <p className="text-[9px] font-black text-[#00B4D8] uppercase tracking-widest">{cust.phone || 'NO_PHONE'}</p>
                        </div>
                        <FiUser className="text-[#90E0EF] group-hover/item:text-[#03045E] transition-colors" />
                      </div>
                    )) : (
                      <div className="px-6 py-4 text-[#00B4D8] text-[10px] font-black uppercase italic">No records found</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {selectedCustomers.length > 0 ? selectedCustomers.map(cust => (
                <div key={cust._id} className="bg-[#03045E] text-white px-5 py-2 rounded-full text-[10px] font-black uppercase flex items-center gap-3">
                  {cust.name}
                  <button onClick={() => handleRemoveCustomer(cust._id)} className="hover:text-red-400 font-black"><FiPlus className="rotate-45" /></button>
                </div>
              )) : (
                <p className="text-[#00B4D8]/40 text-[10px] font-black italic ml-2 mt-2 uppercase tracking-widest">No travelers selected yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Template & Channel */}
        <div className="space-y-8">
          <div className="relative">
            <label className="block text-[10px] font-black uppercase text-[#0077B6] mb-3 ml-2 tracking-widest">Select Template</label>
            <div 
              onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
              className="w-full px-6 py-5 bg-[#CAF0F8]/50 border border-[#90E0EF] rounded-[24px] outline-none flex justify-between items-center cursor-pointer hover:bg-white transition-all group"
            >
              <div className="flex items-center gap-3">
                <FiMessageSquare className="text-[#00B4D8] group-hover:text-[#03045E] transition-colors" />
                <span className={`text-sm font-bold ${selectedTemplate ? 'text-[#03045E]' : 'text-[#00B4D8]'}`}>
                  {selectedTemplate ? selectedTemplate.name : "Choose a template..."}
                </span>
              </div>
              <FiChevronDown className={`text-[#00B4D8] transition-transform ${showTemplateDropdown ? 'rotate-180' : ''}`} />
              
              {showTemplateDropdown && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-[#90E0EF] rounded-[35px] shadow-2xl z-[60] overflow-hidden py-4 animate-in fade-in slide-in-from-top-2">
                   <div className="max-h-72 overflow-y-auto scrollbar-hide">
                    {templates.length > 0 ? templates.map(tmpl => (
                        <div 
                          key={tmpl._id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTemplateId(tmpl._id);
                            setShowTemplateDropdown(false);
                          }}
                          className={`px-8 py-5 hover:bg-[#CAF0F8]/50 cursor-pointer flex flex-col gap-1 transition-all border-b border-[#90E0EF]/30 last:border-0 ${selectedTemplateId === tmpl._id ? 'bg-[#CAF0F8]' : ''}`}
                        >
                          <p className="font-extrabold text-[#03045E] text-[11px] uppercase tracking-widest leading-none">
                            {tmpl.name}
                          </p>
                        </div>
                    )) : (
                      <div className="px-8 py-5 text-[#00B4D8] text-[10px] font-black italic uppercase">No templates configured</div>
                    )}
                   </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-[#0077B6] mb-3 ml-2 tracking-widest">Select Channel</label>
            <div className="flex gap-4">
              {[
                { id: "whatsapp", label: "WhatsApp", icon: <FiGlobe /> },
                { id: "email", label: "Email", icon: <FiMail /> },
                { id: "both", label: "Both", icon: <FiCheckCircle /> }
              ].map(c => (
                <button 
                  key={c.id}
                  onClick={() => setChannel(c.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 py-5 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all ${channel === c.id ? 'bg-[#03045E] text-white shadow-xl shadow-[#CAF0F8]/20 ring-2 ring-[#CAF0F8]' : 'bg-white border border-[#90E0EF] text-[#03045E]/40 hover:border-[#0077B6]'}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleSend}
            disabled={isSending}
            className="w-full py-6 bg-[#03045E] text-white font-black rounded-[2.5rem] shadow-2xl shadow-[#CAF0F8] hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3"
          >
            {isSending ? "Processing..." : (
              <>
                <FiSend />
                Send Direct Reminder
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { 
  FiSearch, FiPlus, FiEdit, FiTrash2, FiUser, 
  FiCheckCircle, FiChevronLeft, FiChevronRight, FiChevronDown, FiUpload, FiDownload, FiEye, FiMapPin, FiBriefcase, FiFileText, FiShield, FiClock, FiAlertCircle
} from "react-icons/fi";
import * as XLSX from "xlsx";

interface TravelersTabProps {
  customers: any[];
  onRefresh: () => void;
}

export default function TravelersTab({ customers, onRefresh }: TravelersTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewCustomer, setViewCustomer] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showMaritalDropdown, setShowMaritalDropdown] = useState(false);

  const [formData, setFormData] = useState({
    travelerType: "Individual",
    name: "",
    dob: "",
    email: "",
    phone: "",
    gender: "Male",
    studentId: "",
    maritalStatus: "Single",
    anniversaryDate: "",
    passportNo: "",
    visaNo: "",
    passportExpiry: "",
    visaExpiry: "",
    companyName: "",
    companyId: "",
    companyEmail: "",
    companyContact: "",
    companyRepresentative: "",
    puneFRO: "",
    remark: "",
    status: "Active",
    pwd1: "",
    userIdExcel: "",
    pwd2: "",
    work: "",
    applicationDate: "",
    applicationNumber: "",
  });

  const filteredCustomers = customers.filter(cust =>
    cust.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cust.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cust.passportNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cust.phone?.includes(searchTerm)
  );

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing ? `/api/customers/${editingId}` : "/api/customers";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowModal(false);
        resetForm();
        onRefresh();
      }
    } catch (err) {
      alert("Error saving traveler");
    }
  };

  const handleEdit = (cust: any) => {
    setIsEditing(true);
    setEditingId(cust._id);
    setFormData({
      travelerType: cust.travelerType || "Individual",
      name: cust.name || "",
      dob: cust.dob || "",
      email: cust.email || "",
      phone: cust.phone || "",
      gender: cust.gender || "Male",
      studentId: cust.studentId || "",
      maritalStatus: cust.maritalStatus || "Single",
      anniversaryDate: cust.anniversaryDate || "",
      passportNo: cust.passportNo || "",
      visaNo: cust.visaNo || "",
      passportExpiry: cust.passportExpiry || "",
      visaExpiry: cust.visaExpiry || "",
      companyName: cust.companyName || "",
      companyId: cust.companyId || "",
      companyEmail: cust.companyEmail || "",
      companyContact: cust.companyContact || "",
      companyRepresentative: cust.companyRepresentative || "",
      puneFRO: cust.puneFRO || "",
      remark: cust.remark || "",
      status: cust.status || "Active",
      pwd1: cust.pwd1 || "",
      userIdExcel: cust.userIdExcel || "",
      pwd2: cust.pwd2 || "",
      work: cust.work || "",
      applicationDate: cust.applicationDate || "",
      applicationNumber: cust.applicationNumber || ""
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this traveler record?")) return;
    const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });
    if (res.ok) onRefresh();
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      travelerType: "Individual",
      name: "", dob: "", email: "", phone: "", gender: "Male",
      studentId: "", maritalStatus: "Single", anniversaryDate: "",
      passportNo: "", visaNo: "", passportExpiry: "", visaExpiry: "",
      companyName: "", companyId: "", companyEmail: "", companyContact: "", companyRepresentative: "",
      puneFRO: "", remark: "", status: "Active", pwd1: "", userIdExcel: "", pwd2: "", work: "",
      applicationDate: "", applicationNumber: ""
    });
  };

  const handleImport = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsImporting(true);
    const reader = new FileReader();

    reader.onload = async (evt: any) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

        const res = await fetch("/api/customers/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jsonData)
        });
        if (res.ok) {
           alert("Import Successful!");
           onRefresh();
        }
      } catch (err) {
        alert("Import Error");
      } finally {
        setIsImporting(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
            { label: "Scheduled", val: "8", trend: "+2 today", color: "from-blue-600 to-indigo-600", icon: <FiClock /> },
            { label: "Delivered", val: "5", trend: "+1 today", color: "from-emerald-500 to-teal-600", icon: <FiCheckCircle /> },
            { label: "Critical", val: "3", trend: "Action required", color: "from-rose-500 to-orange-600", icon: <FiAlertCircle /> },
        ].map((s, i) => (
            <div key={i} className="group relative overflow-hidden bg-white p-7 rounded-[2.5rem] border border-emerald-50 shadow-sm hover:shadow-2xl hover:shadow-emerald-900/5 transition-all duration-500">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-3">{s.label}</p>
                        <h3 className="text-4xl font-black text-emerald-950 tracking-tighter mb-2">{s.val}</h3>
                        <span className="text-[9px] font-black text-emerald-600/40 uppercase tracking-widest">{s.trend}</span>
                    </div>
                    <div className={`w-14 h-14 rounded-[1.5rem] bg-gradient-to-br ${s.color} text-white flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                        {s.icon}
                    </div>
                </div>
            </div>
        ))}
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-emerald-50 overflow-hidden">
        <div className="p-10 border-b border-emerald-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <h2 className="text-2xl font-black text-emerald-950 uppercase tracking-tighter">Traveler Registry</h2>
            <div className="flex gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                    <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-400" />
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search records..."
                        className="w-full pl-14 pr-6 py-4 bg-emerald-50/50 border border-emerald-100 rounded-3xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all text-sm font-bold text-emerald-900"
                    />
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-1 transition-all active:scale-95"
                >
                    <FiPlus /> New Traveler
                </button>
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-emerald-50/30">
                <th className="px-8 py-5 text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em]">#</th>
                <th className="px-8 py-5 text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em]">Traveler Name</th>
                <th className="px-8 py-5 text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em]">Phone</th>
                <th className="px-8 py-5 text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em]">Email</th>
                <th className="px-8 py-5 text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em]">Passport No</th>
                <th className="px-8 py-5 text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em]">Visa No</th>
                <th className="px-8 py-5 text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em]">Company</th>
                <th className="px-8 py-5 text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em] text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50/50">
              {filteredCustomers.map((cust, idx) => (
                <tr key={cust._id} className="hover:bg-emerald-50/20 transition-colors group">
                  <td className="px-8 py-6 text-xs font-black text-emerald-900/30 font-mono">{String(idx + 1).padStart(2, '0')}</td>
                  <td className="px-8 py-6">
                    <p className="font-black text-emerald-950 text-sm uppercase group-hover:text-emerald-600 transition-colors">{cust.name}</p>
                    <p className="text-[9px] font-black text-emerald-400 tracking-widest mt-0.5 uppercase">ID: {cust.studentId || 'N/A'}</p>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-emerald-900/70">{cust.phone || '—'}</td>
                  <td className="px-8 py-6 text-sm font-bold text-emerald-900/70">{cust.email || '—'}</td>
                  <td className="px-8 py-6 text-sm font-bold text-emerald-900 uppercase">{cust.passportNo || '—'}</td>
                  <td className="px-8 py-6 text-sm font-bold text-emerald-900 uppercase">{cust.visaNo || '—'}</td>
                  <td className="px-8 py-6 text-sm font-bold text-emerald-900/70 uppercase">{cust.companyName || '—'}</td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      cust.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {cust.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center gap-3">
                       <button 
                        onClick={() => { setViewCustomer(cust); setShowViewModal(true); }}
                        className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl font-black text-[10px] uppercase hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                      >
                        Profile
                      </button>
                      <button onClick={() => handleEdit(cust)} className="p-2.5 text-emerald-400 hover:text-emerald-700 transition-colors">
                        <FiEdit size={16} />
                      </button>
                      <button onClick={() => handleDelete(cust._id)} className="p-2.5 text-red-300 hover:text-red-600 transition-colors">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-20 text-center">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-200">
                      <FiUser size={40} />
                    </div>
                    <p className="text-emerald-900/40 font-black uppercase tracking-widest text-sm">Registry node empty</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- FORM MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl p-10 animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh] scrollbar-hide">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-black text-emerald-900 mb-1">{isEditing ? "Edit Traveler Details" : "Manual Traveler Registration"}</h2>
                    <p className="text-emerald-600 font-bold uppercase tracking-widest text-[10px]">{isEditing ? "Update existing record in node database" : "Add a new traveler record to your database"}</p>
                </div>
                <button
                    onClick={() => setShowModal(false)}
                    className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-400 hover:bg-emerald-100 hover:text-emerald-600 transition-all font-bold"
                >
                    <FiPlus className="rotate-45 w-6 h-6" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section: Configuration */}
                <div>
                    <label className="block text-[10px] font-black uppercase text-emerald-400 mb-2 ml-1">Registration Type</label>
                    <div className="relative">
                        <div
                            onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                            className="w-full bg-emerald-100/50 border border-emerald-300 rounded-2xl p-4 text-sm text-emerald-950 focus:ring-2 focus:ring-emerald-600 outline-none font-black flex justify-between items-center cursor-pointer hover:bg-emerald-50 transition-all shadow-sm"
                        >
                            <span>{formData.travelerType}</span>
                            <FiChevronDown className={`text-emerald-500 transition-transform ${showTypeDropdown ? 'rotate-180' : ''}`} />
                        </div>
                        {showTypeDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-emerald-200 rounded-2xl shadow-2xl z-50 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2">
                                {['Individual', 'Company/Org'].map(type => (
                                    <div
                                        key={type}
                                        onClick={() => {
                                            setFormData({ ...formData, travelerType: type });
                                            setShowTypeDropdown(false);
                                        }}
                                        className={`px-5 py-3 text-sm font-bold cursor-pointer transition-all ${formData.travelerType === type ? 'bg-emerald-600 text-white' : 'text-emerald-700 hover:bg-emerald-50'}`}
                                    >
                                        {type}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Section: Company Data (CONDITIONAL) */}
                {formData.travelerType === "Company/Org" && (
                    <div className="bg-emerald-50/50 p-6 rounded-[2rem] border border-emerald-100 space-y-6">
                        <h4 className="text-emerald-900 font-black uppercase tracking-widest text-xs flex items-center gap-2 mb-2">
                            <FiBriefcase className="text-emerald-500" /> Corporate Entity Details
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div>
                                <label className="block text-[10px] font-black uppercase text-emerald-400 mb-2 ml-1">Company Name</label>
                                <input
                                    type="text" required placeholder="Organization Name..."
                                    className="w-full bg-white border border-emerald-200 rounded-2xl p-4 text-sm text-emerald-900 focus:ring-2 focus:ring-emerald-600 outline-none font-bold"
                                    value={formData.companyName}
                                    onChange={handleInputChange} name="companyName"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase text-emerald-400 mb-2 ml-1">Company ID</label>
                                <input
                                    type="text" placeholder="Registration No..."
                                    className="w-full bg-white border border-emerald-200 rounded-2xl p-4 text-sm text-emerald-900 focus:ring-2 focus:ring-emerald-600 outline-none font-bold"
                                    value={formData.companyId}
                                    onChange={handleInputChange} name="companyId"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <div>
                                <label className="block text-[10px] font-black uppercase text-emerald-400 mb-2 ml-1">Company Mail</label>
                                <input
                                    type="email" placeholder="Corporate email..."
                                    className="w-full bg-white border border-emerald-200 rounded-2xl p-4 text-sm text-emerald-900 focus:ring-2 focus:ring-emerald-600 outline-none font-bold"
                                    value={formData.companyEmail}
                                    onChange={handleInputChange} name="companyEmail"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase text-emerald-400 mb-2 ml-1">Company Contact</label>
                                <input
                                    type="text" placeholder="Primary phone..."
                                    className="w-full bg-white border border-emerald-200 rounded-2xl p-4 text-sm text-emerald-900 focus:ring-2 focus:ring-emerald-600 outline-none font-bold"
                                    value={formData.companyContact}
                                    onChange={handleInputChange} name="companyContact"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase text-emerald-400 mb-2 ml-1">Representative</label>
                                <input
                                    type="text" placeholder="Point of Contact..."
                                    className="w-full bg-white border border-emerald-200 rounded-2xl p-4 text-sm text-emerald-900 focus:ring-2 focus:ring-emerald-600 outline-none font-bold"
                                    value={formData.companyRepresentative}
                                    onChange={handleInputChange} name="companyRepresentative"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Section: Personal Identity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] font-black uppercase text-emerald-400 mb-2 ml-1">Full Name</label>
                        <input
                            type="text" required placeholder="Enter traveler name..."
                            className="w-full bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-sm text-emerald-900 focus:ring-2 focus:ring-emerald-600 outline-none font-bold"
                            value={formData.name}
                            onChange={handleInputChange} name="name"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase text-emerald-400 mb-2 ml-1">Date of Birth (DOB)</label>
                        <input
                            type="date"
                            className="w-full bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-sm text-emerald-900 focus:ring-2 focus:ring-emerald-600 outline-none font-bold"
                            value={formData.dob}
                            onChange={handleInputChange} name="dob"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-emerald-50">
                    <div>
                        <label className="block text-[10px] font-black uppercase text-emerald-400 mb-2 ml-1">Mobile Number</label>
                        <input
                            type="text" placeholder="Enter mobile..."
                            className="w-full bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-sm text-emerald-900 focus:ring-2 focus:ring-emerald-600 outline-none font-bold"
                            value={formData.phone}
                            onChange={handleInputChange} name="phone"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase text-emerald-400 mb-2 ml-1">Email Address</label>
                        <input
                            type="email" placeholder="Enter email..."
                            className="w-full bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-sm text-emerald-900 focus:ring-2 focus:ring-emerald-600 outline-none font-bold"
                            value={formData.email}
                            onChange={handleInputChange} name="email"
                        />
                    </div>
                </div>

                {/* Section: Demographics & Docs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-[10px] font-black uppercase text-emerald-400 mb-2 ml-1">Document ID</label>
                        <input
                            type="text" placeholder="Traveler ID/Doc number..."
                            className="w-full bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-sm text-emerald-900 focus:ring-2 focus:ring-emerald-600 outline-none font-bold"
                            value={formData.studentId}
                            onChange={handleInputChange} name="studentId"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase text-emerald-400 mb-2 ml-1">Gender</label>
                        <div className="relative">
                            <div
                                onClick={() => setShowGenderDropdown(!showGenderDropdown)}
                                className="w-full bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-sm text-emerald-900 focus:ring-2 focus:ring-emerald-600 outline-none font-bold flex justify-between items-center cursor-pointer hover:bg-white transition-all shadow-sm"
                            >
                                <span>{formData.gender}</span>
                                <FiChevronDown className={`text-emerald-400 transition-transform ${showGenderDropdown ? 'rotate-180' : ''}`} />
                            </div>
                            {showGenderDropdown && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-emerald-100 rounded-2xl shadow-2xl z-50 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2">
                                    {['Male', 'Female', 'Other'].map(gender => (
                                        <div
                                            key={gender}
                                            onClick={() => {
                                                setFormData({ ...formData, gender });
                                                setShowGenderDropdown(false);
                                            }}
                                            className={`px-5 py-3 text-sm font-bold cursor-pointer transition-all ${formData.gender === gender ? 'bg-emerald-600 text-white' : 'text-emerald-700 hover:bg-emerald-50'}`}
                                        >
                                            {gender}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase text-emerald-400 mb-2 ml-1">Marital Status</label>
                        <div className="relative">
                            <div
                                onClick={() => setShowMaritalDropdown(!showMaritalDropdown)}
                                className="w-full bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-sm text-emerald-900 focus:ring-2 focus:ring-emerald-600 outline-none font-bold flex justify-between items-center cursor-pointer hover:bg-white transition-all shadow-sm"
                            >
                                <span>{formData.maritalStatus}</span>
                                <FiChevronDown className={`text-emerald-400 transition-transform ${showMaritalDropdown ? 'rotate-180' : ''}`} />
                            </div>
                            {showMaritalDropdown && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-emerald-100 rounded-2xl shadow-2xl z-50 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2">
                                    {['Single', 'Married', 'Divorced', 'Widowed'].map(status => (
                                        <div
                                            key={status}
                                            onClick={() => {
                                                setFormData({ ...formData, maritalStatus: status });
                                                setShowMaritalDropdown(false);
                                            }}
                                            className={`px-5 py-3 text-sm font-bold cursor-pointer transition-all ${formData.maritalStatus === status ? 'bg-emerald-600 text-white' : 'text-emerald-700 hover:bg-emerald-50'}`}
                                        >
                                            {status}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {formData.maritalStatus === 'Married' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase text-emerald-400 mb-2 ml-1">Anniversary Date</label>
                            <input
                                type="date"
                                className="w-full bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-sm text-emerald-900 focus:ring-2 focus:ring-emerald-600 outline-none font-bold"
                                value={formData.anniversaryDate}
                                onChange={handleInputChange} name="anniversaryDate"
                            />
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-emerald-50 pb-6 border-b border-emerald-50">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black uppercase text-emerald-400 mb-2 ml-1">Passport No</label>
                            <input
                                type="text" placeholder="Enter passport..."
                                className="w-full bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-sm text-emerald-900 focus:ring-2 focus:ring-emerald-600 outline-none font-bold uppercase"
                                value={formData.passportNo}
                                onChange={handleInputChange} name="passportNo"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase text-emerald-400 mb-2 ml-1">Passport Expiry</label>
                            <input
                                type="date"
                                className="w-full bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-sm text-emerald-900 focus:ring-2 focus:ring-emerald-600 outline-none font-bold uppercase"
                                value={formData.passportExpiry}
                                onChange={handleInputChange} name="passportExpiry"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black uppercase text-emerald-400 mb-2 ml-1">Visa No</label>
                            <input
                                type="text" placeholder="Enter visa..."
                                className="w-full bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-sm text-emerald-900 focus:ring-2 focus:ring-emerald-600 outline-none font-bold uppercase"
                                value={formData.visaNo}
                                onChange={handleInputChange} name="visaNo"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase text-emerald-400 mb-2 ml-1">Visa Expiry</label>
                            <input
                                type="date"
                                className="w-full bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-sm text-emerald-900 focus:ring-2 focus:ring-emerald-600 outline-none font-bold uppercase"
                                value={formData.visaExpiry}
                                onChange={handleInputChange} name="visaExpiry"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 pt-6">
                    <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="flex-1 py-4 font-bold text-emerald-500 hover:bg-emerald-50 rounded-2xl transition-all uppercase tracking-widest text-xs"
                    >
                        Discard Changes
                    </button>
                    <button
                        type="submit"
                        className="flex-1 py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-100 active:scale-95 transition-all uppercase tracking-widest text-xs"
                    >
                        {isEditing ? "Update Profile" : "Authorize Record"}
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}

      {/* --- VIEW PROFILE MODAL --- */}
      {showViewModal && viewCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-emerald-950/30 backdrop-blur-xl" onClick={() => setShowViewModal(false)} />
          <div className="relative w-full max-w-4xl bg-white rounded-[50px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-400">
            <div className="p-12 bg-emerald-900 text-white relative">
               <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/10 rounded-full -mr-40 -mt-40 blur-3xl animate-pulse"></div>
               <div className="relative z-10 flex items-center gap-10">
                  <div className="w-28 h-28 rounded-[35px] bg-white text-emerald-900 flex items-center justify-center text-5xl font-black shadow-2xl">
                    {viewCustomer.name?.[0].toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-5xl font-black tracking-tighter mb-4 uppercase">{viewCustomer.name}</h2>
                    <div className="flex gap-3">
                        <span className="px-5 py-2 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">GEN: {viewCustomer.gender}</span>
                        <span className="px-5 py-2 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">{viewCustomer.status || 'Verified'}</span>
                        <span className="px-5 py-2 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">N-ID: {viewCustomer.studentId || 'SYS_NULL'}</span>
                    </div>
                  </div>
                  <button onClick={() => setShowViewModal(false)} className="absolute top-0 right-0 m-10 w-14 h-14 rounded-[20px] bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all border border-white/10">
                    <FiPlus className="rotate-45" size={28}/>
                  </button>
               </div>
            </div>

            <div className="p-12 grid grid-cols-1 md:grid-cols-3 gap-12 bg-emerald-50/20">
                <div className="space-y-10">
                    <div className="flex items-center gap-4 text-emerald-800">
                        <FiUser size={24} className="shrink-0" />
                        <h4 className="font-black text-sm uppercase tracking-[0.2em]">Contact Node</h4>
                    </div>
                    <div className="space-y-6">
                        <div className="group">
                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2 ml-1">E-Mail Identity</p>
                            <p className="bg-white p-5 rounded-3xl border border-emerald-100 font-bold text-emerald-900 truncate shadow-sm group-hover:border-emerald-500 transition-colors uppercase">{viewCustomer.email || 'NOT_FOUND'}</p>
                        </div>
                        <div className="group">
                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2 ml-1">Mobile Access</p>
                            <p className="bg-white p-5 rounded-3xl border border-emerald-100 font-black text-emerald-900 shadow-sm group-hover:border-emerald-500 transition-colors">{viewCustomer.phone || 'DISCONNECTED'}</p>
                        </div>
                        <div className="group">
                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2 ml-1">Affiliated Org</p>
                            <p className="bg-white p-5 rounded-3xl border border-emerald-100 font-black text-emerald-600 shadow-sm group-hover:border-emerald-500 transition-colors uppercase">{viewCustomer.companyName || 'INDEPENDENT'}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-10">
                    <div className="flex items-center gap-4 text-orange-500">
                        <FiShield size={24} className="shrink-0" />
                        <h4 className="font-black text-sm uppercase tracking-[0.2em]">Asset Registry</h4>
                    </div>
                    <div className="space-y-5">
                        <div className="p-6 bg-white rounded-[40px] border border-emerald-100 shadow-sm relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-1.5 h-full bg-orange-500 group-hover:w-3 transition-all"></div>
                           <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-3">Passport Registry</p>
                           <h5 className="text-2xl font-black text-emerald-950 uppercase">{viewCustomer.passportNo || 'NONE'}</h5>
                           <p className="text-[9px] font-black text-red-500 mt-3 flex items-center gap-2 uppercase">
                             <FiClock size={12}/> Expiration Node: {viewCustomer.passportExpiry || 'UNTRACKED'}
                           </p>
                        </div>
                        <div className="p-6 bg-white rounded-[40px] border border-emerald-100 shadow-sm relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-1.5 h-full bg-emerald-500 group-hover:w-3 transition-all"></div>
                           <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3">Visa Protocol</p>
                           <h5 className="text-2xl font-black text-emerald-950 uppercase">{viewCustomer.visaNo || 'NONE'}</h5>
                           <p className="text-[9px] font-black text-red-500 mt-3 flex items-center gap-2 uppercase">
                             <FiClock size={12}/> Expiration Node: {viewCustomer.visaExpiry || 'UNTRACKED'}
                           </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-10">
                    <div className="flex items-center gap-4 text-emerald-800">
                        <FiBriefcase size={24} className="shrink-0" />
                        <h4 className="font-black text-sm uppercase tracking-[0.2em]">Internal Ops</h4>
                    </div>
                    <div className="p-8 bg-white rounded-[40px] border border-emerald-100 shadow-sm space-y-8">
                        <div>
                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3">FRO Registry</p>
                            <p className="font-black text-emerald-950 text-sm uppercase">{viewCustomer.puneFRO || 'NOT_ASSIGNED'}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-emerald-50 rounded-2xl">
                                <p className="text-[8px] font-black text-emerald-600 uppercase mb-1">PWD Node 1</p>
                                <p className="text-[10px] font-black text-emerald-950">{viewCustomer.pwd1 || '—'}</p>
                            </div>
                            <div className="p-4 bg-emerald-50 rounded-2xl">
                                <p className="text-[8px] font-black text-emerald-600 uppercase mb-1">PWD Node 2</p>
                                <p className="text-[10px] font-black text-emerald-950">{viewCustomer.pwd2 || '—'}</p>
                            </div>
                        </div>
                        <div className="pt-6 border-t border-emerald-50">
                            <p className="text-[9px] font-black text-emerald-400 uppercase mb-2">Master Spreadsheet ID</p>
                            <div className="px-5 py-3 bg-emerald-950 rounded-2xl text-white text-center">
                                <p className="text-xs font-black tracking-[0.3em] font-mono">{viewCustomer.userIdExcel || 'SYS_NULL'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-12 bg-white border-t border-emerald-50 flex justify-between items-center">
                <div className="flex-1 mr-12 bg-emerald-50/50 p-6 rounded-3xl border border-dashed border-emerald-200">
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <FiFileText /> System Remarks
                    </p>
                    <p className="text-sm font-bold text-emerald-700 leading-relaxed italic">
                        "{viewCustomer.remark || 'Node synchronized successfully with the master registry. No additional administrative flags present.'}"
                    </p>
                </div>
                <button 
                    onClick={() => { setShowViewModal(false); handleEdit(viewCustomer); }}
                    className="px-10 py-5 bg-emerald-700 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-emerald-800 transition-all flex items-center gap-3 shrink-0"
                >
                    <FiEdit /> Update Node
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { 
  FiSearch, FiPlus, FiEdit, FiTrash2, FiUser, 
  FiCheckCircle, FiChevronLeft, FiChevronRight, FiUpload, FiDownload, FiEye, FiMapPin, FiBriefcase, FiFileText, FiShield
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

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "Male",
    studentId: "",
    passportNo: "",
    visaNo: "",
    companyName: "",
    puneFRO: "",
    remark: "",
    status: "Active",
    pwd1: "",
    userIdExcel: "",
    pwd2: "",
    work: "",
    applicationDate: "",
    applicationNumber: "",
    passportExpiry: "",
    visaExpiry: ""
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
      name: cust.name || "",
      email: cust.email || "",
      phone: cust.phone || "",
      gender: cust.gender || "Male",
      studentId: cust.studentId || "",
      passportNo: cust.passportNo || "",
      visaNo: cust.visaNo || "",
      companyName: cust.companyName || "",
      puneFRO: cust.puneFRO || "",
      remark: cust.remark || "",
      status: cust.status || "Active",
      pwd1: cust.pwd1 || "",
      userIdExcel: cust.userIdExcel || "",
      pwd2: cust.pwd2 || "",
      work: cust.work || "",
      applicationDate: cust.applicationDate || "",
      applicationNumber: cust.applicationNumber || "",
      passportExpiry: cust.passportExpiry || "",
      visaExpiry: cust.visaExpiry || ""
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
      name: "", email: "", phone: "", gender: "Male", studentId: "",
      passportNo: "", visaNo: "", companyName: "", puneFRO: "",
      remark: "", status: "Active", pwd1: "", userIdExcel: "", pwd2: "", work: "",
      applicationDate: "", applicationNumber: "", passportExpiry: "", visaExpiry: ""
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-96">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search name, phone, student ID or passport..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm transition-all"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <label className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white text-emerald-700 border border-emerald-100 rounded-2xl font-bold cursor-pointer hover:bg-emerald-50 transition-all shadow-sm">
            <FiUpload />
            <span>{isImporting ? "Importing..." : "Import Excel"}</span>
            <input type="file" className="hidden" accept=".xlsx, .xls, .csv" onChange={handleImport} disabled={isImporting} />
          </label>
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 hover:-translate-y-1 transition-all shadow-lg shadow-emerald-200 active:scale-95"
          >
            <FiPlus />
            New Traveler
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-emerald-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-emerald-50 border-b border-emerald-100">
                <th className="px-6 py-5 text-xs font-black text-emerald-900 uppercase tracking-widest">Traveler</th>
                <th className="px-6 py-5 text-xs font-black text-emerald-900 uppercase tracking-widest">Contact</th>
                <th className="px-6 py-5 text-xs font-black text-emerald-900 uppercase tracking-widest">Documents</th>
                <th className="px-6 py-5 text-xs font-black text-emerald-900 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-xs font-black text-emerald-900 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50">
              {filteredCustomers.map((cust) => (
                <tr key={cust._id} className="hover:bg-emerald-50/30 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold group-hover:scale-110 transition-transform">
                        {cust.name?.[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-emerald-900">{cust.name}</p>
                        <p className="text-emerald-500/60 text-[10px] font-bold uppercase tracking-tighter">ID: {cust.studentId || 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-emerald-800 text-sm font-medium">{cust.phone || '—'}</p>
                    <p className="text-emerald-500/60 text-xs">{cust.email || '—'}</p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-bold text-emerald-900"><span className="text-emerald-400">P/P:</span> {cust.passportNo || '—'} {cust.passportExpiry && <span className="text-[9px] text-red-500 ml-1">({cust.passportExpiry})</span>}</p>
                      <p className="text-xs font-bold text-emerald-900"><span className="text-emerald-400">Visa:</span> {cust.visaNo || '—'} {cust.visaExpiry && <span className="text-[9px] text-red-500 ml-1">({cust.visaExpiry})</span>}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      cust.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {cust.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-2 text-right">
                       <button 
                        onClick={() => { setViewCustomer(cust); setShowViewModal(true); }}
                        className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                        title="View Profile"
                      >
                        <FiEye size={16} />
                      </button>
                      <button onClick={() => handleEdit(cust)} className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                        <FiEdit size={16} />
                      </button>
                      <button onClick={() => handleDelete(cust._id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-200">
                      <FiUser size={40} />
                    </div>
                    <p className="text-emerald-900/40 font-bold">No travelers found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- FORM MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-emerald-900/20 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 scrollbar-hide">
            <div className="p-8 border-b border-emerald-50 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-emerald-900">{isEditing ? "Edit Traveler" : "Register New Traveler"}</h3>
                <p className="text-emerald-500/60 text-xs font-bold uppercase tracking-widest">Entry Database Portal</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-3 bg-emerald-50 text-emerald-400 rounded-2xl hover:text-emerald-600 transition-colors">
                <FiPlus className="rotate-45" size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 max-h-[80vh] overflow-y-auto scrollbar-hide">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="text-emerald-900 font-black text-sm uppercase tracking-widest border-l-4 border-emerald-500 pl-3">Personal Details</h4>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-emerald-700 uppercase ml-1">Full Name</label>
                    <input name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-5 py-3.5 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all font-bold text-emerald-900" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-emerald-700 uppercase ml-1">Email</label>
                    <input name="email" value={formData.email} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all font-bold text-emerald-900" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-emerald-700 uppercase ml-1">Phone Number</label>
                    <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all font-bold text-emerald-900" />
                  </div>
                   <div className="space-y-1">
                    <label className="text-[10px] font-black text-emerald-700 uppercase ml-1">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all font-bold text-emerald-900 appearance-none">
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-emerald-900 font-black text-sm uppercase tracking-widest border-l-4 border-emerald-500 pl-3">Documents</h4>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-emerald-700 uppercase ml-1">Passport Number</label>
                    <input name="passportNo" value={formData.passportNo} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all font-bold text-emerald-900" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-emerald-700 uppercase ml-1">Passport Expiry</label>
                    <input type="date" name="passportExpiry" value={formData.passportExpiry} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all font-bold text-emerald-900" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-emerald-700 uppercase ml-1">Visa Number</label>
                    <input name="visaNo" value={formData.visaNo} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all font-bold text-emerald-900" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-emerald-700 uppercase ml-1">Visa Expiry</label>
                    <input type="date" name="visaExpiry" value={formData.visaExpiry} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all font-bold text-emerald-900" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-emerald-700 uppercase ml-1">Student ID</label>
                    <input name="studentId" value={formData.studentId} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all font-bold text-emerald-900" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-emerald-700 uppercase ml-1">Application Date</label>
                    <input type="date" name="applicationDate" value={formData.applicationDate} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all font-bold text-emerald-900" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-emerald-700 uppercase ml-1">Application Number</label>
                    <input name="applicationNumber" value={formData.applicationNumber} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all font-bold text-emerald-900" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-emerald-900 font-black text-sm uppercase tracking-widest border-l-4 border-emerald-500 pl-3">Additional Info</h4>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-emerald-700 uppercase ml-1">Company/Work</label>
                    <input name="companyName" value={formData.companyName} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all font-bold text-emerald-900" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-emerald-700 uppercase ml-1">Pune FRO</label>
                    <input name="puneFRO" value={formData.puneFRO} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all font-bold text-emerald-900" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-emerald-700 uppercase ml-1">PWD 1</label>
                      <input name="pwd1" value={formData.pwd1} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all font-bold text-emerald-900" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-emerald-700 uppercase ml-1">PWD 2</label>
                      <input name="pwd2" value={formData.pwd2} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all font-bold text-emerald-900" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-emerald-700 uppercase ml-1">User ID (Excel)</label>
                    <input name="userIdExcel" value={formData.userIdExcel} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all font-bold text-emerald-900" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-emerald-700 uppercase ml-1">Work Description</label>
                    <input name="work" value={formData.work} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all font-bold text-emerald-900" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-emerald-700 uppercase ml-1">Remark</label>
                    <textarea name="remark" value={formData.remark} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all font-bold text-emerald-900 h-20 resize-none" />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-8 py-3.5 bg-emerald-50 text-emerald-800 font-bold rounded-2xl hover:bg-emerald-100 transition-all font-black text-[10px] uppercase tracking-widest">Cancel</button>
                <button type="submit" className="px-10 py-3.5 bg-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-1 transition-all active:scale-95 text-[10px] uppercase tracking-widest">Save Traveler Info</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- VIEW PROFILE MODAL --- */}
      {showViewModal && viewCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-md" onClick={() => setShowViewModal(false)} />
          <div className="relative w-full max-w-4xl bg-white rounded-[50px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 bg-emerald-600 text-white relative">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
               <div className="relative z-10 flex items-center gap-8">
                  <div className="w-24 h-24 rounded-[32px] bg-white text-emerald-600 flex items-center justify-center text-4xl font-black shadow-2xl">
                    {viewCustomer.name?.[0].toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-4xl font-black tracking-tight mb-2">{viewCustomer.name}</h2>
                    <div className="flex gap-4">
                        <span className="px-4 py-1.5 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">{viewCustomer.gender}</span>
                        <span className="px-4 py-1.5 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">{viewCustomer.status || 'Active'}</span>
                    </div>
                  </div>
                  <button onClick={() => setShowViewModal(false)} className="absolute top-0 right-0 m-8 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
                    <FiPlus className="rotate-45" size={24}/>
                  </button>
               </div>
            </div>

            <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-10 bg-emerald-50/10">
                {/* Personal & Contact */}
                <div className="space-y-8">
                    <div className="flex items-center gap-4 text-emerald-600">
                        <FiUser size={20} className="shrink-0" />
                        <h4 className="font-black text-sm uppercase tracking-widest">Identity & Contact</h4>
                    </div>
                    <div className="space-y-5">
                        <div className="group">
                            <p className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest mb-1 ml-1 group-hover:text-emerald-600 transition-colors">Primary Email</p>
                            <p className="bg-white p-4 rounded-2xl border border-emerald-100 font-bold text-emerald-900 truncate shadow-sm">{viewCustomer.email || 'None Registered'}</p>
                        </div>
                        <div className="group">
                            <p className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest mb-1 ml-1 group-hover:text-emerald-600 transition-colors">Mobile Access</p>
                            <p className="bg-white p-4 rounded-2xl border border-emerald-100 font-bold text-emerald-900 shadow-sm">{viewCustomer.phone || 'None Registered'}</p>
                        </div>
                        <div className="group">
                            <p className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest mb-1 ml-1 group-hover:text-emerald-600 transition-colors">Network ID</p>
                            <p className="bg-white p-4 rounded-2xl border border-emerald-100 font-black text-emerald-600 shadow-sm">{viewCustomer.studentId || 'NOT_ASSIGNED'}</p>
                        </div>
                    </div>
                </div>

                {/* Documentation Tracker */}
                <div className="space-y-8">
                    <div className="flex items-center gap-4 text-orange-500">
                        <FiFileText size={20} className="shrink-0" />
                        <h4 className="font-black text-sm uppercase tracking-widest">Document Registry</h4>
                    </div>
                    <div className="space-y-4">
                        <div className="p-5 bg-white rounded-3xl border border-emerald-100 shadow-sm relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500 group-hover:w-4 transition-all"></div>
                           <p className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest mb-2">Passport Matrix</p>
                           <h5 className="text-xl font-black text-emerald-900">{viewCustomer.passportNo || '—'}</h5>
                           <p className="text-[10px] font-bold text-red-500 mt-2 flex items-center gap-2">
                             <FiMapPin size={10}/> Expiry: {viewCustomer.passportExpiry || 'No Data'}
                           </p>
                        </div>
                        <div className="p-5 bg-white rounded-3xl border border-emerald-100 shadow-sm relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-2 h-full bg-blue-500 group-hover:w-4 transition-all"></div>
                           <p className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest mb-2">Visa Clearance</p>
                           <h5 className="text-xl font-black text-emerald-900">{viewCustomer.visaNo || '—'}</h5>
                           <p className="text-[10px] font-bold text-red-500 mt-2 flex items-center gap-2">
                             <FiMapPin size={10}/> Expiry: {viewCustomer.visaExpiry || 'No Data'}
                           </p>
                        </div>
                        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                            <p className="text-[9px] font-black text-emerald-700 uppercase tracking-tighter">Application Node: {viewCustomer.applicationNumber || 'None'}</p>
                            <p className="text-[9px] font-black text-emerald-700 uppercase tracking-tighter">Registered: {viewCustomer.applicationDate || '—'}</p>
                        </div>
                    </div>
                </div>

                {/* Professional & Secure */}
                <div className="space-y-8">
                    <div className="flex items-center gap-4 text-emerald-600">
                        <FiBriefcase size={20} className="shrink-0" />
                        <h4 className="font-black text-sm uppercase tracking-widest">Operational Core</h4>
                    </div>
                    <div className="p-6 bg-white rounded-[40px] border border-emerald-100 shadow-sm space-y-6">
                        <div>
                            <p className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest mb-2">Affiliation</p>
                            <p className="font-bold text-emerald-900">{viewCustomer.companyName || 'Corporate Individual'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest mb-2">FRO Status</p>
                            <p className="font-bold text-emerald-900 truncate">{viewCustomer.puneFRO || 'NOT_APPLICABLE'}</p>
                        </div>
                        <div className="pt-4 border-t border-emerald-50">
                            <div className="flex gap-2 mb-4">
                                <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-[9px] font-black uppercase">P1: {viewCustomer.pwd1 || '—'}</span>
                                <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-[9px] font-black uppercase">P2: {viewCustomer.pwd2 || '—'}</span>
                            </div>
                            <div className="p-3 bg-emerald-900 rounded-2xl text-white">
                                <p className="text-[9px] font-black uppercase opacity-60">Excel Registry ID</p>
                                <p className="text-xs font-black tracking-widest">{viewCustomer.userIdExcel || 'SYS_NULL'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-10 bg-white border-t border-emerald-50 flex justify-between items-center">
                <div className="flex-1 mr-10">
                    <p className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest mb-2">Professional Remark</p>
                    <p className="text-sm font-medium text-emerald-600 leading-relaxed italic truncate max-w-full">
                        "{viewCustomer.remark || 'No specific administrative remarks recorded for this traveler.'}"
                    </p>
                </div>
                <button 
                    onClick={() => { setShowViewModal(false); handleEdit(viewCustomer); }}
                    className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center gap-2"
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

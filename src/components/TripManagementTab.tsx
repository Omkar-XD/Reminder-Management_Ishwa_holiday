"use client";

import { useState, useEffect, useRef } from "react";
import { 
  FiCalendar, FiPlus, FiMapPin, FiTruck, FiHome, FiCheckCircle, FiClock, FiEdit, FiTrash2, FiX, FiLayout
} from "react-icons/fi";

interface TripManagementTabProps {
  trips: any[];
  onRefresh: () => void;
  triggerNewTrip?: number;
}

export default function TripManagementTab({ trips, onRefresh, triggerNewTrip }: TripManagementTabProps) {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const lastTriggered = useRef(triggerNewTrip || 0);

  useEffect(() => {
    if (triggerNewTrip && triggerNewTrip > lastTriggered.current) {
      resetForm();
      setShowModal(true);
    }
    lastTriggered.current = triggerNewTrip || 0;
  }, [triggerNewTrip]);

  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    type: "Domestic",
    status: "Draft",
    hotelStatus: "Pending",
    vehicleStatus: "Pending"
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing ? `/api/trips/${editingId}` : "/api/trips";

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
      alert("Error saving trip data.");
    }
  };

  const handleEdit = (trip: any) => {
    setIsEditing(true);
    setEditingId(trip._id);
    setFormData({
      title: trip.title || "",
      startDate: trip.startDate || "",
      endDate: trip.endDate || "",
      type: trip.type || "Domestic",
      status: trip.status || "Draft",
      hotelStatus: trip.hotelStatus || "Pending",
      vehicleStatus: trip.vehicleStatus || "Pending"
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to terminate this voyage node?")) return;
    await fetch(`/api/trips/${id}`, { method: "DELETE" });
    onRefresh();
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      title: "", startDate: "", endDate: "", type: "Domestic",
      status: "Draft", hotelStatus: "Pending", vehicleStatus: "Pending"
    });
  };

  const filteredTrips = trips.filter(trip => {
    if (filter === "all") return true;
    if (filter === "active") return ["Active", "Booking Open", "In Preparation"].includes(trip.status);
    if (filter === "draft") return trip.status === "Draft";
    return true;
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
            { label: "Active Expeditions", val: trips.filter(t => t.status === 'Active').length, status: "Live Now", color: "text-[#03045E]", bg: "bg-[#CAF0F8]", icon: <FiLayout /> },
            { label: "Planned Groups", val: trips.filter(t => ['Draft', 'In Preparation', 'Booking Open'].includes(t.status)).length, status: "Upcoming", color: "text-[#0077B6]", bg: "bg-[#CAF0F8]/50", icon: <FiCalendar /> },
            { label: "Confirmed Hotels", val: trips.filter(t => t.hotelStatus === 'Confirmed').length, status: "Verified", color: "text-[#00B4D8]", bg: "bg-[#90E0EF]/20", icon: <FiHome /> },
            { label: "Pending Transport", val: trips.filter(t => t.vehicleStatus === 'Pending').length, status: "Critical", color: "text-orange-600", bg: "bg-orange-50", icon: <FiTruck /> },
        ].map((s, i) => (
            <div key={i} className="bg-white p-7 rounded-[40px] border border-[#90E0EF] shadow-sm hover:shadow-xl hover:shadow-[#03045E]/5 transition-all group">
                <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform`}>
                        {s.icon}
                    </div>
                    <span className={`text-[9px] font-black px-3 py-1 rounded-lg ${s.bg} ${s.color} uppercase tracking-widest mt-1`}>{s.status}</span>
                </div>
                <p className="text-[10px] font-black text-[#03045E]/30 uppercase tracking-[0.2em] mb-1">{s.label}</p>
                <h3 className="text-3xl font-black text-[#03045E]">{s.val}</h3>
            </div>
        ))}
      </div>

      {/* Control Row */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-5 rounded-[35px] border border-[#90E0EF] shadow-sm gap-6">
         <div className="flex bg-[#CAF0F8]/50 p-1.5 rounded-2xl border border-[#90E0EF]/50 w-full md:w-auto">
            {[
              { id: "all", label: "All Voyages" },
              { id: "active", label: "Active" },
              { id: "draft", label: "Drafts" }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                  filter === f.id ? "bg-[#03045E] text-white shadow-xl shadow-[#CAF0F8]" : "text-[#03045E]/40 hover:text-[#0077B6]"
                }`}
              >
                {f.label}
              </button>
            ))}
         </div>
      </div>

      {/* Trips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTrips.map((trip) => (
          <div key={trip._id} className="bg-white p-10 rounded-[60px] border border-[#90E0EF] shadow-sm hover:shadow-2xl hover:shadow-[#03045E]/5 transition-all group flex flex-col h-[480px] relative overflow-hidden">
            {/* Status Badge */}
            <div className="flex justify-between items-center mb-10 relative z-10">
                <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${
                    trip.status === 'Active' ? 'bg-[#CAF0F8] text-[#03045E]' : 
                    trip.status === 'Booking Open' ? 'bg-[#90E0EF] text-[#0077B6]' : 
                    trip.status === 'Draft' ? 'bg-slate-100 text-slate-500' : 'bg-orange-100 text-orange-600'
                }`}>
                  {trip.status} Node
                </span>
                <div className="flex gap-2">
                    <button onClick={() => handleEdit(trip)} className="w-10 h-10 flex items-center justify-center text-[#0077B6] hover:text-[#03045E] bg-[#CAF0F8] rounded-xl transition-all"><FiEdit size={16}/></button>
                    <button onClick={() => handleDelete(trip._id)} className="w-10 h-10 flex items-center justify-center text-rose-300 hover:text-rose-600 bg-rose-50 rounded-xl transition-all"><FiTrash2 size={16}/></button>
                </div>
            </div>

            <div className="flex-1 relative z-10">
                <span className="text-[10px] font-black text-[#0077B6] uppercase tracking-[0.2em] mb-3 block">{trip.type} Expedition</span>
                <h3 className="text-2xl font-extrabold text-[#03045E] mb-4 leading-tight uppercase tracking-tight group-hover:text-[#0077B6] transition-colors h-14 overflow-hidden">{trip.title}</h3>
                <div className="flex items-center gap-4 bg-[#CAF0F8]/50 p-4 rounded-2xl border border-[#90E0EF]/50 w-fit">
                    <FiMapPin className="text-[#0077B6]" />
                    <p className="text-[10px] font-black text-[#03045E] tracking-widest">{trip.startDate} — {trip.endDate}</p>
                </div>
 
                <div className="mt-10 space-y-5 pt-8 border-t border-[#90E0EF]">
                    <div className="flex justify-between items-center group/item">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-[#CAF0F8] text-[#03045E] flex items-center justify-center transition-all group-hover/item:scale-110">
                                <FiHome size={18} />
                            </div>
                            <span className="text-[10px] font-black text-[#03045E]/40 uppercase tracking-widest">Hotel Lock</span>
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${trip.hotelStatus === 'Confirmed' ? 'bg-[#CAF0F8] text-[#03045E]' : 'bg-orange-50 text-orange-500'}`}>
                            {trip.hotelStatus}
                        </span>
                    </div>
                    <div className="flex justify-between items-center group/item">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-[#90E0EF]/30 text-[#0077B6] flex items-center justify-center transition-all group-hover/item:scale-110">
                                <FiTruck size={18} />
                            </div>
                            <span className="text-[10px] font-black text-[#03045E]/40 uppercase tracking-widest">Vehicle Log</span>
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${trip.vehicleStatus === 'Confirmed' ? 'bg-[#CAF0F8] text-[#03045E]' : 'bg-orange-50 text-orange-500'}`}>
                            {trip.vehicleStatus}
                        </span>
                    </div>
                </div>
            </div>

            <button onClick={() => handleEdit(trip)} className="w-full mt-10 py-5 bg-[#03045E] text-white rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] transition-all relative overflow-hidden shadow-2xl shadow-[#CAF0F8] active:scale-95">
                <span className="relative z-10">Configure Voyage Logic</span>
                <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>

            {/* Background Accent */}
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#CAF0F8] rounded-full blur-3xl opacity-50 -z-0 group-hover:bg-[#90E0EF] transition-colors duration-500"></div>
          </div>
        ))}
        
        {filteredTrips.length === 0 && (
          <div className="col-span-full py-32 text-center bg-white rounded-[60px] border border-[#90E0EF] border-dashed">
             <div className="w-24 h-24 bg-[#CAF0F8] rounded-full flex items-center justify-center mx-auto mb-8 text-[#90E0EF]">
                <FiLayout size={54} />
             </div>
             <h4 className="text-xl font-bold text-[#03045E] mb-2 uppercase tracking-tight">Voyage Registry Empty</h4>
             <p className="text-[#0077B6]/40 text-[11px] font-black uppercase tracking-widest">Initialize a new protocol to begin expedition tracking</p>
          </div>
        )}
      </div>

      {/* Trip Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#03045E]/20 backdrop-blur-xl" onClick={() => setShowModal(false)} />
           <div className="relative w-full max-w-2xl bg-white rounded-[60px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-12 bg-[#03045E] text-white flex justify-between items-center">
                 <div>
                    <h3 className="text-3xl font-extrabold uppercase tracking-tight leading-none">{isEditing ? "Modify Voyage" : "Initialize New Trip"}</h3>
                    <p className="text-[#90E0EF] text-[10px] font-black uppercase tracking-[0.3em] mt-3">Expedition Management Control</p>
                 </div>
                 <button onClick={() => setShowModal(false)} className="w-14 h-14 bg-white/10 text-white rounded-[22px] hover:bg-white/20 transition-all flex items-center justify-center border border-white/5">
                    <FiX size={28} />
                 </button>
              </div>               <form onSubmit={handleSubmit} className="p-12 space-y-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-[#03045E]/40 uppercase ml-3 tracking-widest">Voyage Designation</label>
                    <input name="title" value={formData.title} onChange={handleInputChange} required placeholder="Ex: Manali Oct Flight Group..." className="w-full px-8 py-5 bg-[#CAF0F8]/50 border border-[#90E0EF] rounded-[28px] outline-none focus:ring-8 focus:ring-[#00B4D8]/5 focus:bg-white transition-all text-[#03045E] font-bold uppercase text-sm" />
                 </div>
 
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-[#03045E]/40 uppercase ml-3 tracking-widest">Commencement Date</label>
                       <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} required className="w-full px-8 py-5 bg-[#CAF0F8]/50 border border-[#90E0EF] rounded-[28px] outline-none focus:ring-8 focus:ring-[#00B4D8]/5 focus:bg-white transition-all text-[#03045E] font-black uppercase text-sm" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-[#03045E]/40 uppercase ml-3 tracking-widest">Termination Date</label>
                       <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} required className="w-full px-8 py-5 bg-[#CAF0F8]/50 border border-[#90E0EF] rounded-[28px] outline-none focus:ring-8 focus:ring-[#00B4D8]/5 focus:bg-white transition-all text-[#03045E] font-black uppercase text-sm" />
                    </div>
                 </div>
 
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-[#03045E]/40 uppercase ml-3 tracking-widest">Classification</label>
                       <select name="type" value={formData.type} onChange={handleInputChange} className="w-full px-8 py-5 bg-[#CAF0F8]/50 border border-[#90E0EF] rounded-[28px] outline-none focus:ring-8 focus:ring-[#00B4D8]/5 focus:bg-white transition-all text-[#03045E] font-black uppercase text-sm appearance-none">
                          {["Domestic", "International", "Corporate", "Family", "Cultural", "Adventure", "Other"].map(t => <option key={t}>{t}</option>)}
                       </select>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-[#03045E]/40 uppercase ml-3 tracking-widest">Lifecycle Status</label>
                       <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-8 py-5 bg-[#CAF0F8]/50 border border-[#90E0EF] rounded-[28px] outline-none focus:ring-8 focus:ring-[#00B4D8]/5 focus:bg-white transition-all text-[#03045E] font-black uppercase text-sm appearance-none">
                          {["Draft", "In Preparation", "Booking Open", "Active", "Completed", "Cancelled"].map(s => <option key={s}>{s}</option>)}
                       </select>
                    </div>
                 </div>
 
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-[#03045E]/40 uppercase ml-3 tracking-widest">Hotel Reservation</label>
                       <select name="hotelStatus" value={formData.hotelStatus} onChange={handleInputChange} className="w-full px-8 py-5 bg-[#CAF0F8]/50 border border-[#90E0EF] rounded-[28px] outline-none focus:ring-8 focus:ring-[#00B4D8]/5 focus:bg-white transition-all text-[#03045E] font-black uppercase text-sm appearance-none">
                          {["Not Required", "Pending", "In Progress", "Confirmed"].map(s => <option key={s}>{s}</option>)}
                       </select>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-[#03045E]/40 uppercase ml-3 tracking-widest">Transport Protocol</label>
                       <select name="vehicleStatus" value={formData.vehicleStatus} onChange={handleInputChange} className="w-full px-8 py-5 bg-[#CAF0F8]/50 border border-[#90E0EF] rounded-[28px] outline-none focus:ring-8 focus:ring-[#00B4D8]/5 focus:bg-white transition-all text-[#03045E] font-black uppercase text-sm appearance-none">
                          {["Not Required", "Pending", "In Progress", "Confirmed"].map(s => <option key={s}>{s}</option>)}
                       </select>
                    </div>
                 </div>
 
                 <button type="submit" className="w-full py-6 bg-[#0077B6] text-white font-black rounded-[32px] shadow-2xl shadow-[#CAF0F8] hover:bg-[#03045E] hover:-translate-y-1 transition-all active:scale-95 text-xs uppercase tracking-[0.3em] mt-4">
                    {isEditing ? "Synchronize Updates" : "Commit to Voyager Registry"}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}

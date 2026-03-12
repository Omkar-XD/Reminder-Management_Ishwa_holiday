"use client";

import { useState } from "react";
import { 
  FiCalendar, FiChevronRight, FiPlus, FiFilter, FiMapPin, FiTruck, FiHome, FiCheckCircle, FiClock
} from "react-icons/fi";

export default function TripManagementTab() {
  const [trips] = useState([
    { title: "Manali Oct Flight Group", date: "Oct 15 - Oct 22", status: "In Preparation", hotel: "Confirmed", vehicle: "Pending", type: "Domestic" },
    { title: "Goa Corporate Meet", date: "Oct 18 - Oct 21", status: "Active", hotel: "Confirmed", vehicle: "Confirmed", type: "Corporate" },
    { title: "Kerala Luxury Escape", date: "Nov 02 - Nov 10", status: "Booking Open", hotel: "In Progress", vehicle: "Pending", type: "Family" },
    { title: "Rajasthan Desert Tour", date: "Dec 05 - Dec 15", status: "Booking Open", hotel: "Confirmed", vehicle: "Pending", type: "Cultural" },
    { title: "Shimla-Manali Winter Special", date: "Dec 20 - Dec 28", status: "In Preparation", hotel: "In Progress", vehicle: "Pending", type: "Adventure" },
    { title: "Dubai Gateway Group", date: "Jan 10 - Jan 17", status: "Active", hotel: "Confirmed", vehicle: "Confirmed", type: "International" },
  ]);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
            { label: "Active Expeditions", val: "2", status: "Live Now", color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Planned Groups", val: "4", status: "Upcoming", color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Confirmed Hotels", val: "5", status: "Verified", color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Pending Transport", val: "4", status: "Critical", color: "text-orange-600", bg: "bg-orange-50" },
        ].map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-[35px] border border-emerald-50 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">{s.label}</p>
                <div className="flex items-end justify-between">
                    <h3 className="text-3xl font-black text-emerald-950">{s.val}</h3>
                    <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg ${s.bg} ${s.color} uppercase`}>{s.status}</span>
                </div>
            </div>
        ))}
      </div>

      {/* Control Row */}
      <div className="flex justify-between items-center bg-white p-4 rounded-[30px] border border-emerald-50 shadow-sm">
         <div className="flex gap-2">
            <button className="px-6 py-2.5 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-100">All Voyages</button>
            <button className="px-6 py-2.5 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-all">Active</button>
            <button className="px-6 py-2.5 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-all">Drafts</button>
         </div>
         <button className="flex items-center gap-2 px-8 py-3 bg-emerald-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">
            <FiPlus /> Initialize New Trip
         </button>
      </div>

      {/* Trips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trips.map((trip, i) => (
          <div key={i} className="bg-white p-8 rounded-[50px] border border-emerald-50 shadow-sm hover:shadow-2xl hover:shadow-emerald-900/5 transition-all group flex flex-col h-full relative overflow-hidden">
            {/* Status Badge */}
            <div className="flex justify-between items-center mb-8 relative z-10">
                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    trip.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 
                    trip.status === 'Booking Open' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                }`}>
                  {trip.status}
                </span>
                <FiCalendar className="text-emerald-200 w-5 h-5" />
            </div>

            <div className="flex-1 relative z-10">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-2 block">{trip.type}</span>
                <h3 className="text-2xl font-black text-emerald-950 mb-2 leading-none">{trip.title}</h3>
                <p className="text-xs font-bold text-emerald-600/60 flex items-center gap-2">
                    <FiMapPin size={10} /> {trip.date}
                </p>

                <div className="mt-8 space-y-4 pt-6 border-t border-emerald-50">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <FiHome size={14} />
                            </div>
                            <span className="text-xs font-bold text-emerald-900/60 uppercase">Hotel Lock</span>
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${trip.hotel === 'Confirmed' ? 'text-emerald-600' : 'text-orange-500'}`}>
                            {trip.hotel}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <FiTruck size={14} />
                            </div>
                            <span className="text-xs font-bold text-emerald-900/60 uppercase">Vehicle Log</span>
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${trip.vehicle === 'Confirmed' ? 'text-emerald-600' : 'text-orange-500'}`}>
                            {trip.vehicle}
                        </span>
                    </div>
                </div>
            </div>

            <button className="w-full mt-10 py-5 bg-emerald-50 text-emerald-700 group-hover:bg-emerald-950 group-hover:text-white rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] transition-all relative overflow-hidden">
                <span className="relative z-10">Configure Voyage</span>
                <div className="absolute inset-0 bg-emerald-800 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>

            {/* Background Accent */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-50 rounded-full blur-3xl opacity-50 -z-0"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

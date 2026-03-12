"use client";

import { motion } from "framer-motion";
import { ArrowRight, Plane, Map, ShieldCheck } from "lucide-react";

export default function Hero() {
  return (
    <div className="flex flex-col">
      {/* 1. New Full Photo Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background Photo */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/travel_hero_bg.png" 
            alt="Paradise View" 
            className="w-full h-full object-cover scale-105 animate-subtle-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#03045E]/60 via-[#03045E]/30 to-[#CAF0F8]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-md text-white rounded-full text-sm font-black border border-white/20 uppercase tracking-widest">
                <Plane size={16} className="text-[#00B4D8]" />
                <span>Next Generation Travel</span>
              </div>

              <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-[0.85]">
                LIMITLESS <br />
                <span className="text-[#00B4D8] [text-shadow:_2px_2px_0_#000,_-2px_-2px_0_#000,_2px_-2px_0_#000,_-2px_2px_0_#000]">ADVENTURE</span>
              </h1>

              <p className="max-w-2xl mx-auto text-xl text-white/80 leading-relaxed font-bold">
                Elevating every journey beyond the ordinary. Discover destinations that 
                resonate with your spirit, managed with digital precision.
              </p>

              <div className="flex justify-center pt-6">
                <button 
                  onClick={() => document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-12 py-6 bg-white text-[#03045E] rounded-full font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-[#00B4D8] hover:text-white transition-all active:scale-95 flex items-center gap-3 group"
                >
                  Start Your Odyssey
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
        </div>

        {/* Floating elements */}
        <div className="absolute bottom-10 left-10 z-10 animate-pulse">
           <div className="flex items-center gap-4 px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00B4D8]"></div>
              <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">Live Exploration Data Sync</p>
           </div>
        </div>
      </section>

      {/* 2. Text Content Section (Clean Hero) */}
      <section id="explore" className="relative py-32 bg-[#CAF0F8] overflow-hidden">
        {/* Top/Bottom Merging Gradients */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#CAF0F8] to-transparent z-10"></div>
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-20">
          <div className="text-center space-y-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-6xl md:text-8xl font-black text-[#03045E] tracking-tighter leading-[0.9]"
            >
              Experience the World <br />
              <span className="text-[#0077B6]">Like Never Before</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-lg text-[#03045E]/60 leading-relaxed font-medium"
            >
              Curated travel experiences, breathtaking destinations, and seamless planning. 
              Ishwa Holidays brings you the best of nature and luxury in one package.
            </motion.p>
          </div>

          {/* Features Grid moved here for better flow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20">
            {[
              { icon: <Map className="text-[#00B4D8]" />, title: "Custom Itineraries", desc: "Tailored trips just for you and your family." },
              { icon: <ShieldCheck className="text-[#00B4D8]" />, title: "Secure Booking", desc: "100% safe and transparent payment." },
              { icon: <Plane className="text-[#00B4D8]" />, title: "Flight Support", desc: "24/7 assistance for all your needs." }
            ].map((feature, i) => (
              <div key={i} className="group flex flex-col items-center text-center gap-6 p-10 bg-white/50 border border-[#90E0EF]/30 rounded-[3rem] hover:bg-white transition-all duration-500 shadow-sm hover:shadow-2xl">
                <div className="w-16 h-16 bg-white border border-[#90E0EF] rounded-[2rem] flex items-center justify-center shadow-sm group-hover:bg-[#03045E] group-hover:text-white transition-all duration-500">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#03045E] mb-3">{feature.title}</h3>
                  <p className="text-sm text-[#0077B6]/70 font-medium leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Image Showcase Section (Moving the old hero image here) */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Bottom merge into About Section */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#CAF0F8]/30 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[600px] rounded-[5rem] overflow-hidden border-[16px] border-[#CAF0F8] shadow-2xl"
          >
             <img 
               src="/hero.png" 
               alt="Destination Excellence" 
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#03045E]/80 via-transparent to-transparent"></div>
             <div className="absolute bottom-16 left-16">
                <span className="px-4 py-1.5 bg-[#00B4D8] text-white rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">Featured Destination</span>
                <h2 className="text-5xl font-black text-white tracking-tight">The Maldives <br/>Elite Collection</h2>
                <div className="flex items-center gap-4 mt-8">
                   <div className="h-0.5 w-12 bg-[#00B4D8]"></div>
                   <p className="text-white/60 font-bold tracking-widest text-[10px] uppercase">Winter '26 Exclusive Access</p>
                </div>
             </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { ArrowRight, Plane, Map, ShieldCheck } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -z-10 w-1/3 h-1/3 bg-emerald-50 rounded-full blur-3xl opacity-60 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 -z-10 w-1/4 h-1/4 bg-emerald-100 rounded-full blur-3xl opacity-40 -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-semibold border border-emerald-100 shadow-sm"
            >
              <Plane size={16} className="text-emerald-500" />
              <span>Discover Your Next Adventure</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-6xl md:text-8xl font-black text-emerald-900 tracking-tighter leading-[0.9]"
            >
              Experience the World <br />
              <span className="text-emerald-500">Like Never Before</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-xl text-lg text-emerald-950/60 leading-relaxed font-medium"
            >
              Curated travel experiences, breathtaking destinations, and seamless planning. 
              Ishwa Holidays brings you the best of nature and luxury in one package.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 pt-4"
            >
              <button className="w-full sm:w-auto px-10 py-5 bg-emerald-600 text-white rounded-[2rem] font-bold shadow-2xl shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2">
                Explore Destinations
                <ArrowRight size={20} />
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-[4rem] overflow-hidden border-[12px] border-white shadow-2xl shadow-emerald-100">
               <img 
                 src="/hero.png" 
                 alt="Travel Destination" 
                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 to-transparent"></div>
               <div className="absolute bottom-10 left-10 p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 text-white">
                  <p className="font-black text-2xl leading-none">Maldives Elite</p>
                  <p className="text-xs font-bold uppercase tracking-widest mt-1">Winter Collection '26</p>
               </div>
            </div>
            {/* Absolute floating elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-emerald-500 rounded-full blur-3xl opacity-20 -z-10 animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 p-6 bg-white rounded-3xl shadow-xl border border-emerald-50 flex items-center gap-4 animate-bounce duration-[3000ms]">
               <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                  <ShieldCheck size={24}/>
               </div>
               <div>
                  <p className="font-black text-emerald-900 leading-none">Secure</p>
                  <p className="text-[10px] font-bold text-emerald-600">Travel Guaranteed</p>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Features Minimal List */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-32"
        >
          {[
            { icon: <Map className="text-emerald-500" />, title: "Custom Itineraries", desc: "Tailored trips just for you and your family." },
            { icon: <ShieldCheck className="text-emerald-500" />, title: "Secure Booking", desc: "100% safe and transparent payment." },
            { icon: <Plane className="text-emerald-500" />, title: "Flight Support", desc: "24/7 assistance for all your needs." }
          ].map((feature, i) => (
            <div key={i} className="group flex items-start gap-4 p-4 rounded-3xl hover:bg-emerald-50 transition-all cursor-default">
              <div className="w-12 h-12 shrink-0 bg-white border border-emerald-50 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-emerald-900 leading-none mb-2">{feature.title}</h3>
                <p className="text-sm text-emerald-600/70 font-medium">{feature.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

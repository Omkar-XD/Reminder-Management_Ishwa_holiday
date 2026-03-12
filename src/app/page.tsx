import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Link from "next/link";
import { Plane, Map as LucideMap, ShieldCheck, Instagram, Twitter, Facebook, Linkedin } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      
      {/* About Section */}
      <section id="about" className="py-32 bg-white relative overflow-hidden">
        {/* Top/Bottom Merging Elements */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#CAF0F8]/30 to-transparent"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-40 right-0 w-96 h-96 bg-[#CAF0F8] rounded-full -mr-48 blur-3xl opacity-50"></div>
        <div className="absolute bottom-40 left-0 w-96 h-96 bg-[#CAF0F8] rounded-full -ml-48 blur-3xl opacity-50"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-sm font-black text-[#0077B6] uppercase tracking-[0.3em] mb-4">Our Essence</h2>
            <h3 className="text-5xl font-black text-[#03045E] tracking-tighter">Crafting Unforgettable <br/>Journeys Since 2026</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="flex gap-6 group">
                <div className="w-16 h-16 shrink-0 bg-[#CAF0F8] text-[#03045E] rounded-[2rem] flex items-center justify-center group-hover:bg-[#03045E] group-hover:text-white transition-all duration-500 shadow-sm border border-[#90E0EF]">
                   <div className="text-2xl font-bold">01</div>
                </div>
                <div>
                   <h4 className="text-xl font-bold text-[#03045E] mb-2">Tailored Itineraries</h4>
                   <p className="text-[#0077B6]/70 leading-relaxed font-medium">Every traveler is unique. We craft personalized experiences that match your soul's desire for adventure.</p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="w-16 h-16 shrink-0 bg-[#CAF0F8] text-[#03045E] rounded-[2rem] flex items-center justify-center group-hover:bg-[#03045E] group-hover:text-white transition-all duration-500 shadow-sm border border-[#90E0EF]">
                   <div className="text-2xl font-bold">02</div>
                </div>
                <div>
                   <h4 className="text-xl font-bold text-[#03045E] mb-2">Sustainable Travel</h4>
                   <p className="text-[#0077B6]/70 leading-relaxed font-medium">We believe in exploring the world while preserving it. Our partners follow strict eco-friendly guidelines.</p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="w-16 h-16 shrink-0 bg-[#CAF0F8] text-[#03045E] rounded-[2rem] flex items-center justify-center group-hover:bg-[#03045E] group-hover:text-white transition-all duration-500 shadow-sm border border-[#90E0EF]">
                   <div className="text-2xl font-bold">03</div>
                </div>
                <div>
                   <h4 className="text-xl font-bold text-[#03045E] mb-2">24/7 Global Concierge</h4>
                   <p className="text-[#0077B6]/70 leading-relaxed font-medium">From the moment you book until you return home, our dedicated support team is always by your side.</p>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="aspect-square bg-[#CAF0F8] rounded-[4rem] relative overflow-hidden group border border-[#90E0EF] shadow-2xl">
                 <img 
                   src="/about.png" 
                   alt="Adventure View" 
                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-tr from-[#03045E]/40 via-transparent to-transparent"></div>
                 <div className="absolute bottom-12 left-12 right-12">
                   <p className="text-white font-black text-3xl leading-tight opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">"The world is a book and those who do not travel read only one page."</p>
                   <p className="text-[#00B4D8] mt-4 font-bold opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 translate-y-4 group-hover:translate-y-0">— Augustine of Hippo</p>
                 </div>
              </div>

            </div>
          </div>
        </div>
      </section>
      {/* Services Section */}
      <section id="services" className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
             <div className="lg:w-1/2 relative">
                <div className="relative rounded-[4rem] overflow-hidden shadow-2xl border-[12px] border-[#CAF0F8]">
                   <img src="/services.png" alt="Luxury Service" className="w-full h-full object-cover" />
                </div>
             </div>
             
             <div className="lg:w-1/2 space-y-12">
                <div>
                   <h2 className="text-sm font-black text-[#0077B6] uppercase tracking-[0.3em] mb-4">Our Services</h2>
                   <h3 className="text-5xl font-black text-[#03045E] tracking-tighter">Everything Taken <br/>Care Of.</h3>
                </div>

                <div className="space-y-8">
                   {[
                     { 
                       title: "Private Aviation", 
                       desc: "Skip the lines. We coordinate private charters to the world's most remote airfields.",
                       icon: <Plane className="text-white" size={20} /> 
                     },
                     { 
                       title: "Boutique Stays", 
                       desc: "From underwater suites in Fiji to historic chateaus in the Loire Valley.",
                       icon: <LucideMap className="text-white" size={20} /> 
                     },
                     { 
                       title: "Elite Protection", 
                       desc: "Certified travel security teams available for high-profile clients and diplomats.",
                       icon: <ShieldCheck className="text-white" size={20} /> 
                     }
                   ].map((s, idx) => (
                      <div key={idx} className="flex gap-6 group">
                         <div className="w-14 h-14 bg-[#03045E] rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:bg-[#00B4D8] transition-colors duration-500">
                            {s.icon}
                         </div>
                         <div>
                            <h4 className="text-lg font-black text-[#03045E] mb-1">{s.title}</h4>
                            <p className="text-[#0077B6]/70 font-medium leading-relaxed text-sm">{s.desc}</p>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="pt-32 pb-60 bg-[#CAF0F8]/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
             <h2 className="text-sm font-black text-[#0077B6] uppercase tracking-[0.3em] mb-4">The Portfolio</h2>
             <h3 className="text-5xl font-black text-[#03045E] tracking-tighter">Captured Moments.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[700px]">
             <div className="md:col-span-8 relative group rounded-[3rem] overflow-hidden shadow-2xl">
                <img src="/gallery_1.png" alt="Destination" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#03045E]/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                <div className="absolute bottom-10 left-10 text-white">
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Featured Adventure</p>
                   <h4 className="text-3xl font-black tracking-tight">Alpine Express Retraced</h4>
                </div>
             </div>
             <div className="md:col-span-4 grid grid-rows-2 gap-6">
                <div className="relative group rounded-[3rem] overflow-hidden shadow-xl">
                   <img src="/hero.png" alt="Destination" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                   <div className="absolute inset-0 bg-[#03045E]/20 group-hover:bg-[#03045E]/0 transition-colors"></div>
                </div>
                <div className="relative group rounded-[3rem] overflow-hidden shadow-xl">
                   <img src="/about.png" alt="Destination" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                   <div className="absolute inset-0 bg-[#03045E]/20 group-hover:bg-[#03045E]/0 transition-colors"></div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-60 bg-[#03045E] text-white relative overflow-hidden">
        {/* Soft merge from White Section */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-[#CAF0F8]/50 to-transparent z-10"></div>
        
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#00B4D8]/20 blur-[180px] pointer-events-none"></div>

        {/* Dot pattern background */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-20">
          <div className="flex flex-col lg:flex-row gap-40 items-center">
            <div className="lg:w-1/2 space-y-12 text-center lg:text-left">
              <h2 className="text-7xl md:text-8xl font-black tracking-tighter leading-[0.8] mb-12">
                Let's Design Your <br/>
                <span className="text-[#00B4D8] relative inline-block">
                  Dream Holiday
                  <div className="absolute -bottom-2 left-0 w-full h-2 bg-[#00B4D8]/30 rounded-full"></div>
                </span>
              </h2>
              <p className="text-[#CAF0F8]/60 text-lg font-medium leading-relaxed max-w-xl">
                Our travel curators are ready to transform your vision into an extraordinary itinerary.
                Tell us where your spirit wants to wander.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 pt-10">
                <div className="space-y-3">
                  <p className="text-[#00B4D8] font-black uppercase tracking-[0.3em] text-[10px]">Headquarters</p>
                  <p className="text-2xl font-black tracking-tight">hello@ishwa.com</p>
                </div>
                <div className="space-y-3">
                  <p className="text-[#00B4D8] font-black uppercase tracking-[0.3em] text-[10px]">Direct Line</p>
                  <p className="text-2xl font-black tracking-tight">+91 98765 43210</p>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 w-full">
              <form className="bg-white/[0.03] backdrop-blur-3xl p-14 rounded-[4rem] border border-white/10 space-y-8 shadow-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <input placeholder="Name" className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-8 py-5 outline-none focus:bg-white/10 focus:border-[#00B4D8]/50 transition-all font-bold placeholder:text-white/20 text-sm" />
                  <input placeholder="Email" className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-8 py-5 outline-none focus:bg-white/10 focus:border-[#00B4D8]/50 transition-all font-bold placeholder:text-white/20 text-sm" />
                </div>
                <input placeholder="Destination Idea" className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-8 py-5 outline-none focus:bg-white/10 focus:border-[#00B4D8]/50 transition-all font-bold placeholder:text-white/20 text-sm" />
                <textarea placeholder="Message" className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-8 py-5 outline-none focus:bg-white/10 focus:border-[#00B4D8]/50 transition-all font-bold h-40 resize-none placeholder:text-white/20 text-sm" />
                <button className="w-full py-6 bg-[#00B4D8] hover:bg-white hover:text-[#03045E] text-white font-black rounded-[1.5rem] transition-all transform active:scale-95 uppercase tracking-[0.2em] text-[10px]">Send Inquiry</button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom merge into Footer */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[px] bg-white/10"></div>
      </section>

      {/* Premium Footer */}
      <footer className="bg-white pt-32 pb-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
            <div className="space-y-12">
              <Link href="/" className="text-3xl font-black text-[#03045E] tracking-tighter mb-4 inline-block">
                Ishwa<span className="text-[#00B4D8]">Holidays</span>
              </Link>
              <p className="text-[#0077B6]/70 font-medium leading-relaxed">
                Defining the next generation of luxury travel. We combine human expertise with digital excellence to craft journeys that resonate.
              </p>
              <div className="flex gap-4">
                 {[
                   { icon: <Instagram size={18} />, label: "Instagram" },
                   { icon: <Twitter size={18} />, label: "Twitter" },
                   { icon: <Facebook size={18} />, label: "Facebook" },
                   { icon: <Linkedin size={18} />, label: "LinkedIn" }
                 ].map((social, idx) => (
                    <div key={idx} className="w-10 h-10 bg-[#CAF0F8] rounded-xl flex items-center justify-center text-[#03045E] cursor-pointer hover:bg-[#03045E] hover:text-white transition-all duration-300" title={social.label}>
                       {social.icon}
                    </div>
                 ))}
              </div>
            </div>

            <div className="space-y-8">
               <h4 className="text-[#03045E] font-black text-sm uppercase tracking-widest">Navigation</h4>
               <ul className="space-y-4">
                  {["Home", "About", "Services", "Gallery", "Contact"].map(item => (
                     <li key={item}>
                        <Link href={item === "Home" ? "/" : `#${item.toLowerCase()}`} className="text-[#0077B6]/70 hover:text-[#03045E] font-extrabold text-base tracking-wide transition-colors">
                           {item}
                        </Link>
                     </li>
                  ))}
               </ul>
            </div>

            <div className="space-y-8">
               <h4 className="text-[#03045E] font-black text-sm uppercase tracking-widest">Connect</h4>
               <ul className="space-y-4">
                  <li><p className="text-[#0077B6]/70 font-bold">Mumbai Headquarters</p></li>
                  <li><p className="text-[#0077B6]/70 font-bold">Bangkok Regional Office</p></li>
                  <li><p className="text-[#0077B6]/70 font-bold">London Liaison</p></li>
                  <li><p className="text-[#00B4D8] font-black border-b border-[#00B4D8]/20 inline-block pb-1 cursor-pointer">View Global Map</p></li>
               </ul>
            </div>

            <div className="space-y-8">
               <h4 className="text-[#03045E] font-black text-sm uppercase tracking-widest">Newsletter</h4>
               <p className="text-[#0077B6]/70 font-bold leading-relaxed">Join 12,000+ explorers for exclusive access codes.</p>
               <div className="flex flex-col gap-3">
                  <input placeholder="Email Address" className="bg-[#CAF0F8] border-none rounded-2xl px-6 py-4 outline-none font-bold text-[#03045E] placeholder-[#03045E]/30" />
                  <button className="bg-[#03045E] text-white font-black py-4 rounded-2xl shadow-lg hover:bg-black transition-all">Subscribe</button>
               </div>
            </div>
          </div>

          <div className="pt-12 border-t border-[#CAF0F8] flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[#03045E]/40 text-[10px] font-black uppercase tracking-widest">
               © 2026 Ishwa Holidays Travel Solutions Pvt. Ltd. | All Rights Reserved.
            </p>
            <div className="flex gap-10">
               <span className="text-[#03045E]/40 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:text-[#03045E]">Privacy Policy</span>
               <span className="text-[#03045E]/40 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:text-[#03045E]">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

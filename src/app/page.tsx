import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      
      {/* About Section */}
      <section id="about" className="py-32 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full -mr-48 -mt-48 blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-50 rounded-full -ml-48 -mb-48 blur-3xl opacity-50"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-sm font-black text-emerald-600 uppercase tracking-[0.3em] mb-4">Our Essence</h2>
            <h3 className="text-5xl font-black text-emerald-900 tracking-tighter">Crafting Unforgettable <br/>Journeys Since 2026</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="flex gap-6 group">
                <div className="w-16 h-16 shrink-0 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-sm border border-emerald-100">
                   <div className="text-2xl font-bold">01</div>
                </div>
                <div>
                   <h4 className="text-xl font-bold text-emerald-900 mb-2">Tailored Itineraries</h4>
                   <p className="text-emerald-700/70 leading-relaxed font-medium">Every traveler is unique. We craft personalized experiences that match your soul's desire for adventure.</p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="w-16 h-16 shrink-0 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-sm border border-emerald-100">
                   <div className="text-2xl font-bold">02</div>
                </div>
                <div>
                   <h4 className="text-xl font-bold text-emerald-900 mb-2">Sustainable Travel</h4>
                   <p className="text-emerald-700/70 leading-relaxed font-medium">We believe in exploring the world while preserving it. Our partners follow strict eco-friendly guidelines.</p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="w-16 h-16 shrink-0 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-sm border border-emerald-100">
                   <div className="text-2xl font-bold">03</div>
                </div>
                <div>
                   <h4 className="text-xl font-bold text-emerald-900 mb-2">24/7 Global Concierge</h4>
                   <p className="text-emerald-700/70 leading-relaxed font-medium">From the moment you book until you return home, our dedicated support team is always by your side.</p>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="aspect-square bg-emerald-50 rounded-[4rem] relative overflow-hidden group border border-emerald-100 shadow-2xl">
                 <img 
                   src="/about.png" 
                   alt="Adventure View" 
                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/40 via-transparent to-transparent"></div>
                 <div className="absolute bottom-12 left-12 right-12">
                   <p className="text-white font-black text-3xl leading-tight opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">"The world is a book and those who do not travel read only one page."</p>
                   <p className="text-emerald-400 mt-4 font-bold opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 translate-y-4 group-hover:translate-y-0">— Augustine of Hippo</p>
                 </div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-white p-6 rounded-[3rem] shadow-2xl border border-emerald-50 hidden lg:block group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500">
                 <div className="w-full h-full bg-emerald-600 rounded-[2rem] flex items-center justify-center text-white font-black text-3xl">98%</div>
                 <p className="text-[10px] text-center mt-2 font-bold text-emerald-900 uppercase tracking-widest">Happy Travelers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 bg-emerald-950 text-white relative overflow-hidden">
        {/* Dot pattern background */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-1/2 space-y-8">
              <h2 className="text-6xl font-black tracking-tighter">Let's Design Your <span className="text-emerald-500">Dream Holiday.</span></h2>
              <p className="text-emerald-200/70 text-xl font-medium leading-relaxed">The first step to your next adventure begins with a conversation. Reach out to our travel specialists today.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8">
                <div className="space-y-2">
                  <p className="text-emerald-500 font-bold uppercase tracking-widest text-xs">Direct Mail</p>
                  <p className="text-2xl font-bold">hello@ishwa.com</p>
                </div>
                <div className="space-y-2">
                  <p className="text-emerald-500 font-bold uppercase tracking-widest text-xs">Voice Support</p>
                  <p className="text-2xl font-bold">+91 98765 43210</p>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 w-full">
              <form className="bg-white/10 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <input placeholder="Your Name" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium" />
                  <input placeholder="Email Address" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium" />
                </div>
                <input placeholder="Subject" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium" />
                <textarea placeholder="Tell us about your trip..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium h-32 resize-none" />
                <button className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-500/20 active:scale-95">Send Destination Request</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-16 bg-white border-t border-emerald-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
            <Link href="/" className="text-3xl font-black text-emerald-900 tracking-tight">
              Ishwa<span className="text-emerald-500">Holidays</span>
            </Link>
            <div className="flex gap-12 font-bold text-emerald-950/60 uppercase text-[10px] tracking-widest">
              <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
              <Link href="#about" className="hover:text-emerald-600 transition-colors">About</Link>
              <Link href="#contact" className="hover:text-emerald-600 transition-colors">Contact</Link>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-emerald-50 gap-4">
            <p className="text-emerald-600/60 text-xs font-medium">© 2026 Ishwa Holidays Travel Solutions. Built for the elite explorer.</p>
            <div className="flex gap-6 text-emerald-600 text-sm font-bold">
               <a href="#" className="hover:text-emerald-950 transition-colors">Privacy</a>
               <a href="#" className="hover:text-emerald-950 transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

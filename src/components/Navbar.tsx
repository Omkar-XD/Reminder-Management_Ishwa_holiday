"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, Menu, X } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        scrolled 
          ? "bg-[#CAF0F8]/90 backdrop-blur-xl border-[#90E0EF] py-4 shadow-xl" 
          : "bg-transparent border-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className={`text-2xl font-black tracking-tighter transition-colors duration-500 ${scrolled ? "text-[#03045E]" : "text-white"}`}>
              Ishwa{scrolled ? <span className="text-[#0077B6]">Holidays</span> : <span className="text-[#00B4D8]">Holidays</span>}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            {["Home", "About", "Services", "Gallery", "Contact"].map((item) => (
              <Link 
                key={item}
                href={item === "Home" ? "/" : `#${item.toLowerCase()}`} 
                className={`text-[13px] font-black uppercase tracking-[0.15em] transition-all duration-500 hover:scale-110 ${
                  scrolled ? "text-[#03045E]/70 hover:text-[#03045E]" : "text-white/80 hover:text-white"
                }`}
              >
                {item}
              </Link>
            ))}
            <Link
              href="/login"
              className={`flex items-center gap-2 px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all duration-500 hover:scale-105 active:scale-95 shadow-2xl ${
                scrolled 
                  ? "bg-[#03045E] text-white shadow-[#CAF0F8]" 
                  : "bg-white text-[#03045E] shadow-black/20"
              }`}
            >
              <LogIn size={16} />
              Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`transition-colors duration-500 ${scrolled ? "text-[#03045E]" : "text-white"}`}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-[#90E0EF] overflow-hidden shadow-2xl"
          >
            <div className="px-6 pt-4 pb-8 space-y-3">
              <Link href="/" onClick={() => setIsOpen(false)} className="block py-4 text-[#03045E] font-black uppercase tracking-widest text-sm border-b border-[#CAF0F8]">Home</Link>
              <Link href="#about" onClick={() => setIsOpen(false)} className="block py-4 text-[#03045E] font-black uppercase tracking-widest text-sm border-b border-[#CAF0F8]">About</Link>
              <Link href="#services" onClick={() => setIsOpen(false)} className="block py-4 text-[#03045E] font-black uppercase tracking-widest text-sm border-b border-[#CAF0F8]">Services</Link>
              <Link href="#gallery" onClick={() => setIsOpen(false)} className="block py-4 text-[#03045E] font-black uppercase tracking-widest text-sm border-b border-[#CAF0F8]">Gallery</Link>
              <Link href="#contact" onClick={() => setIsOpen(false)} className="block py-4 text-[#03045E] font-black uppercase tracking-widest text-sm border-b border-[#CAF0F8]">Contact</Link>
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full mt-6 flex items-center justify-center gap-2 bg-[#03045E] text-white px-5 py-5 rounded-2xl font-black uppercase tracking-widest text-xs"
              >
                <LogIn size={18} />
                Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

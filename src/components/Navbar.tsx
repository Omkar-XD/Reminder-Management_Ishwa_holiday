"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, Menu, X } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-emerald-600 tracking-tight">
              Ishwa<span className="text-emerald-400">Holidays</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-emerald-800 hover:text-emerald-500 transition-colors font-medium">Home</Link>
            <Link href="#about" className="text-emerald-800 hover:text-emerald-500 transition-colors font-medium">About</Link>
            <Link href="#contact" className="text-emerald-800 hover:text-emerald-500 transition-colors font-medium">Contact</Link>
            <Link
              href="/login"
              className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-emerald-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-200"
            >
              <LogIn size={18} />
              Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-emerald-800 hover:text-emerald-600 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
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
            className="md:hidden bg-white border-b border-emerald-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              <Link href="/" className="block px-3 py-2 text-emerald-800 font-medium hover:bg-emerald-50 rounded-lg">Home</Link>
              <Link href="#about" className="block px-3 py-2 text-emerald-800 font-medium hover:bg-emerald-50 rounded-lg">About</Link>
              <Link href="#contact" className="block px-3 py-2 text-emerald-800 font-medium hover:bg-emerald-50 rounded-lg">Contact</Link>
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-all active:scale-95"
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

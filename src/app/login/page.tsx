"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
    FiMail, FiLock, FiEye, FiEyeOff, FiBell, 
    FiArrowRight, FiShield, FiCheck, FiLoader 
} from "react-icons/fi";

/* --- Field component --- */
interface FieldProps {
    label: string;
    icon: React.ReactNode;
    type?: string;
    placeholder: string;
    value: string;
    onChange: (val: string) => void;
    isPasswordField?: boolean;
    showPassword?: boolean;
    onTogglePassword?: () => void;
}

function Field({ 
    label, 
    icon, 
    type = "text", 
    placeholder, 
    value, 
    onChange, 
    isPasswordField, 
    showPassword, 
    onTogglePassword 
}: FieldProps) {
    return (
        <div className="mb-5 relative">
            <p className="text-[10px] font-black text-emerald-900 uppercase tracking-widest ml-1 mb-2.5">{label}</p>
            <div
                className="flex items-center bg-gray-50 border border-emerald-100/50 rounded-2xl h-14 overflow-hidden shadow-sm transition-all focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 focus-within:bg-white"
            >
                {/* left icon bubble */}
                <div className="flex-shrink-0 w-11 h-11 ml-1.5 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                    {icon}
                </div>

                <input
                    type={isPasswordField && showPassword ? "text" : type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-sm text-emerald-900 font-bold placeholder-emerald-800/20 px-4"
                />

                {isPasswordField && (
                    <button
                        type="button"
                        onClick={onTogglePassword}
                        className="flex-shrink-0 w-11 h-11 mr-1.5 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-400 hover:text-emerald-600 transition-colors"
                    >
                        {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                )}
            </div>
        </div>
    );
}

export default function LoginPage() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (message.text) setMessage({ type: "", text: "" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";

        if (!isLogin && formData.password !== formData.confirmPassword) {
            setMessage({ type: "error", text: "Passwords do not match" });
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    company: "Ishwa Holidays"
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage({ type: "error", text: data.message || "Invalid credentials" });
            } else {
                if (isLogin) {
                    sessionStorage.setItem("livo_session_active", "true");
                    window.location.replace("/dashboard");
                } else {
                    setMessage({ type: "success", text: "Registration successful! Redirecting to login..." });
                    setTimeout(() => {
                        setIsLogin(true);
                        setFormData({ email: formData.email, password: "", confirmPassword: "" });
                        setMessage({ type: "", text: "" });
                    }, 2000);
                }
            }
        } catch (err) {
            setMessage({ type: "error", text: "Failed to connect to server" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex selection:bg-emerald-500 selection:text-white overflow-hidden bg-white">
            
            {/* --- LEFT PANEL --- */}
            <div className="relative w-[48%] bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-950 flex flex-col p-12 overflow-hidden">
                
                {/* Logo Section */}
                <div className="relative z-10 flex items-center gap-5">
                    <div className="relative">
                        <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-150 animate-pulse"></div>
                        <div className="relative w-16 h-16 bg-white rounded-[24px] flex items-center justify-center shadow-2xl overflow-hidden group">
                           <div className="absolute inset-0 bg-emerald-100/50 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                           <FiBell className="text-emerald-700 relative z-10" size={32} />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-white text-3xl font-black tracking-tight leading-none mb-1">Ishwa <span className="text-emerald-400">Holidays</span></h1>
                        <div className="flex items-center gap-2">
                            <div className="h-1 w-6 bg-emerald-400/50 rounded-full"></div>
                            <p className="text-emerald-300/80 font-bold text-[10px] uppercase tracking-[0.2em]">Management System</p>
                        </div>
                    </div>
                </div>

                {/* Tabs for switching Login/Signup */}
                <div className="absolute right-0 top-32 flex flex-col gap-3 z-30">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`group relative flex items-center justify-center py-5 pl-8 pr-4 w-36 rounded-l-[32px] font-black text-sm transition-all duration-500 ${isLogin ? 'bg-[#f0f9f6] text-emerald-900 shadow-[-10px_0_30px_rgba(0,0,0,0.1)]' : 'bg-white/5 text-white/50 hover:bg-white/10 w-32'}`}
                    >
                        Sign In
                        {isLogin && <div className="absolute right-0 top-0 bottom-0 w-1 bg-emerald-600 rounded-l-full"></div>}
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`group relative flex items-center justify-center py-5 pl-8 pr-4 w-36 rounded-l-[32px] font-black text-sm transition-all duration-500 ${!isLogin ? 'bg-[#f0f9f6] text-emerald-900 shadow-[-10px_0_30px_rgba(0,0,0,0.1)]' : 'bg-white/5 text-white/50 hover:bg-white/10 w-32'}`}
                    >
                        Sign Up
                        {!isLogin && <div className="absolute right-0 top-0 bottom-0 w-1 bg-emerald-600 rounded-l-full"></div>}
                    </button>
                </div>

                {/* Content Area */}
                <div className="relative z-10 flex-1 flex flex-col justify-center px-6 mt-10">
                    <AnimatePresence mode="wait">
                        {isLogin ? (
                            <motion.div
                                key="login-content"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="max-w-md"
                            >
                                <span className="inline-block px-4 py-1.5 bg-emerald-400/10 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-400/20">Authorized Portal</span>
                                <h1 className="text-5xl lg:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tighter">Welcome<br/>Back.</h1>
                                <p className="text-emerald-50/70 font-medium text-lg leading-relaxed mb-8">Access your traveler network and manage reminders with precision.</p>
                                <div className="space-y-4">
                                    {[
                                        { icon: <FiCheck />, text: "Real-time communication logs" },
                                        { icon: <FiCheck />, text: "Automated WhatsApp broadcasts" },
                                        { icon: <FiCheck />, text: "Secure traveler database" }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 text-emerald-300/80 font-bold text-sm">
                                            <div className="w-5 h-5 rounded-full bg-emerald-400/20 flex items-center justify-center text-emerald-400">{item.icon}</div>
                                            {item.text}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="signup-content"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="max-w-md"
                            >
                                <span className="inline-block px-4 py-1.5 bg-emerald-400/10 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-400/20">Network Registration</span>
                                <h1 className="text-5xl lg:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tighter">Expand Your<br/>Horizons.</h1>
                                <p className="text-emerald-50/70 font-medium text-lg leading-relaxed mb-8">Join the Ishwa Holidays administrative network and start managing smarter.</p>
                                <div className="p-6 bg-white/5 border border-white/10 rounded-[32px] backdrop-blur-md">
                                    <p className="text-emerald-200/60 text-xs leading-relaxed font-bold italic">"Efficiency is not about doing more, but about managing better. Our platform gives you the tools to excel."</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Decorative Elements */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] aspect-square bg-emerald-400/20 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] aspect-square bg-emerald-600/10 rounded-full blur-[100px]"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border-[1px] border-white/5 rounded-full"></div>
                </div>
            </div>

            {/* --- RIGHT PANEL --- */}
            <div className="relative flex-1 bg-[#f0f9f6] flex items-center justify-center overflow-y-auto py-10">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-[440px] px-6"
                >
                    <div className="bg-white p-10 rounded-[48px] shadow-2xl shadow-emerald-900/10 border border-emerald-50 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>

                        <div className="mb-10 text-center">
                            <h2 className="text-3xl font-black text-emerald-900 tracking-tight mb-2">
                                {isLogin ? "Administrative Portal" : "Account Creation"}
                            </h2>
                            <p className="text-emerald-600/50 text-sm font-bold uppercase tracking-widest">
                                Authorized Access Only
                            </p>
                        </div>

                        {message.text && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                className={`mb-6 p-4 rounded-3xl text-xs font-black uppercase tracking-widest flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}
                            >
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${message.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
                                    {message.type === 'success' ? <FiCheck /> : <FiShield />}
                                </div>
                                {message.text}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Field
                                label="Identity Header (Email)"
                                icon={<FiMail size={18} />}
                                type="email"
                                placeholder="e.g., example@agency.com"
                                value={formData.email}
                                onChange={(val) => handleInputChange("email", val)}
                            />
                            <Field
                                label="Security Key (Password)"
                                icon={<FiLock size={18} />}
                                type="password"
                                isPasswordField
                                showPassword={showPassword}
                                onTogglePassword={() => setShowPassword(!showPassword)}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(val) => handleInputChange("password", val)}
                            />
                            {!isLogin && (
                                <Field
                                    label="Verify Access Code"
                                    icon={<FiShield size={18} />}
                                    type="password"
                                    placeholder="Repeat access code"
                                    value={formData.confirmPassword}
                                    onChange={(val) => handleInputChange("confirmPassword", val)}
                                />
                            )}

                            <div className="flex items-center justify-between py-2">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className="w-5 h-5 rounded-lg border-2 border-emerald-100 flex items-center justify-center transition-all group-hover:border-emerald-500 bg-emerald-50">
                                        <div className="w-2 h-2 rounded-sm bg-emerald-600 scale-0 group-hover:scale-100 transition-transform"></div>
                                    </div>
                                    <span className="text-[11px] font-black text-emerald-900/40 uppercase tracking-widest">Persistent Session</span>
                                </label>
                                <button type="button" className="text-[11px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-900 transition-colors">Credential Help?</button>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full relative py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base rounded-[24px] transition-all shadow-xl shadow-emerald-200 active:scale-95 disabled:opacity-70 disabled:grayscale overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                                <div className="relative flex items-center justify-center gap-3">
                                    {loading ? (
                                        <FiLoader className="animate-spin" size={20} />
                                    ) : (
                                        <>
                                            {isLogin ? "Authorize Session" : "Establish Identity"}
                                            <FiArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </div>
                            </button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-emerald-50 text-center">
                            <p className="text-sm font-bold text-emerald-900/40">
                                {isLogin ? "New administrative associate?" : "Already within the network?"}{" "}
                                <button
                                    type="button"
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="text-emerald-600 font-black hover:underline underline-offset-4"
                                >
                                    {isLogin ? "Register Here" : "Authorize Login"}
                                </button>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

import { useState } from "react";
import axiosInstance from "./axiosInstance";


export default function Contact() {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("Sending...");
        setIsLoading(true);

        try {
            const response = await axiosInstance.post("/api/contact", formData, {
                headers: { "Content-Type": "application/json" }
            });

            if (response.status === 201) {
                setStatus("Message sent successfully!");
                setFormData({ name: "", email: "", message: "" });
            } else {
                setStatus("Failed to send message");
            }
        } catch (error) {
            setStatus("Error occurred");
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatus(""), 4000);
        }
    };

    return (
        <section id="contact" className="relative py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-slate-800 to-slate-900 text-white overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

            <div className="relative max-w-4xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-5xl md:text-6xl font-bold mb-3">
                        Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Touch</span>
                    </h2>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto"></div>
                    <p className="text-gray-400 mt-4 text-lg">Let's discuss your project or opportunity</p>
                </div>

                {/* Contact Info Cards */}
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    {/* Email Card */}
                    <a 
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=aravindhprabu2005@gmail.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group relative flex items-center gap-4 p-5 bg-white/5 backdrop-blur-sm rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer"
                    >
                        {/* Clickable indicator - external link icon */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </div>
                        
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300">
                            <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-400 mb-1">Email</p>
                            <p className="text-sm font-semibold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-pink-300 transition-all duration-300 underline decoration-purple-500/30 group-hover:decoration-purple-500 decoration-2 underline-offset-2">
                                aravindhprabu2005@gmail.com
                            </p>
                        </div>
                    </a>

                    {/* Phone Card */}
                    <a 
                        href="tel:+919865214164"
                        className="group relative flex items-center gap-4 p-5 bg-white/5 backdrop-blur-sm rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer"
                    >
                        {/* Clickable indicator - phone icon pulse */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                        </div>
                        
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300">
                            <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-400 mb-1">Phone</p>
                            <p className="text-sm font-semibold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-pink-300 transition-all duration-300 underline decoration-purple-500/30 group-hover:decoration-purple-500 decoration-2 underline-offset-2">
                                +91 98652 14164
                            </p>
                        </div>
                    </a>
                </div>

                {/* Contact Form - Compact Version */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name and Email in one row on desktop */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="w-full px-3 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                                    Your Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john@example.com"
                                    className="w-full px-3 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                                    required
                                />
                            </div>
                        </div>

                        {/* Message Textarea - Reduced height */}
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1.5">
                                Your Message
                            </label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Tell me about your project..."
                                rows="3"
                                className="w-full px-3 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 resize-none"
                                required
                            ></textarea>
                        </div>

                        {/* Submit Button - Compact */}
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 flex items-center justify-center gap-2 text-sm"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                    Send Message
                                </>
                            )}
                        </button>

                        {/* Status Message - Compact */}
                        {status && (
                            <div className={`flex items-center gap-2 p-3 rounded-lg ${
                                status.includes("success")
                                    ? "bg-green-500/10 border border-green-500/30 text-green-400"
                                    : status.includes("Error") || status.includes("Failed")
                                    ? "bg-red-500/10 border border-red-500/30 text-red-400"
                                    : "bg-blue-500/10 border border-blue-500/30 text-blue-400"
                            }`}>
                                {status.includes("success") && (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                                <p className="text-xs font-medium">{status}</p>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
}

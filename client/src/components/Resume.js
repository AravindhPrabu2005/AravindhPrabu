import { useState } from "react"
import ResumeImg from '../assets/resume.jpg'
import axios from "axios"
import axiosInstance from "./axiosInstance"
import { XMarkIcon, DocumentArrowDownIcon, CheckCircleIcon } from '@heroicons/react/24/solid'


export default function Resume() {
    const [showModal, setShowModal] = useState(false)
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)


    const isValidEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)


    const handleSubmit = async () => {
        if (!isValidEmail(email)) {
            setMessage("Please enter a valid email.")
            return
        }


        setLoading(true)
        setMessage("Requesting...")
        try {
            const res = await axiosInstance.post("/api/send-download-link", { email })
            setMessage(res.data.message)
            setTimeout(() => {
                setShowModal(false)
                setMessage("")
                setEmail("")
                setLoading(false)
            }, 4000)
        } catch (err) {
            setMessage("Something went wrong. Please try again.")
            setLoading(false)
        }
    }


    return (
        <section id="resume" className="relative py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-slate-800 to-slate-900 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

            <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
                {/* Image Section */}
                <div className="flex-1 flex justify-center">
                    <div className="relative group">
                        {/* Animated border */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition duration-500"></div>
                        
                        {/* Image container */}
                        <div className="relative bg-slate-800 rounded-2xl p-2 overflow-hidden">
                            <img 
                                src={ResumeImg} 
                                alt="Resume preview"
                                className="rounded-xl w-[300px] h-auto object-cover transform group-hover:scale-105 transition duration-500 shadow-2xl"
                            />
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="flex-1 space-y-6">
                    <div>
                        <h2 className="text-5xl md:text-6xl font-bold text-white mb-3">
                            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Resume</span>
                        </h2>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                    </div>

                    <p className="text-gray-300 text-lg leading-relaxed">
                        Interested in working together? Download my resume to learn more about my experience, skills, and projects.
                    </p>

                    <button
                        onClick={() => setShowModal(true)}
                        className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full overflow-hidden shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                        <span className="relative flex items-center gap-3">
                            <DocumentArrowDownIcon className="w-6 h-6" />
                            Download Resume
                            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                        </span>
                    </button>
                </div>
            </div>


            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl w-full max-w-md border border-purple-500/30 shadow-2xl shadow-purple-500/20 animate-fade-in">
                        {/* Close button */}
                        <button
                            onClick={() => {
                                setShowModal(false)
                                setMessage("")
                                setEmail("")
                                setLoading(false)
                            }}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200 p-2 hover:bg-white/10 rounded-lg"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>

                        {/* Modal content */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                                    <DocumentArrowDownIcon className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Get My Resume</h2>
                                    <p className="text-gray-400 text-sm">Enter your email to receive it</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || !isValidEmail(email)}
                                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <DocumentArrowDownIcon className="w-5 h-5" />
                                            Send Resume
                                        </>
                                    )}
                                </button>

                                {message && (
                                    <div className={`flex items-center gap-2 p-4 rounded-xl ${
                                        message.includes("valid") || message.includes("wrong")
                                            ? "bg-red-500/10 border border-red-500/30 text-red-400"
                                            : "bg-green-500/10 border border-green-500/30 text-green-400"
                                    }`}>
                                        {!message.includes("valid") && !message.includes("wrong") && (
                                            <CheckCircleIcon className="w-5 h-5" />
                                        )}
                                        <p className="text-sm font-medium">{message}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

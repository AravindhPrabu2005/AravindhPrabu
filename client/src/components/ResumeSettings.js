import { useState, useEffect } from "react";
import axiosInstance from "./axiosInstance";
import { FaCloudUploadAlt, FaSave, FaEye } from "react-icons/fa";

export default function ResumeSettings() {
    const [resumeUrl, setResumeUrl] = useState("");
    const [coverLetter, setCoverLetter] = useState("");
    const [uploading, setUploading] = useState(false);
    const [savingText, setSavingText] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [refreshKey, setRefreshKey] = useState(0); // to force iframe refresh on upload

    const fetchSettings = async () => {
        try {
            const res = await axiosInstance.get("/api/settings");
            if (res.data) {
                setResumeUrl(res.data.resumeUrl || "");
                setCoverLetter(res.data.coverLetterText || "");
            }
        } catch (err) {
            console.error("Error fetching settings:", err);
            setError("Failed to load settings from server.");
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const getPreviewUrl = () => {
        const token = localStorage.getItem("admin_token") || "";
        const base = axiosInstance.defaults.baseURL || "http://localhost:5000";
        const normalizedBase = base.endsWith("/") ? base : `${base}/`;
        return `${normalizedBase}api/settings/resume/view?token=${encodeURIComponent(token)}&key=${refreshKey}`;
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            setError("Please select a valid PDF file.");
            return;
        }

        setError("");
        setMessage("");
        setUploading(true);

        const formData = new FormData();
        formData.append("resume", file);

        try {
            const res = await axiosInstance.post("/api/settings/resume", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            if (res.data && res.data.resumeUrl) {
                setResumeUrl(res.data.resumeUrl);
                setRefreshKey(prev => prev + 1); // trigger iframe refresh
                setMessage("Resume PDF uploaded and saved successfully!");
            }
        } catch (err) {
            console.error("Upload error:", err);
            setError(err.response?.data?.error || "Failed to save the PDF file on the server.");
        } finally {
            setUploading(false);
            setTimeout(() => setMessage(""), 4000);
        }
    };

    const handleSaveCoverLetter = async () => {
        setError("");
        setMessage("");
        setSavingText(true);

        try {
            await axiosInstance.put("/api/settings/cover-letter", {
                coverLetterText: coverLetter
            });
            setMessage("Cover letter updated successfully!");
        } catch (err) {
            console.error("Save error:", err);
            setError("Failed to update cover letter.");
        } finally {
            setSavingText(false);
            setTimeout(() => setMessage(""), 4000);
        }
    };

    const activePreviewUrl = getPreviewUrl();

    return (
        <div className="w-full space-y-6">
            {/* Page Title */}
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400">
                    <FaCloudUploadAlt size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white">Configure Resume & Cover Letter</h2>
                    <p className="text-xs text-gray-400">Upload your latest resume PDF and update the email copy sent to recruiters</p>
                </div>
            </div>

            {/* Notification Banner */}
            {message && (
                <div className="p-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-2xl text-sm font-medium transition-all">
                    {message}
                </div>
            )}
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl text-sm font-medium transition-all">
                    {error}
                </div>
            )}

            {/* Main Panel Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Configuration Panel */}
                <div className="lg:col-span-6 space-y-6">
                    {/* Resume Upload Box */}
                    <div className="bg-white/5 backdrop-blur-sm border border-purple-500/10 rounded-2xl p-6 space-y-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Resume PDF</h3>
                        <p className="text-xs text-gray-400">Upload your updated resume PDF. It will be stored inside the server's public assets folder.</p>
                        
                        <div className="relative group flex flex-col items-center justify-center border-2 border-dashed border-purple-500/20 hover:border-purple-500/40 rounded-2xl p-8 bg-slate-900/20 transition-all duration-300">
                            <input 
                                type="file" 
                                accept=".pdf" 
                                onChange={handleFileUpload} 
                                disabled={uploading}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10" 
                            />
                            {uploading ? (
                                <div className="flex flex-col items-center gap-3">
                                    <svg className="animate-spin h-8 w-8 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span className="text-sm font-medium text-gray-300">Saving PDF locally...</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-3 text-center">
                                    <FaCloudUploadAlt className="text-purple-400 group-hover:scale-110 transition-transform duration-300" size={40} />
                                    <div>
                                        <span className="text-sm font-bold text-purple-400 group-hover:text-purple-300 transition-colors">Choose updated PDF</span>
                                        <p className="text-[10px] text-gray-500 mt-1">Accepts PDF format only</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {resumeUrl && (
                            <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/5 text-xs text-gray-400">
                                <span className="font-semibold text-gray-300">Static Path:</span>
                                <span className="text-purple-400 truncate flex-1 font-mono">
                                    {resumeUrl}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Cover Letter Section */}
                    <div className="bg-white/5 backdrop-blur-sm border border-purple-500/10 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Cover Letter Copy</h3>
                            <button
                                onClick={handleSaveCoverLetter}
                                disabled={savingText}
                                className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-xs font-semibold hover:shadow-md hover:shadow-purple-500/25 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                            >
                                <FaSave />
                                <span>{savingText ? "Saving..." : "Save Copy"}</span>
                            </button>
                        </div>
                        <p className="text-xs text-gray-400">This email text will serve as the cover letter context when attaching your resume PDF to recruiters.</p>
                        
                        <textarea
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                            rows={12}
                            placeholder="Write cover letter text..."
                            className="w-full p-4 bg-slate-900/50 border border-purple-500/20 rounded-2xl text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/10 transition-all font-mono leading-relaxed resize-none"
                        ></textarea>
                    </div>
                </div>

                {/* PDF Viewer Panel */}
                <div className="lg:col-span-6 bg-white/5 backdrop-blur-sm border border-purple-500/10 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FaEye className="text-purple-400 text-sm" />
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">PDF Resume Preview</h3>
                        </div>
                        {activePreviewUrl && (
                            <a 
                                href={activePreviewUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1.5"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                <span>Open in New Tab</span>
                            </a>
                        )}
                    </div>
                    
                    {activePreviewUrl ? (
                        <div className="w-full rounded-xl overflow-hidden border border-purple-500/20 bg-slate-900">
                            <iframe 
                                src={activePreviewUrl} 
                                title="Resume PDF Preview" 
                                className="w-full h-[580px] bg-slate-950"
                            />
                        </div>
                    ) : (
                        <div className="w-full h-[580px] rounded-xl border border-dashed border-purple-500/20 bg-slate-900/10 flex flex-col items-center justify-center p-8 text-center text-gray-500 gap-3">
                            <FaEye size={32} className="text-gray-600" />
                            <div>
                                <h4 className="font-bold text-sm text-gray-400">No Custom Resume PDF Preview</h4>
                                <p className="text-xs mt-1 max-w-xs text-gray-500">The preview will show here once configured.</p>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

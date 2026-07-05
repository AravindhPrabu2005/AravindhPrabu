import { useState, useEffect } from "react";
import axiosInstance from "./axiosInstance";
import { FaPlus, FaTrash, FaEdit, FaTimes, FaAward } from "react-icons/fa";

export default function AdminCertifications() {
    const [certifications, setCertifications] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    // Form fields
    const [title, setTitle] = useState("");
    const [provider, setProvider] = useState("");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const fetchCertifications = async () => {
        try {
            const res = await axiosInstance.get("/api/certifications");
            setCertifications(res.data || []);
        } catch (err) {
            console.error("Error loading certifications:", err);
            setError("Failed to load certifications.");
        }
    };

    useEffect(() => {
        fetchCertifications();
    }, []);

    const openCreateModal = () => {
        setEditMode(false);
        setCurrentId(null);
        setTitle("");
        setProvider("");
        setDescription("");
        setImageFile(null);
        setImagePreview("");
        setError("");
        setModalOpen(true);
    };

    const openEditModal = (cert) => {
        setEditMode(true);
        setCurrentId(cert._id);
        setTitle(cert.title || "");
        setProvider(cert.provider || "");
        setDescription(cert.description || "");
        setImageFile(null);
        setImagePreview(cert.image || "");
        setError("");
        setModalOpen(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        if (!title || !provider) {
            setError("Title and provider fields are required.");
            return;
        }

        if (!editMode && !imageFile) {
            setError("Certification image is required.");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("provider", provider);
        formData.append("description", description);
        
        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            if (editMode) {
                await axiosInstance.put(`/api/certifications/${currentId}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                setSuccessMessage("Certification updated successfully!");
            } else {
                await axiosInstance.post("/api/certifications", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                setSuccessMessage("Certification created successfully!");
            }
            setModalOpen(false);
            fetchCertifications();
        } catch (err) {
            console.error("Submission error:", err);
            setError(err.response?.data?.error || "Failed to save certification.");
        } finally {
            setLoading(false);
            setTimeout(() => setSuccessMessage(""), 4000);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this certification?")) return;
        setError("");

        try {
            await axiosInstance.delete(`/api/certifications/${id}`);
            setSuccessMessage("Certification deleted successfully!");
            fetchCertifications();
        } catch (err) {
            console.error("Delete error:", err);
            setError("Failed to delete certification.");
        } finally {
            setTimeout(() => setSuccessMessage(""), 4000);
        }
    };

    return (
        <div className="w-full space-y-6">
            {/* Header section */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Manage Certifications</h2>
                    <p className="text-xs text-slate-500">Configure your credentials, online courses, and certificates</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs shadow-indigo-500/10 hover:shadow-md hover:shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
                >
                    <FaPlus />
                    <span>Add Certification</span>
                </button>
            </div>

            {/* Notification Banner */}
            {successMessage && (
                <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl text-sm font-medium transition-all shadow-xs animate-slideDown">
                    {successMessage}
                </div>
            )}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm font-medium transition-all shadow-xs animate-slideDown">
                    {error}
                </div>
            )}

            {/* Certifications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certifications.map((cert) => (
                    <div 
                        key={cert._id}
                        className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:border-slate-355 shadow-xs transition-all flex flex-col group"
                    >
                        <div className="relative h-44 overflow-hidden bg-slate-50/50 flex justify-center items-center p-4">
                            <img 
                                src={cert.image} 
                                alt={cert.title} 
                                className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                            <div className="space-y-2">
                                <h3 className="text-base font-bold text-slate-800 leading-tight">{cert.title}</h3>
                                
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-50 border border-slate-200 text-slate-650 rounded-md text-[10px] font-semibold">
                                    <FaAward className="text-slate-500" /> {cert.provider}
                                </div>
                                
                                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed pt-1">{cert.description}</p>
                            </div>

                            <div className="flex items-center justify-end border-t border-slate-100 pt-4">
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => openEditModal(cert)}
                                        className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700 rounded-lg border border-indigo-100 transition-all cursor-pointer"
                                        aria-label="Edit certification"
                                    >
                                        <FaEdit size={12} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(cert._id)}
                                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-lg border border-red-100 transition-all cursor-pointer"
                                        aria-label="Delete certification"
                                    >
                                        <FaTrash size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {certifications.length === 0 && (
                    <div className="col-span-full py-16 text-center text-slate-500 border border-dashed border-slate-200 rounded-2xl bg-white shadow-xs">
                        No certifications found. Click "Add Certification" to create one.
                    </div>
                )}
            </div>

            {/* Modal Dialog */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
                    <div className="bg-white border border-slate-200/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <h3 className="text-base font-bold text-slate-900">
                                {editMode ? "Edit Certification Info" : "Create Certification Card"}
                            </h3>
                            <button 
                                onClick={() => setModalOpen(false)}
                                className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Certification Title</label>
                                <input 
                                    type="text" 
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Full-Stack Web Development Bootcamp"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all shadow-inner"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Provider / Issuer</label>
                                <input 
                                    type="text" 
                                    required
                                    value={provider}
                                    onChange={(e) => setProvider(e.target.value)}
                                    placeholder="Udemy, Coursera, Great Learning"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all shadow-inner"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Short Description</label>
                                <textarea 
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="A comprehensive course covering React, Node.js..."
                                    rows={3}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all resize-none shadow-inner"
                                />
                            </div>

                            {/* Image selector */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Certificate Image / PNG</label>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 file:transition-colors file:cursor-pointer"
                                />

                                {imagePreview && (
                                    <div className="mt-3 relative h-36 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-2 flex justify-center items-center shadow-inner">
                                        <img src={imagePreview} alt="Preview" className="max-h-full max-w-full object-contain" />
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 mt-6">
                                <button 
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-655 hover:text-slate-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs shadow-xs shadow-indigo-500/10 hover:shadow-md hover:shadow-indigo-500/20 transition-all disabled:opacity-50 cursor-pointer"
                                >
                                    {loading ? "Saving Card..." : "Save Certification"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

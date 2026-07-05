import { useState, useEffect } from "react";
import axiosInstance from "./axiosInstance";
import { FaPlus, FaTrash, FaEdit, FaTimes, FaCalendarAlt, FaMapMarkerAlt, FaBriefcase } from "react-icons/fa";

export default function AdminExperience() {
    const [experiences, setExperiences] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    // Form fields
    const [role, setRole] = useState("");
    const [duration, setDuration] = useState("");
    const [location, setLocation] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    
    // Points list management
    const [points, setPoints] = useState([]);
    const [newPoint, setNewPoint] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const fetchExperiences = async () => {
        try {
            const res = await axiosInstance.get("/api/experiences");
            setExperiences(res.data || []);
        } catch (err) {
            console.error("Error loading experiences:", err);
            setError("Failed to load experience cards from server.");
        }
    };

    useEffect(() => {
        fetchExperiences();
    }, []);

    const openCreateModal = () => {
        setEditMode(false);
        setCurrentId(null);
        setRole("");
        setDuration("");
        setLocation("");
        setPoints([]);
        setNewPoint("");
        setImageFile(null);
        setImagePreview("");
        setError("");
        setModalOpen(true);
    };

    const openEditModal = (exp) => {
        setEditMode(true);
        setCurrentId(exp._id);
        setRole(exp.role || "");
        setDuration(exp.duration || "");
        setLocation(exp.location || "");
        setPoints(exp.points || []);
        setNewPoint("");
        setImageFile(null);
        setImagePreview(exp.logo || "");
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

    const addPoint = () => {
        if (newPoint.trim()) {
            setPoints([...points, newPoint.trim()]);
            setNewPoint("");
        }
    };

    const removePoint = (index) => {
        setPoints(points.filter((_, idx) => idx !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        if (!role || !duration || !location) {
            setError("Role, duration, and location fields are required.");
            return;
        }

        if (points.length === 0) {
            setError("Please add at least one achievement or job point description.");
            return;
        }

        if (!editMode && !imageFile) {
            setError("Company logo picture is required.");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("role", role);
        formData.append("duration", duration);
        formData.append("location", location);
        formData.append("points", JSON.stringify(points));
        
        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            if (editMode) {
                await axiosInstance.put(`/api/experiences/${currentId}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                setSuccessMessage("Experience card updated successfully!");
            } else {
                await axiosInstance.post("/api/experiences", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                setSuccessMessage("Experience card created successfully!");
            }
            setModalOpen(false);
            fetchExperiences();
        } catch (err) {
            console.error("Submission error:", err);
            setError(err.response?.data?.error || "Failed to save experience.");
        } finally {
            setLoading(false);
            setTimeout(() => setSuccessMessage(""), 4000);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this experience card?")) return;
        setError("");

        try {
            await axiosInstance.delete(`/api/experiences/${id}`);
            setSuccessMessage("Experience card deleted successfully!");
            fetchExperiences();
        } catch (err) {
            console.error("Delete error:", err);
            setError("Failed to delete experience.");
        } finally {
            setTimeout(() => setSuccessMessage(""), 4000);
        }
    };

    return (
        <div className="w-full space-y-6">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-600">
                        <FaBriefcase className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Manage Experience</h2>
                        <p className="text-xs text-slate-500">Configure your professional timeline, internships, and freelancing entries</p>
                    </div>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs shadow-indigo-500/10 hover:shadow-md hover:shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
                >
                    <FaPlus />
                    <span>Add Experience</span>
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

            {/* Experiences Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {experiences.map((exp) => (
                    <div 
                        key={exp._id}
                        className="bg-white border border-slate-200/80 rounded-2xl p-6 hover:border-slate-355 shadow-xs transition-all flex flex-col justify-between space-y-6 group relative"
                    >
                        <div className="space-y-4">
                            {/* Company logo & Role info */}
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 bg-slate-50 rounded-xl p-2.5 flex items-center justify-center border border-slate-200 flex-shrink-0 shadow-xs">
                                    <img src={exp.logo} alt="Company logo" className="max-h-full max-w-full object-contain" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors">
                                        {exp.role}
                                    </h3>
                                    <div className="flex flex-col text-xs text-slate-500 mt-1.5 space-y-1">
                                        <span className="flex items-center gap-1.5">
                                            <FaCalendarAlt size={10} className="text-slate-400" /> {exp.duration}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <FaMapMarkerAlt size={10} className="text-slate-400" /> {exp.location}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Divider line */}
                            <div className="w-full h-px bg-slate-100"></div>

                            {/* Points list preview */}
                            <ul className="space-y-2.5 pl-1">
                                {exp.points && exp.points.map((point, idx) => (
                                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5"></span>
                                        <span className="flex-1">{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Card footer controls */}
                        <div className="flex items-center justify-end border-t border-slate-100 pt-4">
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => openEditModal(exp)}
                                    className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700 rounded-lg border border-indigo-100 transition-all cursor-pointer"
                                    aria-label="Edit experience"
                                >
                                    <FaEdit size={12} />
                                </button>
                                <button 
                                    onClick={() => handleDelete(exp._id)}
                                    className="p-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-lg border border-red-100 transition-all cursor-pointer"
                                    aria-label="Delete experience"
                                >
                                    <FaTrash size={12} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {experiences.length === 0 && (
                    <div className="col-span-full py-16 text-center text-slate-500 border border-dashed border-slate-200 rounded-2xl bg-white shadow-xs">
                        No experience cards found. Click "Add Experience" to create one.
                    </div>
                )}
            </div>

            {/* Modal Dialog */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
                    <div className="bg-white border border-slate-200/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <h3 className="text-base font-bold text-slate-900">
                                {editMode ? "Edit Experience Card" : "Add Experience Timeline Entry"}
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
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Role / Company Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    placeholder="INTERNSHIP | RBG.ai"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all shadow-inner"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Duration Period</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        placeholder="Dec 2024 – Jan 2025"
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all shadow-inner"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Location</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="Coimbatore, India"
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all shadow-inner"
                                    />
                                </div>
                            </div>

                            {/* Experience Job Points list builder */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                                    Job Points / Accomplishments
                                </label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={newPoint}
                                        onChange={(e) => setNewPoint(e.target.value)}
                                        placeholder="Add achievement point..."
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addPoint();
                                            }
                                        }}
                                        className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all shadow-inner"
                                    />
                                    <button 
                                        type="button"
                                        onClick={addPoint}
                                        className="px-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-600 rounded-xl flex items-center justify-center cursor-pointer hover:text-indigo-700 transition-all"
                                    >
                                        <FaPlus />
                                    </button>
                                </div>

                                <ul className="mt-3 space-y-2 max-h-36 overflow-y-auto">
                                    {points.map((point, index) => (
                                        <li key={index} className="flex items-start justify-between bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs text-slate-700 shadow-xs">
                                            <span className="flex-1 pr-2 leading-relaxed">{point}</span>
                                            <button 
                                                type="button" 
                                                onClick={() => removePoint(index)}
                                                className="text-red-500 hover:text-red-700 p-0.5 cursor-pointer"
                                                aria-label="Remove point"
                                            >
                                                <FaTimes />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Logo Image selector */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Company Logo image</label>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 file:transition-colors file:cursor-pointer"
                                />

                                {imagePreview && (
                                    <div className="mt-3 relative h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-2 flex justify-center items-center shadow-inner">
                                        <img src={imagePreview} alt="Preview" className="max-h-full max-w-full object-contain" />
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 mt-6">
                                <button 
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-650 hover:text-slate-805 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs shadow-xs shadow-indigo-500/10 hover:shadow-md hover:shadow-indigo-500/20 transition-all disabled:opacity-50 cursor-pointer"
                                >
                                    {loading ? "Saving Card..." : "Save Experience"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

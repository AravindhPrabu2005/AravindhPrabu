import { useState, useEffect } from "react";
import axiosInstance from "./axiosInstance";
import { FaPlus, FaTrash, FaEdit, FaTimes, FaTrophy, FaAward, FaSort } from "react-icons/fa";

export default function AdminAchievements() {
    const [achievements, setAchievements] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    // Form fields
    const [title, setTitle] = useState("");
    const [position, setPosition] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState(1); // 1 = Hackathon, 2 = Other Achievement
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Reordering states
    const [reorderModalOpen, setReorderModalOpen] = useState(false);
    const [tempAchievements, setTempAchievements] = useState([]);
    const [draggedIndex, setDraggedIndex] = useState(null);

    const openReorderModal = () => {
        setTempAchievements([...achievements].sort((a, b) => (a.order || 0) - (b.order || 0)));
        setReorderModalOpen(true);
    };

    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", index);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;
        
        const items = [...tempAchievements];
        const draggedItem = items[draggedIndex];
        
        items.splice(draggedIndex, 1);
        items.splice(index, 0, draggedItem);
        
        setDraggedIndex(index);
        setTempAchievements(items);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDraggedIndex(null);
    };

    const handleSaveOrder = async () => {
        setLoading(true);
        setError("");
        
        const achievementsOrder = tempAchievements.map((ach, idx) => ({
            id: ach._id,
            order: idx
        }));

        try {
            await axiosInstance.put("/api/achievements/reorder", {
                achievementsOrder
            });
            setReorderModalOpen(false);
            setSuccessMessage("Achievements order updated successfully!");
            fetchAchievements();
        } catch (err) {
            console.error("Error saving achievements order:", err);
            setError("Failed to save achievements order.");
        } finally {
            setLoading(false);
            setTimeout(() => setSuccessMessage(""), 4000);
        }
    };

    const fetchAchievements = async () => {
        try {
            const res = await axiosInstance.get("/api/achievements");
            setAchievements(res.data || []);
        } catch (err) {
            console.error("Error loading achievements:", err);
            setError("Failed to load achievements.");
        }
    };

    useEffect(() => {
        fetchAchievements();
    }, []);

    const openCreateModal = () => {
        setEditMode(false);
        setCurrentId(null);
        setTitle("");
        setPosition("");
        setDescription("");
        setType(1);
        setImageFile(null);
        setImagePreview("");
        setError("");
        setModalOpen(true);
    };

    const openEditModal = (ach) => {
        setEditMode(true);
        setCurrentId(ach._id);
        setTitle(ach.title || "");
        setPosition(ach.position || "");
        setDescription(ach.description || "");
        setType(ach.type || 1);
        setImageFile(null);
        setImagePreview(ach.certificate || "");
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

        if (!title || !position || !description) {
            setError("Title, position, and description fields are required.");
            return;
        }

        if (!editMode && !imageFile) {
            setError("Certificate image is required.");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("position", position);
        formData.append("description", description);
        formData.append("type", type);
        
        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            if (editMode) {
                await axiosInstance.put(`/api/achievements/${currentId}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                setSuccessMessage("Achievement updated successfully!");
            } else {
                await axiosInstance.post("/api/achievements", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                setSuccessMessage("Achievement created successfully!");
            }
            setModalOpen(false);
            fetchAchievements();
        } catch (err) {
            console.error("Submission error:", err);
            setError(err.response?.data?.error || "Failed to save achievement.");
        } finally {
            setLoading(false);
            setTimeout(() => setSuccessMessage(""), 4000);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this achievement/hackathon?")) return;
        setError("");

        try {
            await axiosInstance.delete(`/api/achievements/${id}`);
            setSuccessMessage("Achievement deleted successfully!");
            fetchAchievements();
        } catch (err) {
            console.error("Delete error:", err);
            setError("Failed to delete achievement.");
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
                        <FaAward className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Manage Hackathons & Achievements</h2>
                        <p className="text-xs text-slate-500">Configure your competition awards, paper publications, and accomplishments</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={openReorderModal}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 shadow-xs active:scale-95 transition-all cursor-pointer"
                    >
                        <FaSort />
                        <span>Reorder Achievements</span>
                    </button>
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs shadow-indigo-500/10 hover:shadow-md hover:shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
                    >
                        <FaPlus />
                        <span>Add Achievement</span>
                    </button>
                </div>
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

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((ach) => (
                    <div 
                        key={ach._id}
                        className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:border-slate-355 shadow-xs transition-all flex flex-col group"
                    >
                        <div className="relative h-44 overflow-hidden bg-slate-50/50 flex justify-center items-center p-4">
                            <img 
                                src={ach.certificate} 
                                alt={ach.title} 
                                className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-300"
                            />
                            <span className={`absolute top-3 left-3 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs border ${ach.type === 1 ? 'bg-purple-50 text-purple-700 border-purple-200/60' : 'bg-pink-50 text-pink-700 border-pink-200/60'}`}>
                                {ach.type === 1 ? "Hackathon" : "Competition"}
                            </span>
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                            <div className="space-y-2">
                                <h3 className="text-base font-bold text-slate-800 leading-tight">{ach.title}</h3>
                                
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-50 border border-slate-200 text-slate-650 rounded-md text-[10px] font-semibold">
                                    <FaTrophy className="text-slate-500" /> {ach.position}
                                </div>
                                
                                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed pt-1">{ach.description}</p>
                            </div>

                            <div className="flex items-center justify-end border-t border-slate-100 pt-4">
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => openEditModal(ach)}
                                        className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700 rounded-lg border border-indigo-100 transition-all cursor-pointer"
                                        aria-label="Edit achievement"
                                    >
                                        <FaEdit size={12} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(ach._id)}
                                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-lg border border-red-100 transition-all cursor-pointer"
                                        aria-label="Delete achievement"
                                    >
                                        <FaTrash size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {achievements.length === 0 && (
                    <div className="col-span-full py-16 text-center text-slate-500 border border-dashed border-slate-200 rounded-2xl bg-white shadow-xs">
                        No achievements found. Click "Add Achievement" to create one.
                    </div>
                )}
            </div>

            {/* Modal Dialog */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
                    <div className="bg-white border border-slate-200/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <h3 className="text-base font-bold text-slate-900">
                                {editMode ? "Edit Achievement Info" : "Create Achievement Card"}
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
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Achievement / Event Title</label>
                                <input 
                                    type="text" 
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="TechXcelerate 2025"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all shadow-inner"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Award Position / Result</label>
                                <input 
                                    type="text" 
                                    required
                                    value={position}
                                    onChange={(e) => setPosition(e.target.value)}
                                    placeholder="1st Place, Finalist, Top Performer"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all shadow-inner"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Category Type</label>
                                <select 
                                    value={type}
                                    onChange={(e) => setType(Number(e.target.value))}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all shadow-inner"
                                >
                                    <option value={1}>Hackathon</option>
                                    <option value={2}>Competition</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Detailed Description</label>
                                <textarea 
                                    required
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Developed a blockchain voting platform using React..."
                                    rows={4}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all resize-none shadow-inner"
                                />
                            </div>

                            {/* Image selector */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Certificate Image / Photo</label>
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
                                    className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-650 hover:text-slate-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs shadow-xs shadow-indigo-500/10 hover:shadow-md hover:shadow-indigo-500/20 transition-all disabled:opacity-50 cursor-pointer"
                                >
                                    {loading ? "Saving Card..." : "Save Achievement"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Reorder Modal Dialog */}
            {reorderModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
                    <div className="bg-white border border-slate-200/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Reorder Achievements</h3>
                                <p className="text-xs text-slate-500">Drag and drop items to rearrange their rank order</p>
                            </div>
                            <button 
                                onClick={() => setReorderModalOpen(false)}
                                className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* Drag and Drop List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-2 bg-slate-50/30">
                            {tempAchievements.map((ach, idx) => (
                                <div
                                    key={ach._id}
                                    draggable={true}
                                    onDragStart={(e) => handleDragStart(e, idx)}
                                    onDragOver={(e) => handleDragOver(e, idx)}
                                    onDragEnd={handleDragEnd}
                                    onDrop={handleDrop}
                                    className={`flex items-center gap-4 p-3 bg-white border border-slate-200 rounded-xl shadow-xs transition-all cursor-grab active:cursor-grabbing select-none ${
                                        draggedIndex === idx 
                                            ? "opacity-40 bg-indigo-50/30 border-dashed border-indigo-300 shadow-none scale-98"
                                            : "hover:border-slate-350 hover:shadow-sm"
                                    }`}
                                >
                                    <div className="text-slate-400 hover:text-slate-700 p-1 flex items-center justify-center">
                                        <FaSort className="w-4 h-4" />
                                    </div>
                                    
                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center">
                                        <img src={ach.certificate} alt={ach.title} className="w-full h-full object-contain" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-slate-800 truncate">{ach.title}</h4>
                                        <p className="text-[10px] text-slate-450 truncate">{ach.position}</p>
                                    </div>

                                    <div className="flex-shrink-0 px-2.5 py-1 bg-indigo-50 border border-indigo-100 rounded-md text-[10px] font-bold text-indigo-600">
                                        #{idx + 1}
                                    </div>
                                </div>
                            ))}

                            {tempAchievements.length === 0 && (
                                <div className="text-center py-12 text-slate-500 text-xs border border-dashed border-slate-200 rounded-xl bg-white">
                                    No achievements to reorder.
                                </div>
                            )}
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/35">
                            <button
                                type="button"
                                onClick={() => setReorderModalOpen(false)}
                                className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-650 hover:text-slate-800 border border-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveOrder}
                                disabled={loading}
                                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs shadow-sm shadow-indigo-500/10 hover:shadow-md hover:shadow-indigo-500/20 transition-all disabled:opacity-50 cursor-pointer"
                            >
                                {loading ? "Saving Order..." : "Save Order"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

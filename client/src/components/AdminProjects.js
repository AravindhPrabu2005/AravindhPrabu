import { useState, useEffect } from "react";
import axiosInstance from "./axiosInstance";
import { FaPlus, FaTrash, FaEdit, FaTimes, FaGithub, FaCheck } from "react-icons/fa";

export default function AdminProjects() {
    const [projects, setProjects] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    // Form fields
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [github, setGithub] = useState("");
    const [stackInput, setStackInput] = useState("");
    const [featured, setFeatured] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const fetchProjects = async () => {
        try {
            const res = await axiosInstance.get("/api/projects");
            setProjects(res.data || []);
        } catch (err) {
            console.error("Error loading projects:", err);
            setError("Failed to load projects from server.");
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const openCreateModal = () => {
        setEditMode(false);
        setCurrentId(null);
        setTitle("");
        setDescription("");
        setGithub("");
        setStackInput("");
        setFeatured(false);
        setImageFile(null);
        setImagePreview("");
        setError("");
        setModalOpen(true);
    };

    const openEditModal = (project) => {
        setEditMode(true);
        setCurrentId(project._id);
        setTitle(project.title || "");
        setDescription(project.description || "");
        setGithub(project.github || "");
        setStackInput(project.stack ? project.stack.join(", ") : "");
        setFeatured(project.featured || false);
        setImageFile(null);
        setImagePreview(project.image || "");
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

        if (!title || !description || !github) {
            setError("Title, description, and GitHub fields are required.");
            return;
        }

        if (!editMode && !imageFile) {
            setError("Project thumbnail image is required.");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("github", github);
        
        // Parse stack tags
        const stackArr = stackInput
            .split(",")
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);
        formData.append("stack", JSON.stringify(stackArr));
        formData.append("featured", featured);
        
        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            if (editMode) {
                await axiosInstance.put(`/api/projects/${currentId}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                setSuccessMessage("Project updated successfully!");
            } else {
                await axiosInstance.post("/api/projects", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                setSuccessMessage("Project created successfully!");
            }
            setModalOpen(false);
            fetchProjects();
        } catch (err) {
            console.error("Submission error:", err);
            setError(err.response?.data?.error || "Failed to save project.");
        } finally {
            setLoading(false);
            setTimeout(() => setSuccessMessage(""), 4000);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;
        setError("");

        try {
            await axiosInstance.delete(`/api/projects/${id}`);
            setSuccessMessage("Project deleted successfully!");
            fetchProjects();
        } catch (err) {
            console.error("Delete error:", err);
            setError("Failed to delete project.");
        } finally {
            setTimeout(() => setSuccessMessage(""), 4000);
        }
    };

    return (
        <div className="w-full space-y-6">
            {/* Header section */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Manage Projects</h2>
                    <p className="text-xs text-slate-500">Configure your portfolio projects and home page featured items</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs shadow-indigo-500/10 hover:shadow-md hover:shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
                >
                    <FaPlus />
                    <span>Add Project</span>
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

            {/* Projects Grid Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div 
                        key={project._id}
                        className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:border-slate-350 shadow-xs transition-all flex flex-col group"
                    >
                        <div className="relative h-44 overflow-hidden bg-slate-100 flex justify-center items-center">
                            <img 
                                src={project.image} 
                                alt={project.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {project.featured && (
                                <span className="absolute top-3 left-3 px-2 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs">
                                    <FaCheck size={8} className="text-purple-600" /> Featured
                                </span>
                            )}
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                            <div className="space-y-2">
                                <h3 className="text-base font-bold text-slate-800 leading-tight">{project.title}</h3>
                                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{project.description}</p>
                                
                                <div className="flex flex-wrap gap-1.5 pt-2">
                                    {project.stack && project.stack.map((tech, idx) => (
                                        <span 
                                            key={idx}
                                            className="px-2 py-0.5 text-[10px] font-semibold bg-slate-50 border border-slate-200 text-slate-600 rounded-md"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                                <a 
                                    href={project.github} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-slate-500 hover:text-slate-800 transition-colors text-xs font-semibold flex items-center gap-1.5"
                                >
                                    <FaGithub size={14} className="text-slate-400" /> GitHub Link
                                </a>

                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => openEditModal(project)}
                                        className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700 rounded-lg border border-indigo-100 transition-all cursor-pointer"
                                        aria-label="Edit project"
                                    >
                                        <FaEdit size={12} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(project._id)}
                                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-lg border border-red-100 transition-all cursor-pointer"
                                        aria-label="Delete project"
                                    >
                                        <FaTrash size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {projects.length === 0 && (
                    <div className="col-span-full py-16 text-center text-slate-500 border border-dashed border-slate-200 rounded-2xl bg-white shadow-xs">
                        No projects found. Click "Add Project" to create one.
                    </div>
                )}
            </div>

            {/* Modal Dialog */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
                    <div className="bg-white border border-slate-200/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <h3 className="text-base font-bold text-slate-900">
                                {editMode ? "Edit Project Details" : "Create New Project Card"}
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
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Project Title</label>
                                <input 
                                    type="text" 
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Mealzy Health"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all shadow-inner"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Description</label>
                                <textarea 
                                    required
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="A wellness companion powered by AI..."
                                    rows={4}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all resize-none shadow-inner"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">GitHub Repository URL</label>
                                <input 
                                    type="url" 
                                    required
                                    value={github}
                                    onChange={(e) => setGithub(e.target.value)}
                                    placeholder="https://github.com/username/project"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all shadow-inner"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Tech Stack (comma-separated)</label>
                                <input 
                                    type="text" 
                                    value={stackInput}
                                    onChange={(e) => setStackInput(e.target.value)}
                                    placeholder="React Native, Node.js, MongoDB"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all shadow-inner"
                                />
                            </div>

                            {/* Featured Option */}
                            <div className="flex items-center gap-3 py-2.5 bg-slate-50 px-4 rounded-xl border border-slate-200 shadow-inner">
                                <input 
                                    type="checkbox" 
                                    id="featured"
                                    checked={featured}
                                    onChange={(e) => setFeatured(e.target.checked)}
                                    className="w-4 h-4 text-indigo-600 border-slate-300 bg-white rounded focus:ring-indigo-500/20"
                                />
                                <label htmlFor="featured" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                                    Display on home page Featured list?
                                </label>
                            </div>

                            {/* Image selector */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Thumbnail Cover Picture</label>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 file:transition-colors file:cursor-pointer"
                                />

                                {imagePreview && (
                                    <div className="mt-3 relative h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-inner">
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
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
                                    {loading ? "Saving Card..." : "Save Project"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

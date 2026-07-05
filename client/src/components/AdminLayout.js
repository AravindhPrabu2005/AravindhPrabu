import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
    FaInbox, 
    FaFileAlt, 
    FaSignOutAlt, 
    FaBars, 
    FaTimes, 
    FaUserShield,
    FaRegClock,
    FaFilePdf,
    FaProjectDiagram,
    FaCertificate,
    FaAward,
    FaBriefcase,
    FaGlobe
} from "react-icons/fa";

export default function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("admin_authenticated");
        localStorage.removeItem("admin_token");
        navigate("/");
    };

    const navigationItems = [
        {
            name: "Messages",
            path: "/admin/messages",
            icon: FaInbox,
            desc: "Contact form messages"
        },
        {
            name: "Resume Requests",
            path: "/admin/resume-requests",
            icon: FaFileAlt,
            desc: "Resume downloads pending"
        },
        {
            name: "Resume & Cover Letter",
            path: "/admin/resume-settings",
            icon: FaFilePdf,
            desc: "Update resume & cover letter"
        },
        {
            name: "Projects",
            path: "/admin/projects",
            icon: FaProjectDiagram,
            desc: "Manage portfolio projects"
        },
        {
            name: "Certifications",
            path: "/admin/certifications",
            icon: FaCertificate,
            desc: "Manage credentials"
        },
        {
            name: "Achievements",
            path: "/admin/achievements",
            icon: FaAward,
            desc: "Manage awards & hackathons"
        },
        {
            name: "Experience",
            path: "/admin/experience",
            icon: FaBriefcase,
            desc: "Manage work experiences"
        },
        {
            name: "Visitor Logs",
            path: "/admin/visitors",
            icon: FaGlobe,
            desc: "Portfolio visitor logs"
        }
    ];

    const currentTabName = navigationItems.find(item => item.path === location.pathname)?.name || "Dashboard";

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col md:flex-row">
            {/* Mobile Top Header */}
            <div className="fixed top-0 left-0 right-0 h-16 z-30 bg-slate-900/90 backdrop-blur-md border-b border-purple-500/10 flex items-center justify-between px-6 md:hidden shadow-lg">
                <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    Admin Portal
                </span>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 text-white bg-purple-500/10 hover:bg-purple-500/20 rounded-xl transition-all duration-300"
                    aria-label="Toggle Navigation Menu"
                >
                    {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                </button>
            </div>

            {/* Mobile Sidebar Backdrop */}
            {sidebarOpen && (
                <div 
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden transition-opacity duration-300"
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-purple-500/10 flex flex-col justify-between overflow-hidden
                transform transition-transform duration-300 ease-in-out shadow-2xl h-screen
                md:translate-x-0 md:static md:h-screen
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <div className="flex-1 overflow-y-auto scrollbar-hide">
                    {/* Sidebar Header */}
                    <div className="h-20 border-b border-purple-500/10 flex items-center px-8 gap-3 bg-slate-950/40">
                        <div className="p-2.5 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
                            <FaUserShield className="text-purple-400 text-xl" />
                        </div>
                        <div>
                            <h2 className="font-bold text-white leading-none">Aravindh Prabu</h2>
                            <span className="text-[10px] text-gray-400 tracking-wider uppercase mt-1 inline-block">Administrator</span>
                        </div>
                    </div>

                    {/* Nav Links */}
                    <nav className="p-4 space-y-2 mt-4">
                        {navigationItems.map((item) => {
                            const IconComponent = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`
                                        flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300
                                        ${isActive 
                                            ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30 shadow-md shadow-purple-500/5" 
                                            : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"}
                                    `}
                                >
                                    <IconComponent className={`text-lg ${isActive ? "text-purple-400" : "text-gray-400 group-hover:text-white"}`} />
                                    <div>
                                        <div className="font-semibold text-sm">{item.name}</div>
                                        <div className="text-[10px] text-gray-400/80 font-normal mt-0.5">{item.desc}</div>
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-purple-500/10 bg-slate-950/20 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-gray-400 px-2 py-1 bg-white/5 rounded-lg border border-white/5">
                        <FaRegClock className="text-purple-400" />
                        <span>System Date: {new Date().toLocaleDateString()}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 font-semibold rounded-xl border border-red-500/20 transition-all duration-300 cursor-pointer"
                    >
                        <FaSignOutAlt />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col md:h-screen md:overflow-y-auto pt-16 md:pt-0 bg-slate-950">
                {/* Header (Desktop only) */}
                <header className="hidden md:flex h-20 border-b border-purple-500/10 items-center justify-between px-8 bg-slate-900/40">
                    <div>
                        <h1 className="text-xl font-bold text-white">{currentTabName}</h1>
                        <p className="text-xs text-gray-400 mt-1">Management and moderation panel</p>
                    </div>
                    <Link 
                        to="/"
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white rounded-xl text-sm font-medium border border-white/5 transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        View Portfolio
                    </Link>
                </header>

                {/* Dashboard Screen Content */}
                <div className="p-4 md:p-8 max-w-7xl w-full mx-auto flex-1">
                    {children}
                </div>
            </main>
        </div>
    );
}

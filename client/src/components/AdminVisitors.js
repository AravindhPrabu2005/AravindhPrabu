import { useEffect, useState } from "react";
import axiosInstance from "./axiosInstance";
import { FaTrash, FaTrashAlt, FaGlobe, FaLaptop, FaCalendarAlt, FaNetworkWired } from "react-icons/fa";

export default function AdminVisitors() {
    const [visitors, setVisitors] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchVisitors = () => {
        axiosInstance.get("/api/visitors")
            .then((response) => {
                setVisitors(response.data || []);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching visitors:", error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchVisitors();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this visitor log entry?")) {
            try {
                await axiosInstance.delete(`/api/visitors/${id}`);
                fetchVisitors();
            } catch (error) {
                console.error("Error deleting visitor log:", error);
            }
        }
    };

    const handleClearAll = async () => {
        if (window.confirm("WARNING: Are you sure you want to delete ALL visitor logs? This action cannot be undone.")) {
            try {
                await axiosInstance.delete("/api/visitors");
                fetchVisitors();
            } catch (error) {
                console.error("Error clearing visitor logs:", error);
            }
        }
    };

    const formatTimestamp = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString();
    };

    // Helper to extract device info from User Agent
    const getDeviceDescription = (ua) => {
        if (!ua) return "Unknown Device";
        if (ua.match(/like Mac OS X/i)) {
            if (ua.match(/iPad/i)) return "iPad (iOS)";
            if (ua.match(/iPhone/i)) return "iPhone (iOS)";
            return "Apple Device";
        }
        if (ua.match(/Android/i)) return "Android Device";
        if (ua.match(/Windows/i)) return "Windows PC";
        if (ua.match(/Macintosh/i)) return "Mac PC";
        if (ua.match(/Linux/i)) return "Linux PC";
        return "Browser Client";
    };

    // Helper to extract clean browser info
    const getBrowserDescription = (ua) => {
        if (!ua) return "Unknown Browser";
        if (ua.match(/edg/i)) return "Microsoft Edge";
        if (ua.match(/opr/i) || ua.match(/opera/i)) return "Opera";
        if (ua.match(/chrome|crios/i)) return "Google Chrome";
        if (ua.match(/firefox|fxios/i)) return "Mozilla Firefox";
        if (ua.match(/safari/i)) return "Apple Safari";
        return "Generic Browser";
    };

    return (
        <div className="w-full space-y-6">
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="flex items-center gap-3 text-gray-400">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Loading visitor logs...</span>
                    </div>
                </div>
            ) : (
                <>
                    {/* Header bar with Stats & Clear all */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400">
                                <FaGlobe className="w-5 h-5 animate-pulse" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">Visitor Logs</h2>
                                <p className="text-xs text-gray-400">Logged session visits: {visitors.length}</p>
                            </div>
                        </div>
                        {visitors.length > 0 && (
                            <button
                                onClick={handleClearAll}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 rounded-xl text-xs font-semibold transition-all duration-300 active:scale-95 cursor-pointer"
                            >
                                <FaTrashAlt />
                                <span>Clear All Logs</span>
                            </button>
                        )}
                    </div>

                    {visitors.length === 0 ? (
                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-purple-500/10 p-12 text-center">
                            <FaGlobe className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400">No visitor logs recorded yet</p>
                        </div>
                    ) : (
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-purple-500/10 overflow-hidden shadow-xl">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-purple-950/20 border-b border-purple-500/10 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">
                                            <th className="px-6 py-4">Date & Time</th>
                                            <th className="px-6 py-4">Location & ISP</th>
                                            <th className="px-6 py-4">IP Address</th>
                                            <th className="px-6 py-4">Device / Client</th>
                                            <th className="px-6 py-4">Referrer / Entry</th>
                                            <th className="px-6 py-4 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-purple-500/10 text-sm">
                                        {visitors.map((visitor) => (
                                            <tr key={visitor._id} className="hover:bg-purple-500/5 transition-colors duration-200">
                                                {/* Date & Time */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2 text-gray-300">
                                                        <FaCalendarAlt className="text-purple-400/70" size={12} />
                                                        <span className="font-medium text-xs">
                                                            {formatTimestamp(visitor.visitedAt)}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Location & ISP */}
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="font-semibold text-white">
                                                                {visitor.city || "Unknown City"}
                                                            </span>
                                                            <span className="text-xs text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
                                                                {visitor.country || "Unknown Country"}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                                            <FaNetworkWired size={10} className="text-pink-400/70" />
                                                            <span className="truncate max-w-[200px]">{visitor.isp || "Unknown ISP"}</span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* IP Address */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <code className="text-xs text-pink-300 font-mono bg-pink-500/5 border border-pink-500/10 px-2 py-1 rounded">
                                                        {visitor.ip || "Unknown"}
                                                    </code>
                                                </td>

                                                {/* Device / Client */}
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1.5">
                                                        <div className="flex items-center gap-1.5 text-gray-200 text-xs font-semibold">
                                                            <FaLaptop className="text-purple-400" size={12} />
                                                            <span>{getDeviceDescription(visitor.userAgent)}</span>
                                                        </div>
                                                        <div className="text-xs text-gray-300">
                                                            Browser: <span className="text-pink-300 font-medium">{getBrowserDescription(visitor.userAgent)}</span>
                                                        </div>
                                                        <div className="text-[10px] text-purple-400 font-mono">
                                                            Screen: {visitor.screenResolution || "Unknown"} | Lang: {visitor.language || "Unknown"}
                                                        </div>
                                                        {/* Raw User Agent - wrapped inside a small readable scrollbox */}
                                                        <div className="text-[9px] text-gray-500 font-mono bg-slate-950/40 border border-white/5 p-2 rounded-lg max-w-[280px] break-all leading-normal max-h-[60px] overflow-y-auto scrollbar-hide" title={visitor.userAgent}>
                                                            {visitor.userAgent || "Unknown UA"}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Referrer / Entry */}
                                                <td className="px-6 py-4 text-xs text-gray-300">
                                                    <div className="space-y-1">
                                                        <span className="px-2.5 py-1 bg-white/5 rounded-lg border border-white/5 text-[11px] font-semibold text-purple-300 truncate max-w-[150px] inline-block">
                                                            {visitor.referrer === "Direct" ? "Direct Access" : visitor.referrer}
                                                        </span>
                                                        <div className="text-[10px] text-gray-500">
                                                            Path: <span className="font-mono text-purple-400/80">{visitor.path || "/"}</span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Action */}
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <button
                                                        onClick={() => handleDelete(visitor._id)}
                                                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 rounded-lg transition-all duration-300 active:scale-95 cursor-pointer"
                                                        title="Delete entry"
                                                    >
                                                        <FaTrash size={12} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

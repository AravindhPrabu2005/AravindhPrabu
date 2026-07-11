import { useEffect, useState } from "react";
import axiosInstance from "./axiosInstance";
import { FaTrash, FaGlobe, FaLaptop, FaNetworkWired, FaEye, FaTimes, FaCopy } from "react-icons/fa";

export default function AdminVisitors() {
    const [visitors, setVisitors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVisitor, setSelectedVisitor] = useState(null);

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
                if (selectedVisitor && selectedVisitor._id === id) {
                    setSelectedVisitor(null);
                }
            } catch (error) {
                console.error("Error deleting visitor log:", error);
            }
        }
    };

    /* const handleClearAll = async () => {
        if (window.confirm("WARNING: Are you sure you want to delete ALL visitor logs? This action cannot be undone.")) {
            try {
                await axiosInstance.delete("/api/visitors");
                fetchVisitors();
                setSelectedVisitor(null);
            } catch (error) {
                console.error("Error clearing visitor logs:", error);
            }
        }
    }; */

    const formatTimestamp = (isoString) => {
        if (!isoString) return "N/A";
        try {
            const date = new Date(isoString);
            return date.toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
                hour12: true
            });
        } catch (e) {
            return isoString;
        }
    };

    const cleanVisitorTime = (timeStr) => {
        if (!timeStr) return "Unknown";
        
        let cleaned = timeStr.replace(/\s\([^)]+\)$/, "");
        
        const timeMatch = cleaned.match(/(\d{2}):(\d{2}):(\d{2})/);
        if (timeMatch) {
            let hours = parseInt(timeMatch[1], 10);
            const minutes = timeMatch[2];
            const seconds = timeMatch[3];
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            const time12 = `${hours}:${minutes}:${seconds} ${ampm}`;
            cleaned = cleaned.replace(timeMatch[0], time12);
        }
        
        return cleaned;
    };

    const getPageCounts = (pageViews) => {
        if (!pageViews || !Array.isArray(pageViews) || pageViews.length === 0) {
            return [];
        }
        const counts = {};
        pageViews.forEach(pv => {
            const p = pv.path || "/";
            counts[p] = (counts[p] || 0) + 1;
        });
        return Object.entries(counts).map(([path, count]) => ({ path, count }));
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
                    <div className="flex items-center gap-3 text-slate-500">
                        <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Loading visitor logs...</span>
                    </div>
                </div>
            ) : (
                <>
                    {/* Header bar with Stats & Clear all */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-600">
                                <FaGlobe className="w-5 h-5 animate-pulse" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Manage Visitor Logs</h2>
                                <p className="text-xs text-slate-500">Logged session visits: {visitors.length}</p>
                            </div>
                        </div>
                        {/* {visitors.length > 0 && (
                            <button
                                onClick={handleClearAll}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-650 hover:text-red-700 border border-red-100 rounded-xl text-xs font-semibold transition-all duration-300 active:scale-95 cursor-pointer"
                            >
                                <FaTrashAlt />
                                <span>Clear All Logs</span>
                            </button>
                        )} */}
                    </div>

                    {visitors.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
                            <FaGlobe className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500 font-medium text-sm">No visitor logs recorded yet</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200/80 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                            <th className="px-6 py-4">Date & Time</th>
                                            <th className="px-6 py-4">Location & ISP</th>
                                            <th className="px-6 py-4">Referrer / Entry</th>
                                            <th className="px-6 py-4 text-center">Session Details</th>
                                            <th className="px-6 py-4 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-sm">
                                        {visitors.map((visitor) => (
                                            <tr key={visitor._id} className="hover:bg-slate-50/40 transition-colors duration-200">
                                                {/* Date & Time */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                     <div className="flex flex-col gap-1 text-slate-600">
                                                         <div className="flex items-center gap-1.5">
                                                             <span className="text-[9px] uppercase font-bold text-indigo-500 px-1 bg-indigo-50 border border-indigo-100 rounded">My Time (IST):</span>
                                                             <span className="font-semibold text-xs text-slate-700">
                                                                 {formatTimestamp(visitor.visitedAt)}
                                                             </span>
                                                         </div>
                                                         {visitor.visitorTime ? (
                                                             <div className="flex items-center gap-1.5">
                                                                 <span className="text-[9px] uppercase font-bold text-emerald-500 px-1 bg-emerald-50 border border-emerald-100 rounded">Visitor:</span>
                                                                 <span className="font-medium text-[11px] text-slate-500 truncate max-w-[220px]" title={visitor.visitorTime}>
                                                                     {cleanVisitorTime(visitor.visitorTime)}
                                                                 </span>
                                                             </div>
                                                         ) : (
                                                             <div className="flex items-center gap-1.5 opacity-60">
                                                                 <span className="text-[9px] uppercase font-bold text-slate-400 px-1 bg-slate-50 border border-slate-200 rounded">Visitor:</span>
                                                                 <span className="font-medium text-[10px] text-slate-400">N/A</span>
                                                             </div>
                                                         )}
                                                     </div>
                                                 </td>

                                                {/* Location & ISP */}
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="font-semibold text-slate-800">
                                                                {visitor.city || "Unknown City"}
                                                            </span>
                                                            <span className="text-[10px] font-semibold text-indigo-650 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                                                                {visitor.country || "Unknown Country"}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-[10px] text-slate-450">
                                                            <FaNetworkWired size={10} className="text-slate-400" />
                                                            <span className="truncate max-w-[200px]">{visitor.isp || "Unknown ISP"}</span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Referrer / Entry */}
                                                <td className="px-6 py-4 text-xs text-slate-600">
                                                    <div className="space-y-1">
                                                        <span className="px-2.5 py-1 bg-slate-50 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-700 truncate max-w-[150px] inline-block shadow-xs">
                                                            {visitor.referrer === "Direct" ? "Direct Access" : visitor.referrer}
                                                        </span>
                                                        <div className="text-[10px] text-slate-450">
                                                            Path: <span className="font-mono text-indigo-650">{visitor.path || "/"}</span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Details Button */}
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <button
                                                        onClick={() => setSelectedVisitor(visitor)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-55 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700 border border-indigo-100 rounded-xl text-xs font-semibold transition-all duration-300 active:scale-95 cursor-pointer shadow-xs"
                                                    >
                                                        <FaEye size={12} />
                                                        <span>View Details</span>
                                                    </button>
                                                </td>

                                                {/* Action */}
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <button
                                                        onClick={() => handleDelete(visitor._id)}
                                                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-100 rounded-lg transition-all duration-300 active:scale-95 cursor-pointer"
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

            {/* Details Modal */}
            {selectedVisitor && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-slideUp">
                        {/* Header */}
                        <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-indigo-600 font-semibold">
                                <FaLaptop size={16} />
                                <span>Visitor Session Details</span>
                            </div>
                            <button
                                onClick={() => setSelectedVisitor(null)}
                                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            >
                                <FaTimes size={16} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 overflow-y-auto space-y-5 max-h-[75vh]">
                            {/* Section: Visit Timestamps */}
                            <div className="space-y-3">
                                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Session Timestamps</h4>
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500 font-medium">My Time (IST)</span>
                                        <span className="text-xs font-semibold text-slate-800">
                                            {formatTimestamp(selectedVisitor.visitedAt)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500 font-medium">Visitor Time (Browser)</span>
                                        <span className="text-xs font-semibold text-emerald-650" title={selectedVisitor.visitorTime}>
                                            {selectedVisitor.visitorTime ? cleanVisitorTime(selectedVisitor.visitorTime) : "N/A (Old Log)"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Section: Visitor Type & Scroll Depth */}
                            <div className="space-y-3">
                                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Engagement Metrics</h4>
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 space-y-3.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500 font-medium">Visitor Type</span>
                                        <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                                            selectedVisitor.visitorType === "Returning" 
                                                ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                                                : "bg-indigo-50 text-indigo-700 border-indigo-200"
                                        }`}>
                                            {selectedVisitor.visitorType || "New Visitor"}
                                        </span>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                                            <span>Max Scroll Depth</span>
                                            <span className="font-bold text-slate-800">{selectedVisitor.maxScrollDepth || 0}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-indigo-650 rounded-full transition-all duration-500" 
                                                style={{ width: `${selectedVisitor.maxScrollDepth || 0}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section: IP & Location */}
                            <div className="space-y-3">
                                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Network & Location</h4>
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500 font-medium">IP Address</span>
                                        <div className="flex items-center gap-2">
                                            <code className="text-xs font-mono font-bold bg-white border border-slate-200 px-2.5 py-1 rounded shadow-xs text-slate-800">
                                                {selectedVisitor.ip || "Unknown"}
                                            </code>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(selectedVisitor.ip || "");
                                                    alert("IP address copied to clipboard!");
                                                }}
                                                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                                                title="Copy IP Address"
                                            >
                                                <FaCopy size={12} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500 font-medium">Location</span>
                                        <span className="text-xs font-semibold text-slate-800">
                                            {selectedVisitor.city || "Unknown City"}, {selectedVisitor.region || "Unknown Region"}, {selectedVisitor.country || "Unknown Country"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500 font-medium">ISP / Network</span>
                                        <span className="text-xs font-semibold text-slate-800 truncate max-w-[240px]" title={selectedVisitor.isp}>
                                            {selectedVisitor.isp || "Unknown ISP"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500 font-medium">Organization / Institute</span>
                                        <span className="text-xs font-semibold text-slate-800 truncate max-w-[240px]" title={selectedVisitor.org}>
                                            {selectedVisitor.org || "Unknown"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500 font-medium">Device Timezone</span>
                                        <span className="text-xs font-mono font-semibold text-slate-800">
                                            {selectedVisitor.timezone || "Unknown"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500 font-medium">Coordinates</span>
                                        <div className="text-right">
                                            <span className="text-xs font-mono font-semibold text-slate-800">
                                                {selectedVisitor.latitude && selectedVisitor.longitude ? `${selectedVisitor.latitude}, ${selectedVisitor.longitude}` : "Unknown"}
                                            </span>
                                            {selectedVisitor.latitude && selectedVisitor.longitude && (
                                                <a 
                                                    href={`https://www.google.com/maps?q=${selectedVisitor.latitude},${selectedVisitor.longitude}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-[10px] text-indigo-600 hover:text-indigo-700 font-semibold hover:underline block mt-0.5"
                                                >
                                                    View on Google Maps →
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section: Client & Device Details */}
                            <div className="space-y-3">
                                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Device & Browser</h4>
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500 font-medium">Device Class</span>
                                        <span className="text-xs font-semibold text-slate-800">
                                            {getDeviceDescription(selectedVisitor.userAgent)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500 font-medium">Browser Client</span>
                                        <span className="text-xs font-semibold text-indigo-650">
                                            {getBrowserDescription(selectedVisitor.userAgent)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500 font-medium">Browser Vendor</span>
                                        <span className="text-xs font-semibold text-slate-800">
                                            {selectedVisitor.browserVendor || "Unknown"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500 font-medium">Rendering Engine</span>
                                        <span className="text-xs font-mono font-semibold text-slate-800">
                                            {selectedVisitor.renderingEngine || "Unknown"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500 font-medium">Platform / OS</span>
                                        <span className="text-xs font-semibold text-slate-800">
                                            {selectedVisitor.platform || "Unknown"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500 font-medium">Screen Resolution</span>
                                        <span className="text-xs font-mono font-semibold text-slate-800">
                                            {selectedVisitor.screenResolution || "Unknown"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500 font-medium">Language</span>
                                        <span className="text-xs font-semibold text-slate-800">
                                            {selectedVisitor.language || "Unknown"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500 font-medium">Cookies Enabled</span>
                                        <span className="text-xs font-semibold text-slate-800">
                                            {selectedVisitor.cookieSupport !== undefined 
                                                ? (selectedVisitor.cookieSupport ? "Yes" : "No") 
                                                : "Unknown"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500 font-medium">Touchscreen Support</span>
                                        <span className="text-xs font-semibold text-slate-800">
                                            {selectedVisitor.touchSupport !== undefined 
                                                ? (selectedVisitor.touchSupport ? "Yes" : "No") 
                                                : "Unknown"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500 font-medium">Network Connection</span>
                                        <span className="text-xs font-mono font-semibold text-slate-800 truncate max-w-[240px]" title={selectedVisitor.networkType}>
                                            {selectedVisitor.networkType || "Unknown"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Section: Campaign UTM Parameters */}
                            {selectedVisitor.utmParams && (selectedVisitor.utmParams.source || selectedVisitor.utmParams.medium || selectedVisitor.utmParams.campaign) && (
                                <div className="space-y-3">
                                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Campaign UTM Parameters</h4>
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 space-y-3">
                                        {selectedVisitor.utmParams.source && (
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-500 font-medium">Source</span>
                                                <span className="font-semibold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded">{selectedVisitor.utmParams.source}</span>
                                            </div>
                                        )}
                                        {selectedVisitor.utmParams.medium && (
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-500 font-medium">Medium</span>
                                                <span className="font-semibold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded">{selectedVisitor.utmParams.medium}</span>
                                            </div>
                                        )}
                                        {selectedVisitor.utmParams.campaign && (
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-500 font-medium">Campaign</span>
                                                <span className="font-semibold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded">{selectedVisitor.utmParams.campaign}</span>
                                            </div>
                                        )}
                                        {selectedVisitor.utmParams.term && (
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-500 font-medium">Term</span>
                                                <span className="font-semibold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded">{selectedVisitor.utmParams.term}</span>
                                            </div>
                                        )}
                                        {selectedVisitor.utmParams.content && (
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-500 font-medium">Content</span>
                                                <span className="font-semibold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded">{selectedVisitor.utmParams.content}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Section: Referrer & Navigation */}
                            <div className="space-y-3">
                                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Navigation Info</h4>
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500 font-medium">Referrer Origin</span>
                                        <span className="text-xs font-semibold text-slate-800 truncate max-w-[240px]" title={selectedVisitor.referrer}>
                                            {selectedVisitor.referrer === "Direct" ? "Direct Access" : selectedVisitor.referrer}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500 font-medium">Entry Page</span>
                                        <code className="text-xs font-mono text-slate-850 font-bold">
                                            {selectedVisitor.path || "/"}
                                        </code>
                                    </div>
                                </div>
                            </div>

                            {/* Section: Dynamic Page Navigation Summary */}
                            <div className="space-y-3">
                                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pages Visited & Counts</h4>
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 space-y-2.5">
                                    {getPageCounts(selectedVisitor.pageViews).length > 0 ? (
                                        getPageCounts(selectedVisitor.pageViews).map((pv, idx) => (
                                            <div key={idx} className="flex items-center justify-between text-xs">
                                                <code className="font-mono text-indigo-650 font-bold bg-indigo-50 border border-indigo-100/50 px-2 py-0.5 rounded">
                                                    {pv.path}
                                                </code>
                                                <span className="font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded-full shadow-2xs">
                                                    {pv.count} {pv.count === 1 ? "view" : "views"}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex items-center justify-between text-xs">
                                            <code className="font-mono text-indigo-650 font-bold bg-indigo-50 border border-indigo-100/50 px-2 py-0.5 rounded">
                                                {selectedVisitor.path || "/"}
                                            </code>
                                            <span className="font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded-full shadow-2xs">
                                                1 view (Legacy Log)
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Section: User Navigation Journey Flow */}
                            {selectedVisitor.pageViews && selectedVisitor.pageViews.length > 1 && (
                                <div className="space-y-3">
                                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Navigation Journey ({selectedVisitor.pageViews.length} steps)</h4>
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 max-h-[160px] overflow-y-auto">
                                        <div className="relative border-l-2 border-slate-200 pl-4 space-y-4 ml-1.5 py-1">
                                            {selectedVisitor.pageViews.map((pv, idx) => (
                                                <div key={idx} className="relative text-xs">
                                                    {/* Dot */}
                                                    <span className="absolute -left-[21.5px] top-1.5 w-2 h-2 rounded-full bg-indigo-500 border border-white"></span>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="font-mono font-bold text-slate-800 truncate max-w-[280px]">
                                                            {pv.path || "/"}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-medium">
                                                            Visited at: {formatTimestamp(pv.visitedAt)}
                                                            {pv.duration > 0 && ` • Active for ${pv.duration}s`}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Section: Click Interactions Log */}
                            <div className="space-y-3">
                                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Button Clicks & Interactions</h4>
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 max-h-[160px] overflow-y-auto">
                                    {selectedVisitor.clicks && selectedVisitor.clicks.length > 0 ? (
                                        <div className="relative border-l-2 border-emerald-200 pl-4 space-y-4 ml-1.5 py-1">
                                            {selectedVisitor.clicks.map((click, idx) => (
                                                <div key={idx} className="relative text-xs">
                                                    {/* Dot */}
                                                    <span className="absolute -left-[21.5px] top-1.5 w-2 h-2 rounded-full bg-emerald-500 border border-white"></span>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="font-semibold text-slate-800">
                                                            Clicked: <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded text-[10px] uppercase">{click.label}</span>
                                                        </span>
                                                        {click.elementId && click.elementId !== "generic_click" && (
                                                            <code className="text-[10px] text-slate-500 font-mono">
                                                                ID: {click.elementId}
                                                            </code>
                                                        )}
                                                        <span className="text-[9px] text-slate-400 font-medium">
                                                            {formatTimestamp(click.clickedAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-slate-400 italic block text-center py-2">No button clicks logged in this session</span>
                                    )}
                                </div>
                            </div>

                            {/* Section: User Agent */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Raw User Agent</h4>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(selectedVisitor.userAgent || "");
                                            alert("User Agent copied to clipboard!");
                                        }}
                                        className="text-[10px] text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer"
                                    >
                                        Copy User Agent
                                    </button>
                                </div>
                                <div 
                                    className="text-[10px] text-slate-500 font-mono bg-slate-50 border border-slate-200 p-3 rounded-xl max-h-[100px] overflow-y-auto break-all leading-normal cursor-pointer hover:bg-slate-100/60 transition-colors shadow-inner"
                                    title="Click to copy raw User Agent string"
                                    onClick={() => {
                                        navigator.clipboard.writeText(selectedVisitor.userAgent || "");
                                        alert("User Agent copied!");
                                    }}
                                >
                                    {selectedVisitor.userAgent || "Unknown"}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-slate-50/80 px-6 py-4 border-t border-slate-100 flex justify-end">
                            <button
                                onClick={() => setSelectedVisitor(null)}
                                className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

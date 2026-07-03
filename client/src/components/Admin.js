import { useEffect, useState } from "react";
import axiosInstance from "./axiosInstance";
import { FaTrash, FaTrashAlt } from "react-icons/fa";

export default function Admin() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMessages = () => {
        axiosInstance.get("/api/messages")
            .then((response) => {
                setMessages(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching messages:", error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this message?")) {
            try {
                await axiosInstance.delete(`/api/messages/${id}`);
                fetchMessages();
            } catch (error) {
                console.error("Error deleting message:", error);
            }
        }
    };

    const handleClearAll = async () => {
        if (window.confirm("WARNING: Are you sure you want to delete ALL messages? This action cannot be undone.")) {
            try {
                await axiosInstance.delete("/api/messages");
                fetchMessages();
            } catch (error) {
                console.error("Error clearing messages:", error);
            }
        }
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
                        <span>Loading messages...</span>
                    </div>
                </div>
            ) : (
                <>
                    {/* Header bar with Stats & Clear all */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">All Messages</h2>
                                <p className="text-xs text-gray-400">Total received: {messages.length}</p>
                            </div>
                        </div>
                        {messages.length > 0 && (
                            <button
                                onClick={handleClearAll}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 rounded-xl text-xs font-semibold transition-all duration-300 active:scale-95 cursor-pointer"
                            >
                                <FaTrashAlt />
                                <span>Clear All Messages</span>
                            </button>
                        )}
                    </div>

                    {messages.length === 0 ? (
                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-purple-500/10 p-12 text-center">
                            <svg className="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <p className="text-gray-400">No contact messages found</p>
                        </div>
                    ) : (
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-purple-500/10 overflow-hidden shadow-xl">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-purple-950/20 border-b border-purple-500/10 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">
                                            <th className="px-6 py-4">Sender</th>
                                            <th className="px-6 py-4">Email</th>
                                            <th className="px-6 py-4">Message</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-purple-500/5">
                                        {messages.map((msg, index) => (
                                            <tr key={index} className="hover:bg-purple-500/5 transition-colors duration-200">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm shadow-md">
                                                            {msg.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="text-white font-medium text-sm">{msg.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <a 
                                                        href={`mailto:${msg.email}`}
                                                        className="text-purple-400 hover:text-purple-300 text-sm hover:underline transition-colors break-all"
                                                    >
                                                        {msg.email}
                                                    </a>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-gray-300 text-sm leading-relaxed max-w-lg whitespace-pre-line">
                                                        {msg.message}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <button 
                                                        onClick={() => handleDelete(msg._id)}
                                                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-colors border border-red-500/10 cursor-pointer"
                                                        title="Delete message"
                                                    >
                                                        <FaTrash size={14} />
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

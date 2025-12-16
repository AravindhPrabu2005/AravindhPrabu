import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./axiosInstance";

export default function Admin() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axiosInstance.get("/api/messages")
            .then((response) => {
                setMessages(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching messages:", error);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-slate-900 text-white pt-20">
            {/* Header with Back Button */}
            <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-semibold">Contact Messages</h1>
                        <p className="text-sm text-gray-400 mt-1">View all contact form submissions</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="flex items-center gap-3 text-gray-400">
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Loading messages...
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Stats Badge */}
                        <div className="flex items-center gap-2 mb-6">
                            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <h2 className="text-xl font-semibold">All Messages</h2>
                            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-full">
                                {messages.length}
                            </span>
                        </div>

                        {messages.length === 0 ? (
                            <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 text-center">
                                <svg className="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                <p className="text-gray-400">No messages yet</p>
                            </div>
                        ) : (
                            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-slate-700/50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Message</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-700">
                                            {messages.map((msg, index) => (
                                                <tr key={index} className="hover:bg-slate-700/30">
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                                                                <span className="text-sm font-medium text-gray-400">
                                                                    {msg.name?.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                            <span className="text-gray-300 font-medium">{msg.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <a 
                                                            href={`mailto:${msg.email}`}
                                                            className="text-blue-400 hover:text-blue-300 text-sm break-all"
                                                        >
                                                            {msg.email}
                                                        </a>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <p className="text-gray-300 text-sm leading-relaxed max-w-md">
                                                            {msg.message}
                                                        </p>
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
        </div>
    );
}

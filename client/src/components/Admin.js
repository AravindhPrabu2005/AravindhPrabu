import { useEffect, useState } from "react";
import axiosInstance from "./axiosInstance";

export default function Admin() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

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
        <section className="flex flex-col px-5 py-10">
            <h1 className="text-3xl font-bold border-b-4 border-secondary mb-5">Admin Panel</h1>
            {loading ? (
                <p>Loading messages...</p>
            ) : (
                <table className="w-full border-collapse border border-gray-400">
                    <thead>
                        <tr className="bg-secondary text-white">
                            <th className="border border-gray-400 px-4 py-2">Name</th>
                            <th className="border border-gray-400 px-4 py-2">Email</th>
                            <th className="border border-gray-400 px-4 py-2">Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {messages.length > 0 ? (
                            messages.map((msg, index) => (
                                <tr key={index} className="bg-gray-100">
                                    <td className="border border-gray-400 px-4 py-2">{msg.name}</td>
                                    <td className="border border-gray-400 px-4 py-2">{msg.email}</td>
                                    <td className="border border-gray-400 px-4 py-2">{msg.message}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center py-4">
                                    No messages found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </section>
    );
}

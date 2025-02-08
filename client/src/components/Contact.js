import { useState } from "react";

export default function Contact() {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("Sending...");

        try {
            const response = await fetch("http://localhost:5000/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus("Message sent successfully!");
                setFormData({ name: "", email: "", message: "" });
            } else {
                setStatus("Failed to send message");
            }
        } catch (error) {
            setStatus("Error occurred");
        }
    };

    return (
        <section id="contact" className="flex flex-col bg-primary px-5 py-32 text-white">
            <div className="flex flex-col items-center">
                <h1 className="text-4xl border-b-4 border-secondary mb-5 w-[140px] font-bold">Contact</h1>
                <p className="pb-5">If you want to discuss more in detail, please contact me</p>
                <p className="py-2"><span className="font-bold">Email :</span> <a href="mailto:aravindhprabu@gmail.com" target="_blank" rel="noopener noreferrer" className="text-secondary underline">
                    aravindhprabu@gmail.com
                </a>
                </p>
                <p className="py-2"><span className="font-bold">Phone :</span> <a href="tel:+919865214164" className="text-secondary underline">+91 98652 14164</a></p>
                <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md">
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your Name"
                        className="p-2 mb-4 rounded text-black"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Your Email"
                        className="p-2 mb-4 rounded text-black"
                        required
                    />
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Your Message"
                        className="p-2 mb-4 rounded text-black"
                        required
                    ></textarea>
                    <button type="submit" className="bg-secondary px-4 py-2 rounded text-white">Send Message</button>
                </form>
                {status && <p className="mt-4">{status}</p>}
            </div>
        </section>
    );
}

import { useState } from "react"
import ResumeImg from '../assets/resume.jpg'
import axios from "axios"
import axiosInstance from "./axiosInstance"

export default function Resume() {
    const [showModal, setShowModal] = useState(false)
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    const isValidEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    const handleSubmit = async () => {
        if (!isValidEmail(email)) {
            setMessage("Please enter a valid email.")
            return
        }

        setLoading(true)
        setMessage("Requesting...")
        try {
            const res = await axiosInstance.post("/api/send-download-link", { email })
            setMessage(res.data.message)
            setTimeout(() => {
                setShowModal(false)
                setMessage("")
                setEmail("")
                setLoading(false)
            }, 4000)
        } catch (err) {
            setMessage("Something went wrong. Please try again.")
            setLoading(false)
        }
    }

    return (
        <section id="resume" className="flex flex-col md:flex-row bg-primary px-5">
            <div className="py-5 md:w-1/2 flex justify-center md:justify-end">
                <img className="w-[300px]" src={ResumeImg} />
            </div>
            <div className="md:w-1/2 flex justify-center">
                <div className="flex flex-col justify-center text-white">
                    <h1 className="text-4xl border-b-4 border-secondary mb-5 w-[140px] font-bold">Resume</h1>
                    <p className="pb-5">
                        You can get my resume{" "}
                        <button
                            onClick={() => setShowModal(true)}
                            className="btn border-4 border-black ml-3"
                        >
                            Download
                        </button>
                    </p>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="relative bg-white p-6 rounded-lg w-96">
                        <button
                            onClick={() => {
                                setShowModal(false)
                                setMessage("")
                                setEmail("")
                                setLoading(false)
                            }}
                            className="absolute top-2 right-2 text-red-600 text-2xl border border-red-600 rounded transition transform hover:scale-110 duration-200 w-8 h-8 flex items-center justify-center"
                        >
                            &times;
                        </button>
                        <h2 className="text-xl mb-4 text-black">Enter your email to receive the resume</h2>
                        <input
                            type="email"
                            className="border p-2 w-full mb-4"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !isValidEmail(email)}
                            className="bg-primary text-white px-4 py-2 rounded w-full disabled:opacity-50"
                        >
                            Get Resume
                        </button>
                        {message && <p className="mt-4 text-center text-black">{message}</p>}
                    </div>
                </div>
            )}
        </section>
    )
}

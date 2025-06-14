import { useEffect, useState } from "react"
import axios from "axios"
import axiosInstance from "./axiosInstance"

export default function AdminResumePage() {
  const [emails, setEmails] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEmails()
  }, [])

  const fetchEmails = async () => {
    const res = await axiosInstance.get("/api/resume-emails")
    setEmails(res.data)
    setLoading(false)
  }

  const handleAction = async (id, action) => {
    await axiosInstance.put(`/api/resume-emails/${id}`, { status: action })
    fetchEmails()
  }

  const pending = emails.filter(e => e.status === "pending")
  const history = emails.filter(e => e.status !== "pending")

  return (
    <div className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Resume Email Requests</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div>
            <h2 className="text-xl mb-4">Pending Requests</h2>
            {pending.length === 0 ? <p>No pending requests.</p> : (
              <ul className="space-y-4">
                {pending.map(email => (
                  <li key={email._id} className="bg-gray-800 p-4 rounded flex justify-between items-center">
                    <span>{email.email}</span>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleAction(email._id, "approved")}
                        className="bg-green-600 px-4 py-1 rounded"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(email._id, "declined")}
                        className="bg-red-600 px-4 py-1 rounded"
                      >
                        Decline
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-10">
            <h2 className="text-xl mb-4">Approval & Decline History</h2>
            {history.length === 0 ? <p>No history yet.</p> : (
              <ul className="space-y-2">
                {history.map(email => (
                  <li key={email._id} className="flex justify-between p-3 bg-gray-700 rounded">
                    <span>{email.email}</span>
                    <span className={email.status === "approved" ? "text-green-400" : "text-red-400"}>
                      {email.status.toUpperCase()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  )
}

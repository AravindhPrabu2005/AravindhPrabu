import { useEffect, useState } from "react"
import axiosInstance from "./axiosInstance"
import { FaTrash, FaTrashAlt, FaFileAlt } from "react-icons/fa"

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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this request log?")) {
      try {
        await axiosInstance.delete(`/api/resume-emails/${id}`)
        fetchEmails()
      } catch (error) {
        console.error("Error deleting request log:", error)
      }
    }
  }

  const handleClearHistory = async () => {
    if (window.confirm("Are you sure you want to delete ALL resume request history? (Pending requests will not be deleted)")) {
      try {
        await axiosInstance.delete("/api/resume-emails?status=history")
        fetchEmails()
      } catch (error) {
        console.error("Error clearing request history:", error)
      }
    }
  }

  const pending = emails.filter(e => e.status === "pending")
  const history = emails.filter(e => e.status !== "pending")

  return (
    <div className="w-full space-y-8">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3 text-slate-500">
            <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Loading requests...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Master Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-600">
                <FaFileAlt className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Resume Requests</h2>
                <p className="text-xs text-slate-500">Total requested: {emails.length} ({pending.length} pending, {history.length} reviewed)</p>
              </div>
            </div>
          </div>

          {/* Pending Requests Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-yellow-50 rounded-xl border border-yellow-100 text-yellow-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Pending Requests</h2>
                <p className="text-xs text-slate-500">Needs review: {pending.length}</p>
              </div>
            </div>

            {pending.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
                <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-slate-500 font-medium text-sm">No pending resume requests</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {pending.map(email => (
                  <div key={email._id} className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:border-slate-350 shadow-xs transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0 w-11 h-11 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-200">
                          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <span className="text-sm font-semibold text-slate-800 block break-all">{email.email}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">Requested on: {new Date(email.sentAt).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0 items-center">
                        <button
                          onClick={() => handleAction(email._id, "approved")}
                          className="px-4 py-2.5 bg-green-600 hover:bg-green-700 active:scale-95 text-white text-xs font-bold rounded-xl transition-all duration-200 shadow-sm shadow-green-600/10 cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(email._id, "declined")}
                          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold rounded-xl transition-all duration-200 shadow-sm shadow-red-600/10 cursor-pointer"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleDelete(email._id)}
                          className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-xl border border-red-100 transition-all duration-200 cursor-pointer"
                          title="Delete request"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* History Section */}
          <div className="space-y-4 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">History</h2>
                  <p className="text-xs text-slate-500">Reviewed: {history.length}</p>
                </div>
              </div>
              {history.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-100 rounded-xl text-xs font-semibold transition-all duration-300 active:scale-95 cursor-pointer"
                >
                  <FaTrashAlt />
                  <span>Clear History</span>
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
                <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-slate-500 font-medium text-sm">No reviewed requests yet</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200/80 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {history.map(email => (
                        <tr key={email._id} className="hover:bg-slate-50/40 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-700 break-all">{email.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${
                              email.status === "approved" 
                                ? "bg-green-50 text-green-700 border border-green-200/50" 
                                : "bg-red-50 text-red-700 border border-red-200/50"
                            }`}>
                              {email.status === "approved" ? (
                                <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              )}
                              {email.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button
                              onClick={() => handleDelete(email._id)}
                              className="p-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-lg transition-colors border border-red-100 cursor-pointer"
                              title="Delete request"
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
          </div>
        </>
      )}
    </div>
  )
}

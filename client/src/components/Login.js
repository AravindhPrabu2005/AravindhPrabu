import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectUrl = searchParams.get("redirect") || "/admin/messages";

    const handleLogin = (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        setTimeout(() => {
            if (email === "aravindhprabu2005@gmail.com" && password === "Saibaba@123@123") {
                localStorage.setItem("admin_authenticated", "true");
                localStorage.setItem("admin_token", password);
                navigate(redirectUrl);
            } else {
                setError("Invalid email address or password.");
                setLoading(false);
            }
        }, 1000);
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 overflow-hidden">
            {/* Background glowing decorations */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-[500px] h-[500px] -top-64 -left-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-15"></div>
                <div className="absolute w-[500px] h-[500px] -bottom-64 -right-64 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-15"></div>
            </div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-purple-500/20 shadow-2xl shadow-purple-500/10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
                        Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Portal</span>
                    </h1>
                    <p className="text-gray-400 text-sm">Sign in to access your dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {/* Email Input */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            placeholder="aravindhprabu2005@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-4 pr-12 py-3 bg-slate-900/50 border border-purple-500/30 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium animate-shake">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 flex items-center justify-center gap-2 text-sm"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Authenticating...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>
            </div>
        </section>
    );
}

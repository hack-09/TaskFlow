import React, { useState, useEffect } from "react";
import { login } from "../service/authapi";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, Mail, Lock, AlertCircle, Loader2, Github } from "lucide-react";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/dashboard");
        }

        // Check for remembered email
        const rememberedEmail = localStorage.getItem("rememberedEmail");
        if (rememberedEmail) {
            setEmail(rememberedEmail);
            setRememberMe(true);
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await login({ email, password });
            localStorage.setItem("token", response.data.token);
            
            if (rememberMe) {
                localStorage.setItem("rememberedEmail", email);
            } else {
                localStorage.removeItem("rememberedEmail");
            }

            // Success animation before navigation
            setTimeout(() => {
                navigate("/dashboard");
            }, 500);
            
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please check your credentials.");
            // Shake animation on error
            const form = document.querySelector('.login-form');
            form.classList.add('shake-animation');
            setTimeout(() => form.classList.remove('shake-animation'), 500);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = (provider) => {
        // Placeholder for social login integration
        console.log(`Logging in with ${provider}`);
        setError(`${provider} login coming soon!`);
    };

    const handleForgotPassword = () => {
        navigate("/forgot-password");
    };

    return (
        <div className="min-h-screen py-5 flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-32 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${10 + Math.random() * 10}s`
                        }}
                    ></div>
                ))}
            </div>

            <div className="relative z-10 w-full max-w-md mx-4">
                {/* Login Card */}
                <div 
                    className={`login-form bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 transform transition-all duration-500 ${
                        isHovered ? 'scale-105' : 'scale-100'
                    }`}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center space-x-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <LogIn className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                                TaskFlow
                            </h1>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                        <p className="text-blue-100/80">Sign in to continue your productivity journey</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center space-x-2 bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-xl mb-6 animate-fade-in">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-medium text-white">
                                <Mail className="w-4 h-4" />
                                <span>Email Address</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 pl-11 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                />
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-200/60" />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-medium text-white">
                                <Lock className="w-4 h-4" />
                                <span>Password</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full px-4 py-3 pl-11 pr-11 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                />
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-200/60" />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-200/60 hover:text-white transition-colors duration-200"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-blue-100">Remember me</span>
                            </label>
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                className="text-sm text-blue-200 hover:text-white transition-colors duration-200"
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    <span>Sign In</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Social Login Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/20"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-transparent text-blue-100/80">Or continue with</span>
                        </div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => handleSocialLogin('github')}
                            className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-2 px-4 rounded-xl transition-all duration-300 hover:scale-105"
                        >
                            <Github className="w-5 h-5" />
                            <span>GitHub</span>
                        </button>
                        <button
                            onClick={() => handleSocialLogin('google')}
                            className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-2 px-4 rounded-xl transition-all duration-300 hover:scale-105"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            <span>Google</span>
                        </button>
                    </div>

                    {/* Sign Up Link */}
                    <div className="text-center mt-6 pt-6 border-t border-white/20">
                        <p className="text-blue-100/80">
                            Don't have an account?{" "}
                            <button
                                onClick={() => navigate("/register")}
                                className="text-white font-semibold hover:text-blue-200 transition-colors duration-200 underline"
                            >
                                Sign up now
                            </button>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-blue-200/60 text-sm">
                        © 2024 TaskFlow. All rights reserved.
                    </p>
                </div>
            </div>

            {/* Add CSS animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(180deg); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-float {
                    animation: float linear infinite;
                }
                .shake-animation {
                    animation: shake 0.5s ease-in-out;
                }
                .animate-fade-in {
                    animation: fadeIn 0.3s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default LoginPage;
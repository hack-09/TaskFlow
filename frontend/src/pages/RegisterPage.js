import React, { useState } from "react";
import { register } from "../service/authapi";
import { useNavigate, Link } from "react-router-dom";
import { 
    Eye, 
    EyeOff, 
    User, 
    Mail, 
    Lock, 
    CheckCircle, 
    XCircle, 
    AlertCircle,
    Loader2,
    Shield,
    ArrowRight
} from "lucide-react";

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [validation, setValidation] = useState({
        name: { valid: false, message: "" },
        email: { valid: false, message: "" },
        password: { valid: false, message: "" },
        confirmPassword: { valid: false, message: "" }
    });
    const [touched, setTouched] = useState({
        name: false,
        email: false,
        password: false,
        confirmPassword: false
    });
    const navigate = useNavigate();

    // Password strength calculator
    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        return strength;
    };

    // Validation rules
    const validateField = (name, value) => {
        switch (name) {
            case 'name':
                if (!value.trim()) return { valid: false, message: "Name is required" };
                if (value.length < 2) return { valid: false, message: "Name must be at least 2 characters" };
                if (!/^[a-zA-Z\s]+$/.test(value)) return { valid: false, message: "Name can only contain letters and spaces" };
                return { valid: true, message: "" };
            
            case 'email':
                if (!value) return { valid: false, message: "Email is required" };
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) return { valid: false, message: "Please enter a valid email address" };
                return { valid: true, message: "" };
            
            case 'password':
                if (!value) return { valid: false, message: "Password is required" };
                if (value.length < 8) return { valid: false, message: "Password must be at least 8 characters" };
                if (!/(?=.*[a-z])/.test(value)) return { valid: false, message: "Password must contain a lowercase letter" };
                if (!/(?=.*[A-Z])/.test(value)) return { valid: false, message: "Password must contain an uppercase letter" };
                if (!/(?=.*\d)/.test(value)) return { valid: false, message: "Password must contain a number" };
                if (!/(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(value)) {
                    return { valid: false, message: "Password must contain a special character" };
                }
                return { valid: true, message: "" };
            
            case 'confirmPassword':
                if (!value) return { valid: false, message: "Please confirm your password" };
                if (value !== formData.password) return { valid: false, message: "Passwords do not match" };
                return { valid: true, message: "" };
            
            default:
                return { valid: false, message: "" };
        }
    };

    // Handle input change with validation
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Validate field
        const fieldValidation = validateField(name, value);
        setValidation(prev => ({ ...prev, [name]: fieldValidation }));

        // Calculate password strength
        if (name === 'password') {
            setPasswordStrength(calculatePasswordStrength(value));
        }
    };

    // Handle blur event
    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    // Check if form is valid
    const isFormValid = () => {
        return Object.values(validation).every(field => field.valid);
    };

    // Password requirements checklist
    const passwordRequirements = [
        { id: 'length', text: 'At least 8 characters', met: (pwd) => pwd.length >= 8 },
        { id: 'lowercase', text: 'One lowercase letter', met: (pwd) => /[a-z]/.test(pwd) },
        { id: 'uppercase', text: 'One uppercase letter', met: (pwd) => /[A-Z]/.test(pwd) },
        { id: 'number', text: 'One number', met: (pwd) => /[0-9]/.test(pwd) },
        { id: 'special', text: 'One special character', met: (pwd) => /[^A-Za-z0-9]/.test(pwd) },
    ];

    // Handle registration
    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        // Mark all fields as touched
        setTouched({
            name: true,
            email: true,
            password: true,
            confirmPassword: true
        });

        // Validate all fields
        const newValidation = {};
        Object.keys(formData).forEach(key => {
            newValidation[key] = validateField(key, formData[key]);
        });
        setValidation(newValidation);

        if (!isFormValid()) {
            setError("Please fix the validation errors before submitting.");
            return;
        }

        setIsLoading(true);

        try {
            // Sanitize data before sending
            const sanitizedData = {
                name: formData.name.trim(),
                email: formData.email.toLowerCase().trim(),
                password: formData.password // Password hashing should be done server-side
            };

            // eslint-disable-next-line
            const response = await register(sanitizedData);
            
            // Success animation and redirect
            setTimeout(() => {
                navigate("/dashboard", { 
                    state: { message: "Registration successful! Welcome to TaskFlow." }
                });
            }, 1000);
            
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
            setError(errorMessage);
            
            // Shake animation on error
            const form = document.querySelector('.register-form');
            form.classList.add('shake-animation');
            setTimeout(() => form.classList.remove('shake-animation'), 500);
        } finally {
            setIsLoading(false);
        }
    };

    // Password strength indicator
    const getPasswordStrengthColor = () => {
        const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
        return colors[passwordStrength - 1] || 'bg-gray-300';
    };

    const getPasswordStrengthText = () => {
        const texts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
        return texts[passwordStrength - 1] || 'Very Weak';
    };

    return (
        <div className="min-h-screen py-5 flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-32 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0">
                {[...Array(15)].map((_, i) => (
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
                {/* Register Card */}
                <div className="register-form bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 transform transition-all duration-500">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center space-x-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <User className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                                TaskFlow
                            </h1>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
                        <p className="text-blue-100/80">Join thousands of productive teams</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center space-x-2 bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-xl mb-6 animate-fade-in">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-6">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-medium text-white">
                                <User className="w-4 h-4" />
                                <span>Full Name</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="name"
                                    className={`w-full px-4 py-3 pl-11 bg-white/10 border rounded-xl text-white placeholder-blue-200/60 focus:outline-none transition-all duration-300 ${
                                        touched.name && !validation.name.valid
                                            ? 'border-red-400 focus:ring-2 focus:ring-red-400'
                                            : 'border-white/20 focus:ring-2 focus:ring-blue-400 focus:border-transparent'
                                    }`}
                                    value={formData.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter your full name"
                                    required
                                />
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-200/60" />
                                {touched.name && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        {validation.name.valid ? (
                                            <CheckCircle className="w-5 h-5 text-green-400" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-red-400" />
                                        )}
                                    </div>
                                )}
                            </div>
                            {touched.name && validation.name.message && (
                                <p className="text-red-300 text-xs flex items-center space-x-1">
                                    <AlertCircle className="w-3 h-3" />
                                    <span>{validation.name.message}</span>
                                </p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-medium text-white">
                                <Mail className="w-4 h-4" />
                                <span>Email Address</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    name="email"
                                    className={`w-full px-4 py-3 pl-11 bg-white/10 border rounded-xl text-white placeholder-blue-200/60 focus:outline-none transition-all duration-300 ${
                                        touched.email && !validation.email.valid
                                            ? 'border-red-400 focus:ring-2 focus:ring-red-400'
                                            : 'border-white/20 focus:ring-2 focus:ring-blue-400 focus:border-transparent'
                                    }`}
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter your email"
                                    required
                                />
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-200/60" />
                                {touched.email && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        {validation.email.valid ? (
                                            <CheckCircle className="w-5 h-5 text-green-400" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-red-400" />
                                        )}
                                    </div>
                                )}
                            </div>
                            {touched.email && validation.email.message && (
                                <p className="text-red-300 text-xs flex items-center space-x-1">
                                    <AlertCircle className="w-3 h-3" />
                                    <span>{validation.email.message}</span>
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-3">
                            <label className="flex items-center space-x-2 text-sm font-medium text-white">
                                <Lock className="w-4 h-4" />
                                <span>Password</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    className={`w-full px-4 py-3 pl-11 pr-11 bg-white/10 border rounded-xl text-white placeholder-blue-200/60 focus:outline-none transition-all duration-300 ${
                                        touched.password && !validation.password.valid
                                            ? 'border-red-400 focus:ring-2 focus:ring-red-400'
                                            : 'border-white/20 focus:ring-2 focus:ring-blue-400 focus:border-transparent'
                                    }`}
                                    value={formData.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Create a strong password"
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

                            {/* Password Strength Indicator */}
                            {formData.password && (
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-blue-200">Password strength:</span>
                                        <span className={`font-medium ${
                                            passwordStrength <= 2 ? 'text-red-300' :
                                            passwordStrength <= 3 ? 'text-yellow-300' : 'text-green-300'
                                        }`}>
                                            {getPasswordStrengthText()}
                                        </span>
                                    </div>
                                    <div className="w-full bg-white/20 rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full transition-all duration-500 ${getPasswordStrengthColor()}`}
                                            style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}

                            {/* Password Requirements */}
                            {touched.password && (
                                <div className="space-y-2">
                                    {passwordRequirements.map(req => (
                                        <div key={req.id} className="flex items-center space-x-2 text-xs">
                                            {req.met(formData.password) ? (
                                                <CheckCircle className="w-3 h-3 text-green-400" />
                                            ) : (
                                                <XCircle className="w-3 h-3 text-red-400" />
                                            )}
                                            <span className={req.met(formData.password) ? 'text-green-300' : 'text-red-300'}>
                                                {req.text}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {touched.password && validation.password.message && (
                                <p className="text-red-300 text-xs flex items-center space-x-1">
                                    <AlertCircle className="w-3 h-3" />
                                    <span>{validation.password.message}</span>
                                </p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-medium text-white">
                                <Shield className="w-4 h-4" />
                                <span>Confirm Password</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    className={`w-full px-4 py-3 pl-11 pr-11 bg-white/10 border rounded-xl text-white placeholder-blue-200/60 focus:outline-none transition-all duration-300 ${
                                        touched.confirmPassword && !validation.confirmPassword.valid
                                            ? 'border-red-400 focus:ring-2 focus:ring-red-400'
                                            : 'border-white/20 focus:ring-2 focus:ring-blue-400 focus:border-transparent'
                                    }`}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Confirm your password"
                                    required
                                />
                                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-200/60" />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-200/60 hover:text-white transition-colors duration-200"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {touched.confirmPassword && validation.confirmPassword.message && (
                                <p className="text-red-300 text-xs flex items-center space-x-1">
                                    <AlertCircle className="w-3 h-3" />
                                    <span>{validation.confirmPassword.message}</span>
                                </p>
                            )}
                        </div>

                        {/* Terms Agreement */}
                        <div className="flex items-start space-x-3 p-3 bg-white/5 rounded-xl">
                            <div className="flex items-center h-5">
                                <input
                                    type="checkbox"
                                    required
                                    className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                                />
                            </div>
                            <label className="text-sm text-blue-100">
                                I agree to the{" "}
                                <Link to="/terms" className="text-white hover:underline">Terms of Service</Link>
                                {" "}and{" "}
                                <Link to="/privacy" className="text-white hover:underline">Privacy Policy</Link>
                            </label>
                        </div>

                        {/* Register Button */}
                        <button
                            type="submit"
                            disabled={isLoading || !isFormValid()}
                            className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-3 px-4 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="text-center mt-6 pt-6 border-t border-white/20">
                        <p className="text-blue-100/80">
                            Already have an account?{" "}
                            <Link
                                to="/"
                                className="text-white font-semibold hover:text-blue-200 transition-colors duration-200 underline"
                            >
                                Sign in now
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="text-center mt-6">
                    <p className="text-blue-200/60 text-sm flex items-center justify-center space-x-1">
                        <Shield className="w-4 h-4" />
                        <span>Your data is securely encrypted and protected</span>
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

export default RegisterPage;
import React, { useState } from "react";
import { register } from "../service/authapi";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // Import eye icons

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
    const navigate = useNavigate();

    // Handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle registration
    const handleRegister = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            const response = await register(formData);
            console.log("Registration successful:", response);
            navigate("/dashboard"); // Redirect to login after success
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100" style={{"background":'linear-gradient(to bottom right, #4a90e2, #9013fe)'}}>
            <div className="bg-white shadow-xl rounded-2xl p-8 w-96" style={{"background":'linear-gradient(to bottom right,rgb(255, 255, 255),rgb(212, 212, 212))'}}>
                <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Register</h2>
                
                {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">{error}</div>}
                
                <form onSubmit={handleRegister}>
                    {/* Name */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-4 relative">
                        <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-10 text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-4 relative">
                        <label className="block text-sm font-medium text-gray-600 mb-1">Confirm Password</label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-10 text-gray-500"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/* Register Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        Register
                    </button>
                </form>

                {/* Redirect to Login */}
                <p className="text-center mt-4 text-sm text-gray-600">
                    Already have an account? <a href="/" className="text-blue-500 hover:underline">Login</a>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Shield, GraduationCap } from 'lucide-react';
import loginImg from '../assets/login.png';

const Signup = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await register(formData);
        setLoading(false);
        if (result.success) {
            navigate('/login');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
            {/* Left Side - Image */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20"></div>
                <img
                    src={loginImg}
                    alt="Signup Illustration"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-12">
                    <h2 className="text-4xl font-bold text-white mb-4">Join MockTest Today</h2>
                    <p className="text-white/70 text-lg max-w-md">Create your account and start your journey towards academic excellence with our comprehensive testing platform.</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                        <p className="text-white/50">Fill in your details to get started</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-white/70 mb-2 text-sm">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full p-4 pl-12 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-white/70 mb-2 text-sm">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-4 pl-12 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-white/70 mb-2 text-sm">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full p-4 pl-12 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-white/70 mb-2 text-sm">I am a</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'student' })}
                                    className={`p-4 rounded-xl border-2 flex items-center justify-center gap-2 transition ${formData.role === 'student'
                                            ? 'border-indigo-500 bg-indigo-500/20 text-white'
                                            : 'border-white/20 text-white/50 hover:border-white/40'
                                        }`}
                                >
                                    <GraduationCap size={20} /> Student
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'admin' })}
                                    className={`p-4 rounded-xl border-2 flex items-center justify-center gap-2 transition ${formData.role === 'admin'
                                            ? 'border-purple-500 bg-purple-500/20 text-white'
                                            : 'border-white/20 text-white/50 hover:border-white/40'
                                        }`}
                                >
                                    <Shield size={20} /> Admin
                                </button>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold py-4 rounded-xl hover:opacity-90 transition duration-200 flex justify-center items-center gap-2 shadow-lg disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>Create Account <ArrowRight size={20} /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-white/50">
                            Already have an account?{' '}
                            <Link to="/login" className="text-indigo-400 font-semibold hover:text-indigo-300 transition">
                                Sign In
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/10 text-center">
                        <p className="text-white/30 text-xs">© 2026 MockTest Platform. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;

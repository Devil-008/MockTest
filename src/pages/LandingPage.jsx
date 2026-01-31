import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Users, Clock, Shield, BookOpen, Award, Zap } from 'lucide-react';
import heroImg from '../assets/landingpage1.png';
import teamImg from '../assets/landingpage2.png';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <BookOpen className="text-blue-400" size={28} />
                        <span className="text-xl font-bold text-white">MockTest</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-white/70 hover:text-white transition px-4 py-2">
                            Sign In
                        </Link>
                        <Link to="/signup" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full font-semibold hover:opacity-90 transition">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-block px-4 py-2 bg-blue-500/20 rounded-full text-blue-400 text-sm font-semibold mb-6">
                            🚀 #1 Mock Test Platform
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                            Welcome to the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">MockTest</span> Application
                        </h1>
                        <p className="text-xl text-white/60 mb-8 leading-relaxed">
                            Empower your learning journey with our comprehensive testing platform. Create, manage, and take mock tests with real-time analytics.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/signup" className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-bold hover:opacity-90 transition shadow-lg shadow-blue-500/25">
                                Start Testing <ArrowRight size={20} />
                            </Link>
                            <Link to="/login" className="flex items-center gap-2 bg-white/10 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition border border-white/20">
                                Sign In
                            </Link>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-2xl opacity-30"></div>
                        <img src={heroImg} alt="Students Learning" className="relative rounded-3xl shadow-2xl" />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6 bg-slate-900/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">Why Choose MockTest?</h2>
                        <p className="text-white/50 text-lg max-w-2xl mx-auto">Everything you need to create, manage, and excel at mock tests</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:border-blue-500/50 transition group">
                            <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/30 transition">
                                <Clock className="text-blue-400" size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Timed Exams</h3>
                            <p className="text-white/50">Real exam experience with customizable timers and auto-submit functionality.</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition group">
                            <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500/30 transition">
                                <Shield className="text-purple-400" size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Anti-Cheat System</h3>
                            <p className="text-white/50">Tab-switch detection ensures fair testing environment for all students.</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:border-green-500/50 transition group">
                            <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-500/30 transition">
                                <Award className="text-green-400" size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Instant Results</h3>
                            <p className="text-white/50">Get detailed analytics and performance insights immediately after submission.</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:border-orange-500/50 transition group">
                            <div className="w-14 h-14 bg-orange-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-500/30 transition">
                                <Zap className="text-orange-400" size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Bulk Upload</h3>
                            <p className="text-white/50">Upload questions via CSV, Excel, or PDF with smart parsing support.</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:border-pink-500/50 transition group">
                            <div className="w-14 h-14 bg-pink-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-pink-500/30 transition">
                                <Users className="text-pink-400" size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Room System</h3>
                            <p className="text-white/50">Create exam rooms with unique codes and manage multiple tests easily.</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:border-cyan-500/50 transition group">
                            <div className="w-14 h-14 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cyan-500/30 transition">
                                <CheckCircle className="text-cyan-400" size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Auto-Save</h3>
                            <p className="text-white/50">Never lose progress with automatic answer saving during exams.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team/Collaboration Section */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                    <div className="relative order-2 lg:order-1">
                        <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-20"></div>
                        <img src={teamImg} alt="Team Collaboration" className="relative rounded-3xl shadow-2xl" />
                    </div>
                    <div className="order-1 lg:order-2">
                        <h2 className="text-4xl font-bold text-white mb-6">
                            Empowering students for success together!
                        </h2>
                        <p className="text-xl text-white/60 mb-8 leading-relaxed">
                            Our platform brings teachers and students together for a seamless testing experience. Prepare for your future with comprehensive mock tests.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-white/80">
                                <CheckCircle className="text-green-400" size={20} />
                                Real-time exam monitoring
                            </li>
                            <li className="flex items-center gap-3 text-white/80">
                                <CheckCircle className="text-green-400" size={20} />
                                Detailed performance analytics
                            </li>
                            <li className="flex items-center gap-3 text-white/80">
                                <CheckCircle className="text-green-400" size={20} />
                                Custom marking schemes
                            </li>
                            <li className="flex items-center gap-3 text-white/80">
                                <CheckCircle className="text-green-400" size={20} />
                                Accessible on all devices
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-10"></div>
                    <h2 className="text-4xl font-bold text-white mb-4 relative">
                        Ready to Start Testing?
                    </h2>
                    <p className="text-xl text-white/80 mb-8 relative">
                        Join thousands of students and educators using MockTest daily
                    </p>
                    <Link to="/signup" className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-white/90 transition shadow-lg relative">
                        Create Free Account <ArrowRight size={20} />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <BookOpen className="text-blue-400" size={24} />
                        <span className="text-lg font-bold text-white">MockTest</span>
                    </div>
                    <p className="text-white/40 text-sm">© 2026 MockTest Platform. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <Link to="/privacy" className="text-white/50 hover:text-white transition text-sm">Privacy</Link>
                        <Link to="/terms" className="text-white/50 hover:text-white transition text-sm">Terms</Link>
                        <Link to="/contact" className="text-white/50 hover:text-white transition text-sm">Contact</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;

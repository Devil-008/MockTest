import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, FileText } from 'lucide-react';

const TermsPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            {/* Navbar */}
            <nav className="bg-white/10 backdrop-blur-lg border-b border-white/10">
                <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <BookOpen className="text-blue-400" size={24} />
                        <span className="text-xl font-bold text-white">MockTest</span>
                    </Link>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-12">
                <Link to="/" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8 text-sm">
                    <ArrowLeft size={16} /> Back to Home
                </Link>

                <div className="flex items-center gap-3 mb-6">
                    <FileText className="text-blue-400" size={32} />
                    <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
                </div>

                <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/10 text-white/80 space-y-6">
                    <p className="text-white/50 text-sm">Last updated: January 30, 2026</p>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
                        <p>By accessing and using MockTest, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our service.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">2. Use of Service</h2>
                        <p>You agree to use the service only for lawful purposes and in accordance with these Terms. You are responsible for:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                            <li>Maintaining the confidentiality of your account</li>
                            <li>All activities that occur under your account</li>
                            <li>Not sharing exam content or answers</li>
                            <li>Not attempting to circumvent anti-cheat measures</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">3. User Accounts</h2>
                        <p>When you create an account, you must provide accurate and complete information. You are solely responsible for the activity on your account and must keep your password secure.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">4. Intellectual Property</h2>
                        <p>The service and its original content, features, and functionality are owned by MockTest and are protected by international copyright, trademark, and other intellectual property laws.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">5. Exam Conduct</h2>
                        <p>During exams, you agree to:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                            <li>Complete exams independently without external assistance</li>
                            <li>Not use unauthorized materials or resources</li>
                            <li>Accept automated monitoring including tab-switch detection</li>
                            <li>Submit your own original work</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">6. Termination</h2>
                        <p>We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">7. Contact</h2>
                        <p>For any questions regarding these Terms, contact us at <a href="mailto:legal@mocktest.com" className="text-blue-400 hover:underline">legal@mocktest.com</a></p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsPage;

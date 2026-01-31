import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Shield } from 'lucide-react';

const PrivacyPage = () => {
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
                    <Shield className="text-blue-400" size={32} />
                    <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
                </div>

                <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/10 text-white/80 space-y-6">
                    <p className="text-white/50 text-sm">Last updated: January 30, 2026</p>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">1. Information We Collect</h2>
                        <p>We collect information you provide directly to us, such as when you create an account, take a test, or contact us. This includes:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                            <li>Name and email address</li>
                            <li>Account credentials</li>
                            <li>Test responses and scores</li>
                            <li>Usage data and preferences</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">2. How We Use Your Information</h2>
                        <p>We use the information we collect to:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                            <li>Provide, maintain, and improve our services</li>
                            <li>Process and store your test results</li>
                            <li>Communicate with you about your account</li>
                            <li>Monitor and analyze usage patterns</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">3. Data Security</h2>
                        <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">4. Data Retention</h2>
                        <p>We retain your personal information for as long as your account is active or as needed to provide you services. You may request deletion of your data at any time.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">5. Contact Us</h2>
                        <p>If you have questions about this Privacy Policy, please contact us at <a href="mailto:privacy@mocktest.com" className="text-blue-400 hover:underline">privacy@mocktest.com</a></p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPage;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Mail, Phone, MapPin, Send, MessageSquare, Loader2 } from 'lucide-react';
import client from '../api/client';

const ContactPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await client.post('/contact/send', formData);
            setSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setSubmitted(false), 5000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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
                    <MessageSquare className="text-blue-400" size={32} />
                    <h1 className="text-3xl font-bold text-white">Contact Us</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
                            <h2 className="text-xl font-bold text-white mb-4">Get in Touch</h2>
                            <p className="text-white/60 mb-6">Have questions or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                        <Mail className="text-blue-400" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-white/50 text-sm">Email</p>
                                        <a href="mailto:support@mocktest.com" className="text-white hover:text-blue-400 transition">support@mocktest.com</a>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                                        <Phone className="text-green-400" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-white/50 text-sm">Phone</p>
                                        <p className="text-white">+91 1234 567 890</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                        <MapPin className="text-purple-400" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-white/50 text-sm">Address</p>
                                        <p className="text-white">123 Education St, Learning City</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 rounded-2xl border border-blue-500/20">
                            <h3 className="text-lg font-bold text-white mb-2">Business Hours</h3>
                            <p className="text-white/60 text-sm">Monday - Friday: 9:00 AM - 6:00 PM</p>
                            <p className="text-white/60 text-sm">Saturday: 10:00 AM - 4:00 PM</p>
                            <p className="text-white/60 text-sm">Sunday: Closed</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
                        <h2 className="text-xl font-bold text-white mb-4">Send a Message</h2>

                        {submitted && (
                            <div className="bg-green-500/20 border border-green-500/30 text-green-400 p-4 rounded-xl mb-4">
                                Thank you! Your message has been sent successfully.
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-xl mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-white/70 mb-2 text-sm">Your Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full p-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-blue-500 outline-none"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-white/70 mb-2 text-sm">Email Address</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full p-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-blue-500 outline-none"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-white/70 mb-2 text-sm">Subject</label>
                                <input
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full p-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-blue-500 outline-none"
                                    placeholder="How can we help?"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-white/70 mb-2 text-sm">Message</label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full p-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-blue-500 outline-none h-32 resize-none"
                                    placeholder="Your message..."
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 rounded-xl hover:opacity-90 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} /> Sending...
                                    </>
                                ) : (
                                    <>
                                        Send Message <Send size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;

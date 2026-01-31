import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Plus, Minus } from 'lucide-react';

const CreateRoom = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        test_duration: 60,
        marking_scheme_correct: 1,
        marking_scheme_incorrect: 0
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await client.post('/rooms/create', {
                admin_id: user.id,
                ...formData
            });
            navigate('/admin');
        } catch (error) {
            alert("Failed to create room");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/10 w-full max-w-lg shadow-2xl">
                <Link to="/admin" className="flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-6 text-sm">
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>

                <h2 className="text-2xl font-bold mb-6 text-white">Create New Exam Room</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-white/70 mb-2 text-sm">Test Duration (minutes)</label>
                        <div className="relative">
                            <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
                            <input
                                type="number"
                                value={formData.test_duration}
                                onChange={(e) => setFormData({ ...formData, test_duration: e.target.value })}
                                className="w-full p-4 pl-12 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-white/70 mb-2 text-sm flex items-center gap-2">
                                <Plus size={16} className="text-green-400" /> Correct Marks
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                value={formData.marking_scheme_correct}
                                onChange={(e) => setFormData({ ...formData, marking_scheme_correct: e.target.value })}
                                className="w-full p-4 bg-white/5 border border-white/20 rounded-xl text-white focus:border-green-500/50 outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-white/70 mb-2 text-sm flex items-center gap-2">
                                <Minus size={16} className="text-red-400" /> Negative Marks
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                value={formData.marking_scheme_incorrect}
                                onChange={(e) => setFormData({ ...formData, marking_scheme_incorrect: e.target.value })}
                                className="w-full p-4 bg-white/5 border border-white/20 rounded-xl text-white focus:border-red-500/50 outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/admin')}
                            className="px-6 py-3 border border-white/20 rounded-xl text-white/70 hover:bg-white/5 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:opacity-90 shadow-lg"
                        >
                            Create Room
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateRoom;

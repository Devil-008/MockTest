import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import { useNavigate, Link } from 'react-router-dom';
import { Play, LogOut, Trophy, Clock, User, ArrowRight, BookOpen, TrendingUp, CheckCircle, XCircle, BarChart3, Mail, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, Legend } from 'recharts';

const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [roomKey, setRoomKey] = useState('');
    const [pastExams, setPastExams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPastExams();
    }, []);

    const fetchPastExams = async () => {
        try {
            const res = await client.get(`/exam/student/${user.id}`);
            setPastExams(res.data || []);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch past exams", error);
            setLoading(false);
        }
    };

    const joinRoom = async (e) => {
        e.preventDefault();
        try {
            const res = await client.get(`/rooms/${roomKey}`);
            if (res.data.status !== 'active') {
                alert("Room is not active or closed.");
                return;
            }
            navigate(`/student/exam/${roomKey}`);
        } catch (error) {
            alert("Room not found or error joining.");
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const formatTime = (seconds) => {
        if (!seconds) return '--';
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}s`;
    };

    // Compute statistics
    const totalExams = pastExams.length;
    const totalScore = pastExams.reduce((a, b) => a + (b.score || 0), 0);
    const avgScore = totalExams > 0 ? (totalScore / totalExams).toFixed(1) : 0;
    const bestScore = totalExams > 0 ? Math.max(...pastExams.map(e => e.score || 0)).toFixed(1) : 0;
    const avgTime = totalExams > 0 ? Math.round(pastExams.reduce((a, b) => a + (b.time_taken || 0), 0) / totalExams) : 0;

    // Compute total correct/incorrect/unattempted across all exams
    let totalCorrect = 0, totalIncorrect = 0, totalUnattempted = 0;
    pastExams.forEach(exam => {
        const report = exam.detailed_report || [];
        report.forEach(r => {
            if (r.outcome === 'correct') totalCorrect++;
            else if (r.outcome === 'incorrect') totalIncorrect++;
            else totalUnattempted++;
        });
    });

    // Chart data - Score trend over time
    const scoreTrendData = pastExams.slice().reverse().map((exam, idx) => ({
        name: `Exam ${idx + 1}`,
        score: exam.score || 0,
        room: exam.room_key
    }));

    // Pie chart data for performance breakdown
    const pieData = [
        { name: 'Correct', value: totalCorrect, fill: '#22c55e' },
        { name: 'Incorrect', value: totalIncorrect, fill: '#ef4444' },
        { name: 'Unattempted', value: totalUnattempted, fill: '#6b7280' },
    ].filter(d => d.value > 0);

    // Bar chart for recent 5 exams
    const recentExamsBar = pastExams.slice(0, 5).map((exam, idx) => ({
        name: exam.room_key || `Exam ${idx + 1}`,
        score: exam.score || 0,
        fill: exam.score >= 0 ? '#3b82f6' : '#ef4444'
    }));

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            {/* Navbar */}
            <nav className="bg-white/10 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <BookOpen className="text-blue-400" /> Student Portal
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 text-white/70">
                            <User size={18} />
                            <span>{user.name}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition border border-red-500/30"
                        >
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto p-6">
                {/* Student Profile Card */}
                <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/10 mb-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-4xl font-bold text-white">
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                            <div className="flex flex-wrap gap-4 mt-2 text-white/60 text-sm">
                                <span className="flex items-center gap-1"><Mail size={14} /> {user.email}</span>
                                <span className="flex items-center gap-1"><User size={14} /> Student (ID: {user.id})</span>
                                <span className="flex items-center gap-1"><Calendar size={14} /> Joined: {new Date().toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="px-4">
                                <p className="text-3xl font-bold text-blue-400">{totalExams}</p>
                                <p className="text-xs text-white/50">Exams</p>
                            </div>
                            <div className="px-4 border-l border-r border-white/10">
                                <p className="text-3xl font-bold text-green-400">{avgScore}</p>
                                <p className="text-xs text-white/50">Avg Score</p>
                            </div>
                            <div className="px-4">
                                <p className="text-3xl font-bold text-purple-400">{bestScore}</p>
                                <p className="text-xs text-white/50">Best</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Join Exam */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
                            <div className="text-center mb-6">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <Play size={28} className="text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-white">Join Exam</h2>
                                <p className="text-white/50 text-sm mt-1">Enter room key</p>
                            </div>

                            <form onSubmit={joinRoom} className="space-y-4">
                                <input
                                    value={roomKey}
                                    onChange={e => setRoomKey(e.target.value.toUpperCase())}
                                    placeholder="XXXXXX"
                                    className="w-full text-center text-2xl tracking-[0.3em] p-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-blue-500 outline-none uppercase font-mono"
                                    maxLength={6}
                                    required
                                />
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 rounded-xl hover:opacity-90 flex justify-center items-center gap-2 shadow-lg"
                                >
                                    Start Exam <ArrowRight size={18} />
                                </button>
                            </form>
                        </div>

                        {/* Performance Pie Chart */}
                        {totalExams > 0 && (
                            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <BarChart3 size={18} className="text-blue-400" /> Overall Performance
                                </h3>
                                <div className="h-48">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={40}
                                                outerRadius={70}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}
                                                itemStyle={{ color: '#fff' }}
                                            />
                                            <Legend
                                                formatter={(value) => <span style={{ color: '#fff' }}>{value}</span>}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="grid grid-cols-3 gap-2 mt-4 text-center text-xs">
                                    <div className="p-2 bg-green-500/20 rounded-lg">
                                        <p className="text-green-400 font-bold">{totalCorrect}</p>
                                        <p className="text-white/50">Correct</p>
                                    </div>
                                    <div className="p-2 bg-red-500/20 rounded-lg">
                                        <p className="text-red-400 font-bold">{totalIncorrect}</p>
                                        <p className="text-white/50">Wrong</p>
                                    </div>
                                    <div className="p-2 bg-gray-500/20 rounded-lg">
                                        <p className="text-gray-400 font-bold">{totalUnattempted}</p>
                                        <p className="text-white/50">Skipped</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Charts & History */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Quick Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 p-4 rounded-xl border border-green-500/20">
                                <div className="flex items-center gap-3">
                                    <Trophy size={24} className="text-green-400" />
                                    <div>
                                        <p className="text-green-200/70 text-xs">Exams Taken</p>
                                        <p className="text-xl font-bold text-green-400">{totalExams}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 p-4 rounded-xl border border-blue-500/20">
                                <div className="flex items-center gap-3">
                                    <Clock size={24} className="text-blue-400" />
                                    <div>
                                        <p className="text-blue-200/70 text-xs">Avg. Time</p>
                                        <p className="text-xl font-bold text-blue-400">{formatTime(avgTime)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 p-4 rounded-xl border border-purple-500/20">
                                <div className="flex items-center gap-3">
                                    <TrendingUp size={24} className="text-purple-400" />
                                    <div>
                                        <p className="text-purple-200/70 text-xs">Avg. Score</p>
                                        <p className="text-xl font-bold text-purple-400">{avgScore}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 p-4 rounded-xl border border-yellow-500/20">
                                <div className="flex items-center gap-3">
                                    <CheckCircle size={24} className="text-yellow-400" />
                                    <div>
                                        <p className="text-yellow-200/70 text-xs">Accuracy</p>
                                        <p className="text-xl font-bold text-yellow-400">
                                            {(totalCorrect + totalIncorrect) > 0
                                                ? Math.round((totalCorrect / (totalCorrect + totalIncorrect)) * 100)
                                                : 0}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Score Trend Chart */}
                        {totalExams > 1 && (
                            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <TrendingUp size={18} className="text-blue-400" /> Score Trend
                                </h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={scoreTrendData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                            <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 12 }} />
                                            <YAxis stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 12 }} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}
                                                itemStyle={{ color: '#fff' }}
                                                labelFormatter={(value, payload) => payload?.[0]?.payload?.room || value}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="score"
                                                stroke="#3b82f6"
                                                strokeWidth={3}
                                                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                                                activeDot={{ r: 8, fill: '#60a5fa' }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}

                        {/* Recent Exams Bar Chart */}
                        {totalExams > 0 && (
                            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <BarChart3 size={18} className="text-purple-400" /> Recent Exams Scores
                                </h3>
                                <div className="h-48">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={recentExamsBar} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                            <XAxis type="number" stroke="rgba(255,255,255,0.4)" />
                                            <YAxis dataKey="name" type="category" width={80} stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 11 }} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}
                                                itemStyle={{ color: '#fff' }}
                                            />
                                            <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                                                {recentExamsBar.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}

                        {/* Exam History List */}
                        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Trophy size={18} className="text-yellow-400" /> Exam History
                            </h3>

                            {loading ? (
                                <div className="text-center py-10 text-white/40">Loading...</div>
                            ) : pastExams.length === 0 ? (
                                <div className="text-center py-10 text-white/40">
                                    <BookOpen size={40} className="mx-auto mb-3 opacity-50" />
                                    <p>No exams taken yet. Join a room to get started!</p>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                    {pastExams.map((exam, idx) => {
                                        const report = exam.detailed_report || [];
                                        const correct = report.filter(r => r.outcome === 'correct').length;
                                        const total = report.length;

                                        return (
                                            <div key={idx} className="bg-white/5 p-4 rounded-xl flex justify-between items-center hover:bg-white/10 transition">
                                                <div className="flex-1">
                                                    <p className="text-white font-semibold flex items-center gap-2">
                                                        <span className="text-blue-400">#{idx + 1}</span> Room: {exam.room_key || 'N/A'}
                                                    </p>
                                                    <div className="flex gap-4 text-white/50 text-sm mt-1">
                                                        <span className="flex items-center gap-1"><Clock size={12} /> {formatTime(exam.time_taken)}</span>
                                                        <span className="flex items-center gap-1"><CheckCircle size={12} className="text-green-400" /> {correct}/{total}</span>
                                                        <span className="text-white/30">{new Date(exam.submitted_at).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`text-2xl font-bold ${exam.score >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                        {exam.score?.toFixed(1)}
                                                    </p>
                                                    <p className="text-white/40 text-xs">Score</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;

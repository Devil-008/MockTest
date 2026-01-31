import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Lock, Unlock, BarChart2, LogOut, Users, CheckSquare, Clock, Calendar, FileText, TrendingUp, Award, User } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [rooms, setRooms] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [roomsRes, statsRes] = await Promise.all([
                client.get(`/rooms/admin/${user.id}`),
                client.get(`/rooms/admin/${user.id}/stats`)
            ]);
            setRooms(roomsRes.data);
            setStats(statsRes.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch data", error);
            setLoading(false);
        }
    };

    const toggleRoomStatus = async (roomKey, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'closed' : 'active';
        try {
            await client.put(`/rooms/${roomKey}/status`, { status: newStatus });
            fetchData();
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Chart data
    const roomStatusPie = stats ? [
        { name: 'Active', value: stats.active_rooms, fill: '#22c55e' },
        { name: 'Closed', value: stats.closed_rooms, fill: '#ef4444' },
    ].filter(d => d.value > 0) : [];

    const roomStatsBar = stats?.room_stats?.map(r => ({
        name: r.room_key,
        submissions: r.submissions,
        questions: r.questions,
        avgScore: r.avg_score?.toFixed(1) || 0
    })) || [];

    const submissionsTrend = stats?.recent_submissions?.slice(0, 20).reverse().map((s, idx) => ({
        name: `#${idx + 1}`,
        score: s.score,
        room: s.room_key
    })) || [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Navbar */}
            <nav className="bg-white/10 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <BarChart2 className="text-purple-400" /> Admin Portal
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="text-white/70 hidden md:block">Welcome, {user.name}</span>
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
                {loading ? (
                    <div className="text-center py-20 text-white/50">Loading dashboard...</div>
                ) : (
                    <>
                        {/* Admin Profile Card */}
                        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/10 mb-6">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-4xl font-bold text-white">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                                    <div className="flex flex-wrap gap-4 mt-2 text-white/60 text-sm">
                                        <span className="flex items-center gap-1"><User size={14} /> Admin (ID: {user.id})</span>
                                        <span className="flex items-center gap-1"><Calendar size={14} /> {user.email}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-xl shadow-lg text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-100 text-xs">Total Rooms</p>
                                        <p className="text-3xl font-bold">{stats?.total_rooms || 0}</p>
                                    </div>
                                    <Calendar size={32} className="text-blue-200/50" />
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-green-500 to-green-600 p-5 rounded-xl shadow-lg text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-100 text-xs">Active</p>
                                        <p className="text-3xl font-bold">{stats?.active_rooms || 0}</p>
                                    </div>
                                    <CheckSquare size={32} className="text-green-200/50" />
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-red-500 to-red-600 p-5 rounded-xl shadow-lg text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-red-100 text-xs">Closed</p>
                                        <p className="text-3xl font-bold">{stats?.closed_rooms || 0}</p>
                                    </div>
                                    <Lock size={32} className="text-red-200/50" />
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-5 rounded-xl shadow-lg text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-orange-100 text-xs">Questions</p>
                                        <p className="text-3xl font-bold">{stats?.total_questions || 0}</p>
                                    </div>
                                    <FileText size={32} className="text-orange-200/50" />
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-5 rounded-xl shadow-lg text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-100 text-xs">Submissions</p>
                                        <p className="text-3xl font-bold">{stats?.total_submissions || 0}</p>
                                    </div>
                                    <TrendingUp size={32} className="text-purple-200/50" />
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-5 rounded-xl shadow-lg text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-pink-100 text-xs">Students</p>
                                        <p className="text-3xl font-bold">{stats?.unique_students || 0}</p>
                                    </div>
                                    <Users size={32} className="text-pink-200/50" />
                                </div>
                            </div>
                        </div>

                        {/* Charts Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            {/* Room Status Pie */}
                            {roomStatusPie.length > 0 && (
                                <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                        <BarChart2 size={18} className="text-purple-400" /> Room Status
                                    </h3>
                                    <div className="h-48">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={roomStatusPie}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={40}
                                                    outerRadius={70}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                    label={({ name, value }) => `${name}: ${value}`}
                                                >
                                                    {roomStatusPie.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}
                                                    itemStyle={{ color: '#fff' }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )}

                            {/* Submissions per Room */}
                            {roomStatsBar.length > 0 && (
                                <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                        <Users size={18} className="text-blue-400" /> Submissions per Room
                                    </h3>
                                    <div className="h-48">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={roomStatsBar}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 11 }} />
                                                <YAxis stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 11 }} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}
                                                    itemStyle={{ color: '#fff' }}
                                                />
                                                <Bar dataKey="submissions" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Score Trend Chart */}
                        {submissionsTrend.length > 0 && (
                            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/10 mb-6">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <TrendingUp size={18} className="text-green-400" /> Recent Submission Scores
                                </h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={submissionsTrend}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                            <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 11 }} />
                                            <YAxis stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 11 }} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}
                                                itemStyle={{ color: '#fff' }}
                                                labelFormatter={(value, payload) => payload?.[0]?.payload?.room || value}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="score"
                                                stroke="#22c55e"
                                                strokeWidth={2}
                                                dot={{ fill: '#22c55e', r: 4 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}

                        {/* Recent Submissions Table */}
                        {stats?.recent_submissions?.length > 0 && (
                            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/10 mb-6">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        <Award size={18} className="text-yellow-400" /> Recent Submissions
                                    </h3>
                                    <div className="relative w-full md:w-64">
                                        <input
                                            type="text"
                                            placeholder="Search student or room..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:border-purple-500 outline-none text-sm"
                                        />
                                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-white/50 text-sm border-b border-white/10">
                                                <th className="pb-3 pr-4">Student</th>
                                                <th className="pb-3 pr-4">Room</th>
                                                <th className="pb-3 pr-4">Score</th>
                                                <th className="pb-3 pr-4">Time</th>
                                                <th className="pb-3">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stats.recent_submissions
                                                .filter(sub =>
                                                    sub.student_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                    sub.room_key?.toLowerCase().includes(searchQuery.toLowerCase())
                                                )
                                                .slice(0, 10)
                                                .map((sub, idx) => (
                                                    <tr key={idx} className="border-b border-white/5 text-white/80">
                                                        <td className="py-3 pr-4">{sub.student_name}</td>
                                                        <td className="py-3 pr-4 text-purple-400 font-mono">{sub.room_key}</td>
                                                        <td className={`py-3 pr-4 font-bold ${sub.score >= 0 ? 'text-green-400' : 'text-red-400'}`}>{sub.score?.toFixed(1)}</td>
                                                        <td className="py-3 pr-4 text-white/50">{Math.floor(sub.time_taken / 60)}m {sub.time_taken % 60}s</td>
                                                        <td className="py-3 text-white/40 text-sm">{new Date(sub.submitted_at).toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Actions Bar */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Your Exam Rooms</h2>
                            <Link
                                to="/admin/create-room"
                                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-3 rounded-xl hover:opacity-90 transition shadow-lg font-semibold"
                            >
                                <Plus size={20} /> Create New Room
                            </Link>
                        </div>

                        {/* Room Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {rooms.map((room) => {
                                const roomStat = stats?.room_stats?.find(r => r.room_key === room.room_key);
                                return (
                                    <div key={room.id} className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/10 hover:border-purple-500/50 transition group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition">{room.room_key}</h3>
                                                <div className="flex items-center gap-2 mt-1 text-white/60 text-sm">
                                                    <Clock size={14} />
                                                    <span>{room.test_duration} mins</span>
                                                </div>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-xs font-bold ${room.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                                                {room.status.toUpperCase()}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 text-center text-xs mb-4">
                                            <div className="bg-white/5 p-2 rounded-lg">
                                                <p className="text-purple-400 font-bold">{roomStat?.questions || 0}</p>
                                                <p className="text-white/40">Questions</p>
                                            </div>
                                            <div className="bg-white/5 p-2 rounded-lg">
                                                <p className="text-blue-400 font-bold">{roomStat?.submissions || 0}</p>
                                                <p className="text-white/40">Attempts</p>
                                            </div>
                                            <div className="bg-white/5 p-2 rounded-lg">
                                                <p className="text-green-400 font-bold">{roomStat?.avg_score?.toFixed(1) || '--'}</p>
                                                <p className="text-white/40">Avg Score</p>
                                            </div>
                                        </div>

                                        <div className="text-white/50 text-sm mb-4">
                                            Marks: +{room.marking_scheme_correct} / -{room.marking_scheme_incorrect}
                                        </div>

                                        <div className="flex justify-between items-center pt-4 border-t border-white/10">
                                            <button
                                                onClick={() => toggleRoomStatus(room.room_key, room.status)}
                                                className={`flex items-center gap-1 text-sm px-3 py-2 rounded-lg transition ${room.status === 'active' ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'}`}
                                            >
                                                {room.status === 'active' ? <Lock size={14} /> : <Unlock size={14} />}
                                                {room.status === 'active' ? 'Close' : 'Open'}
                                            </button>
                                            <Link to={`/admin/room/${room.room_key}`} className="flex items-center gap-1 text-sm text-purple-400 font-semibold hover:text-purple-300 transition">
                                                <BarChart2 size={14} /> Manage
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}

                            {rooms.length === 0 && (
                                <div className="col-span-full text-center py-20 text-white/50">
                                    <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                                    <p>No rooms created yet. Start by creating one!</p>
                                </div>
                            )}
                        </div>

                        {/* System Stats */}
                        <div className="mt-8 bg-white/5 backdrop-blur-lg p-4 rounded-xl border border-white/10 flex flex-wrap gap-6 justify-center text-center">
                            <div>
                                <p className="text-white/40 text-xs">Total Students (System)</p>
                                <p className="text-lg font-bold text-white">{stats?.total_students_system || 0}</p>
                            </div>
                            <div>
                                <p className="text-white/40 text-xs">Total Admins</p>
                                <p className="text-lg font-bold text-white">{stats?.total_admins || 0}</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;

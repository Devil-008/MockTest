import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../api/client';
import { CheckCircle, XCircle, AlertTriangle, ArrowLeft, Trophy, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const ResultPage = () => {
    const { studentId } = useParams();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await client.get(`/exam/student/${studentId}`);
                setResults(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch results", error);
                setLoading(false);
            }
        };
        fetchResults();
    }, [studentId]);

    if (loading) return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8 text-white">Loading Results...</div>;
    if (results.length === 0) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8 flex flex-col items-center justify-center text-white">
            <Trophy size={64} className="text-white/20 mb-4" />
            <p className="text-white/50">No exams taken yet.</p>
            <Link to="/student" className="mt-4 text-blue-400 hover:text-blue-300">Go to Dashboard</Link>
        </div>
    );

    const latestResult = results[0];

    const report = Array.isArray(latestResult.detailed_report)
        ? latestResult.detailed_report
        : JSON.parse(latestResult.detailed_report || '[]');

    const correctC = report.filter(r => r.outcome === 'correct').length;
    const incorrectC = report.filter(r => r.outcome === 'incorrect').length;
    const unattemptedC = report.filter(r => r.outcome === 'unattempted').length;

    const chartData = [
        { name: 'Correct', count: correctC, fill: '#22c55e' },
        { name: 'Incorrect', count: incorrectC, fill: '#ef4444' },
        { name: 'Skipped', count: unattemptedC, fill: '#6b7280' },
    ];

    const formatTime = (seconds) => {
        if (!seconds) return '--';
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}s`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
            <div className="max-w-4xl mx-auto">
                <Link to="/student" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 text-sm">
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>

                <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                    <Trophy className="text-yellow-400" /> Exam Results
                </h1>

                {/* Main Result Card */}
                <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/10 mb-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Room: {latestResult.room_key}</h2>
                            <p className="text-white/50 text-sm flex items-center gap-2 mt-1">
                                <Clock size={14} /> Submitted: {new Date(latestResult.submitted_at).toLocaleString()}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className={`text-5xl font-bold ${latestResult.score >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {latestResult.score.toFixed(1)}
                            </div>
                            <p className="text-sm text-white/50 uppercase tracking-widest">Total Score</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="p-4 bg-green-500/20 rounded-xl border border-green-500/30 text-center">
                            <div className="text-green-400 font-bold text-2xl flex justify-center items-center gap-2">
                                <CheckCircle size={24} /> {correctC}
                            </div>
                            <p className="text-xs text-green-300/70 mt-1">Correct</p>
                        </div>
                        <div className="p-4 bg-red-500/20 rounded-xl border border-red-500/30 text-center">
                            <div className="text-red-400 font-bold text-2xl flex justify-center items-center gap-2">
                                <XCircle size={24} /> {incorrectC}
                            </div>
                            <p className="text-xs text-red-300/70 mt-1">Incorrect</p>
                        </div>
                        <div className="p-4 bg-gray-500/20 rounded-xl border border-gray-500/30 text-center">
                            <div className="text-gray-400 font-bold text-2xl flex justify-center items-center gap-2">
                                <AlertTriangle size={24} /> {unattemptedC}
                            </div>
                            <p className="text-xs text-gray-300/70 mt-1">Skipped</p>
                        </div>
                    </div>

                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis type="number" stroke="rgba(255,255,255,0.3)" />
                                <YAxis dataKey="name" type="category" width={80} stroke="rgba(255,255,255,0.5)" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={30}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Previous Exams */}
                {results.length > 1 && (
                    <>
                        <h3 className="text-xl font-bold text-white mb-4">Previous Exams</h3>
                        <div className="space-y-3">
                            {results.slice(1).map(res => (
                                <div key={res.id} className="bg-white/10 backdrop-blur-lg p-4 rounded-xl border border-white/10 flex justify-between items-center">
                                    <div>
                                        <h4 className="font-bold text-white">{res.room_key}</h4>
                                        <p className="text-xs text-white/50">{new Date(res.submitted_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className={`text-xl font-bold ${res.score >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {res.score?.toFixed(1)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ResultPage;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import client from '../api/client';
import { Plus, CheckCircle, ArrowLeft, Upload, FileText } from 'lucide-react';

const RoomDetails = () => {
    const { roomKey } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState({
        topic: 'General',
        question_text: '',
        options: ['', '', '', ''],
        correct_ans: '',
        image_url: ''
    });

    useEffect(() => {
        fetchRoomData();
    }, [roomKey]);

    const fetchRoomData = async () => {
        try {
            const roomRes = await client.get(`/rooms/${roomKey}`);
            setRoom(roomRes.data);
            const qRes = await client.get(`/questions/${roomKey}?type=admin`);
            setQuestions(qRes.data);
        } catch (error) {
            console.error("Failed to fetch room data", error);
        }
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...newQuestion.options];
        newOptions[index] = value;
        setNewQuestion({ ...newQuestion, options: newOptions });
    };

    const addQuestion = async () => {
        if (!newQuestion.question_text || !newQuestion.correct_ans) {
            alert("Please fill question text and select correct answer.");
            return;
        }

        try {
            await client.post('/questions/add', {
                room_id: room.id,
                questions: [newQuestion]
            });
            setNewQuestion({
                topic: 'General',
                question_text: '',
                options: ['', '', '', ''],
                correct_ans: '',
                image_url: ''
            });
            fetchRoomData();
        } catch (error) {
            alert("Failed to add question");
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('room_id', room.id);

        try {
            await client.post('/questions/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Questions uploaded successfully!");
            fetchRoomData();
        } catch (error) {
            console.error("Upload failed", error);
            alert(error.response?.data?.message || "Failed to upload file");
        }
    };

    if (!room) return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 text-white">Loading...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link to="/admin" className="flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-4 text-sm">
                        <ArrowLeft size={16} /> Back to Dashboard
                    </Link>
                    <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-white">Room: {room.room_key}</h1>
                                <p className="text-white/60 text-sm">Duration: {room.test_duration} mins | Status: <span className={room.status === 'active' ? 'text-green-400' : 'text-red-400'}>{room.status}</span></p>
                            </div>
                            <div className="text-right">
                                <p className="text-white/40 text-xs">Questions</p>
                                <p className="text-3xl font-bold text-purple-400">{questions.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add Question Form */}
                <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/10 mb-6">
                    <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                        <Plus size={20} className="text-purple-400" /> Add New Question
                    </h2>
                    <div className="space-y-4">
                        <input
                            className="w-full p-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:border-purple-500 outline-none"
                            placeholder="Topic (e.g., Math, GK)"
                            value={newQuestion.topic}
                            onChange={e => setNewQuestion({ ...newQuestion, topic: e.target.value })}
                        />
                        <textarea
                            className="w-full p-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 h-24 focus:border-purple-500 outline-none"
                            placeholder="Question Text"
                            value={newQuestion.question_text}
                            onChange={e => setNewQuestion({ ...newQuestion, question_text: e.target.value })}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {newQuestion.options.map((opt, idx) => (
                                <div key={idx} className="flex gap-2 items-center">
                                    <span className="font-bold text-white/50 w-6">{String.fromCharCode(65 + idx)}.</span>
                                    <input
                                        className="flex-1 p-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:border-purple-500 outline-none"
                                        placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                                        value={opt}
                                        onChange={e => handleOptionChange(idx, e.target.value)}
                                    />
                                    <button
                                        onClick={() => setNewQuestion({ ...newQuestion, correct_ans: opt })}
                                        className={`p-2 rounded-full transition ${newQuestion.correct_ans === opt && opt !== '' ? 'text-green-400 bg-green-500/20' : 'text-white/30 hover:text-white/60'}`}
                                    >
                                        <CheckCircle size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={addQuestion}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-xl hover:opacity-90 transition"
                        >
                            Add Question
                        </button>
                    </div>
                </div>

                {/* Bulk Upload */}
                <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/10 mb-6">
                    <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                        <Upload size={20} className="text-purple-400" /> Bulk Upload
                    </h2>
                    <div className="flex items-center gap-4">
                        <label className="flex-1 flex items-center justify-center gap-3 p-4 bg-white/5 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-purple-500/50 transition">
                            <FileText size={24} className="text-white/40" />
                            <span className="text-white/60">Drop CSV, Excel, or PDF file here</span>
                            <input
                                type="file"
                                accept=".csv,.txt,.xlsx,.xls,.pdf"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </label>
                    </div>
                    <p className="text-xs text-white/40 mt-2">Supports: CSV/Excel with columns (topic, question_text, options, correct_ans) or PDF</p>
                </div>

                {/* Questions List */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white">Questions ({questions.length})</h2>
                    {questions.map((q, i) => (
                        <div key={q.id} className="bg-white/10 backdrop-blur-lg p-4 rounded-xl border border-white/10">
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-semibold text-purple-400">Q{i + 1}. {q.topic}</span>
                            </div>
                            <p className="text-white font-medium mb-3">{q.question_text}</p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                {q.options.map((opt, idx) => (
                                    <div key={idx} className={`p-2 rounded-lg ${q.correct_ans === opt ? 'bg-green-500/20 text-green-400' : 'text-white/60'}`}>
                                        {String.fromCharCode(65 + idx)}. {opt}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RoomDetails;

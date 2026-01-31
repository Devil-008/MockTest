import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Clock, Menu, AlertTriangle } from 'lucide-react';

const ExamPage = () => {
    const { roomKey } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const timerRef = useRef(null);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = '';
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        const handleVisibilityChange = () => {
            if (document.hidden) {
                alert("WARNING: You switched tabs! This activity has been recorded.");
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    useEffect(() => {
        fetchExamData();
    }, [roomKey]);

    const fetchExamData = async () => {
        try {
            const roomRes = await client.get(`/rooms/${roomKey}`);
            setRoom(roomRes.data);
            setTimeLeft(roomRes.data.test_duration * 60);

            const qRes = await client.get(`/questions/${roomKey}`);
            setQuestions(qRes.data);
            setLoading(false);

            const savedAnswers = localStorage.getItem(`answers_${roomKey}_${user.id}`);
            if (savedAnswers) setAnswers(JSON.parse(savedAnswers));

            const savedTime = localStorage.getItem(`timeLeft_${roomKey}_${user.id}`);
            if (savedTime) setTimeLeft(parseInt(savedTime));

        } catch (error) {
            console.error("Failed to load exam", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (timeLeft > 0 && !loading) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    const newVal = prev - 1;
                    localStorage.setItem(`timeLeft_${roomKey}_${user.id}`, newVal);
                    if (newVal === 0) {
                        clearInterval(timerRef.current);
                        handleSubmit(true);
                    }
                    return newVal;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [timeLeft, loading]);

    const handleAnswer = (option) => {
        const qId = questions[currentQuestionIndex].id;
        const newAnswers = { ...answers, [qId]: option };
        setAnswers(newAnswers);
        localStorage.setItem(`answers_${roomKey}_${user.id}`, JSON.stringify(newAnswers));
    };

    const handleSubmit = async (isAuto = false) => {
        if (isAuto || window.confirm("Are you sure you want to submit?")) {
            submitData();
        }
    };

    const submitData = async () => {
        try {
            const formattedAnswers = Object.entries(answers).map(([qId, option]) => ({
                question_id: qId,
                selected_option: option
            }));

            const timeTaken = (room.test_duration * 60) - timeLeft;

            await client.post('/exam/submit', {
                student_id: user.id,
                room_id: room.id,
                answers: formattedAnswers,
                time_taken: timeTaken
            });

            localStorage.removeItem(`answers_${roomKey}_${user.id}`);
            localStorage.removeItem(`timeLeft_${roomKey}_${user.id}`);

            navigate(`/student/result/${user.id}`);
        } catch (error) {
            alert("Submission failed. Please try again.");
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const getStatusColor = (index) => {
        const q = questions[index];
        if (index === currentQuestionIndex) return 'ring-2 ring-blue-500 bg-blue-500/30';
        const isAnswered = answers[q.id];
        if (isAnswered) return 'bg-green-500 text-white';
        return 'bg-white/10 text-white/60';
    };

    if (loading) return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8 text-white">Loading Exam...</div>;
    if (!questions.length) return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8 text-white">No questions in this exam.</div>;

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
            {/* Main Content */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'mr-80' : ''}`}>

                {/* Header */}
                <header className="bg-white/10 backdrop-blur-lg border-b border-white/10 p-4 flex justify-between items-center z-10 sticky top-0">
                    <h1 className="text-xl font-bold text-white">Exam: {room?.room_key}</h1>
                    <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xl font-bold ${timeLeft < 300 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                            <Clock size={20} />
                            {formatTime(timeLeft)}
                        </div>
                        <button
                            onClick={() => handleSubmit(false)}
                            className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 rounded-xl hover:opacity-90 font-bold shadow-lg"
                        >
                            Submit
                        </button>
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden text-white">
                            <Menu />
                        </button>
                    </div>
                </header>

                {/* Question Area */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/10 min-h-[400px]">
                        <div className="flex justify-between items-start mb-6">
                            <span className="text-sm font-bold text-blue-400 uppercase tracking-wider">{currentQuestion.topic}</span>
                            <span className="text-sm text-white/50">Question {currentQuestionIndex + 1} of {questions.length}</span>
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-8 leading-relaxed">
                            {currentQuestion.question_text}
                        </h2>

                        <div className="grid gap-4">
                            {currentQuestion.options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(option)}
                                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center gap-4
                                        ${answers[currentQuestion.id] === option
                                            ? 'border-blue-500 bg-blue-500/20 text-white'
                                            : 'border-white/20 hover:border-blue-500/50 hover:bg-white/5 text-white/80'
                                        }`}
                                >
                                    <span className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2
                                        ${answers[currentQuestion.id] === option ? 'bg-blue-500 text-white border-blue-500' : 'bg-white/5 text-white/50 border-white/30'}`}>
                                        {String.fromCharCode(65 + idx)}
                                    </span>
                                    <span className="text-lg">{option}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="max-w-4xl mx-auto mt-6 flex justify-between">
                        <button
                            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                            disabled={currentQuestionIndex === 0}
                            className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                            disabled={currentQuestionIndex === questions.length - 1}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </main>
            </div>

            {/* Side Panel */}
            <aside className={`fixed top-0 right-0 h-full w-80 bg-slate-900/95 backdrop-blur-lg z-20 transform transition-transform duration-300 overflow-y-auto border-l border-white/10
                ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0 md:static md:block md:w-80`}>
                <div className="p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                        <Menu size={20} /> Question Palette
                    </h3>
                    <div className="grid grid-cols-5 gap-2">
                        {questions.map((q, idx) => (
                            <button
                                key={q.id}
                                onClick={() => setCurrentQuestionIndex(idx)}
                                className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${getStatusColor(idx)}`}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>

                    <div className="mt-8 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-white/60">
                            <div className="w-4 h-4 bg-green-500 rounded"></div> Answered
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/60">
                            <div className="w-4 h-4 bg-white/10 rounded"></div> Not Answered
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/60">
                            <div className="w-4 h-4 ring-2 ring-blue-500 rounded"></div> Current
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                        <div className="flex items-center gap-2 text-yellow-400 text-sm">
                            <AlertTriangle size={16} />
                            <span>Don't switch tabs!</span>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default ExamPage;

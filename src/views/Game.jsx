import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuestions, submitResult } from '../services/api';

const QUESTION_COUNT = parseInt(import.meta.env.VITE_QUESTION_COUNT || '5', 10);

const Game = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [startTime, setStartTime] = useState(Date.now());

    useEffect(() => {
        const id = localStorage.getItem('pixel_game_user_id');
        if (!id) {
            navigate('/');
            return;
        }
        setUserId(id);

        const initGame = async () => {
            try {
                const data = await getQuestions(QUESTION_COUNT);
                setQuestions(data);
                setStartTime(Date.now());
            } catch (error) {
                console.error("Failed to load questions", error);
                alert("Failed to load questions. Please check network.");
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        initGame();
    }, [navigate]);

    const handleAnswer = async (optionKey) => {
        const currentQ = questions[currentIndex];
        const isCorrect = optionKey === currentQ.answer;

        // Optimistic score update
        const newScore = isCorrect ? score + 1 : score;
        setScore(newScore);

        // Using basic alert for feedback for now, or just move on styling later
        // For flow, let's just move next immediately

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            // Game Over
            finishGame(newScore);
        }
    };

    const finishGame = async (finalScore) => {
        setSubmitting(true);
        const endTime = Date.now();
        const duration = Math.floor((endTime - startTime) / 1000); // seconds
        const passed = finalScore >= parseInt(import.meta.env.VITE_PASS_THRESHOLD || '3', 10);

        const resultData = {
            id: userId,
            score: finalScore,
            totalQuestions: questions.length,
            passed,
            duration
        };

        try {
            await submitResult(resultData);
            // Pass result to result page
            navigate('/result', { state: resultData });
        } catch (error) {
            console.error("Failed to submit", error);
            // Navigate anyway?
            navigate('/result', { state: { ...resultData, error: true } });
        }
    };

    if (loading) return <div className="container">LOADING...</div>;
    if (submitting) return <div className="container">SAVING SCORE...</div>;
    if (questions.length === 0) return <div className="container">NO QUESTIONS FOUND</div>;

    const currentQ = questions[currentIndex];

    return (
        <div className="container">
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span>ID: {userId}</span>
                <span>SCORE: {score}</span>
            </div>

            <div className="pixel-box" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img
                    src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${currentQ.seed}`}
                    alt="Boss"
                    style={{ width: '100px', height: '100px', marginBottom: '1rem', border: '2px solid #000' }}
                />
                <h3 style={{ marginBottom: '0.5rem' }}>Question {currentIndex + 1} / {questions.length}</h3>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.2' }}>{currentQ.question}</p>
            </div>

            <div className="full-width" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {Object.entries(currentQ.options).map(([key, val]) => (
                    <button
                        key={key}
                        className="pixel-btn secondary"
                        onClick={() => handleAnswer(key)}
                    >
                        {key}: {val}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Game;

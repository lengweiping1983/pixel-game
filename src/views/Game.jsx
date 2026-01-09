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
    const [userAnswers, setUserAnswers] = useState([]);

    useEffect(() => {
        const id = localStorage.getItem('pixel_game_user_id');
        if (!id) {
            navigate('/');
            return;
        }
        setUserId(id);

        const initGame = async () => {
            try {
                // Check cache first
                const cached = sessionStorage.getItem('pixel_game_questions_cache');
                if (cached) {
                    setQuestions(JSON.parse(cached));
                    sessionStorage.removeItem('pixel_game_questions_cache'); // Clear after use
                    setStartTime(Date.now());
                } else {
                    const data = await getQuestions(QUESTION_COUNT);
                    setQuestions(data);
                    setStartTime(Date.now());
                }
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

        // Record Answer
        const answerRecord = {
            questionId: currentQ.id,
            questionText: currentQ.question,
            userChoice: optionKey,
            correctAnswer: currentQ.answer,
            options: currentQ.options,
            // eslint-disable-next-line no-unused-vars
            isCorrect
        };

        const newAnswers = [...userAnswers, answerRecord];
        newAnswers[userAnswers.length].isCorrect = isCorrect; // Ensure isCorrect is set (index fix)
        setUserAnswers(newAnswers);

        // Optimistic score update
        const newScore = isCorrect ? score + 1 : score;
        setScore(newScore);

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            // Game Over
            finishGame(newScore, newAnswers);
        }
    };

    const finishGame = async (finalScore, finalAnswers) => {
        // No "Submitting" state to block UI
        const endTime = Date.now();
        const duration = Math.floor((endTime - startTime) / 1000); // seconds
        const passed = finalScore >= parseInt(import.meta.env.VITE_PASS_THRESHOLD || '3', 10);

        const resultData = {
            id: userId,
            score: finalScore,
            totalQuestions: questions.length,
            passed,
            duration,
            answers: finalAnswers
        };

        // Fire and forget submission by passing responsibility to Result page or just triggering it here without await
        // To be safe against unmounts, we pass a flag to Result page to handle submission
        navigate('/result', { state: { ...resultData, needSubmit: true } });
    };

    if (loading) return <div className="container">LOADING...</div>;
    // Removed submitting check
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

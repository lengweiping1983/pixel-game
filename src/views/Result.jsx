import { useLocation, useNavigate } from 'react-router-dom';

const Result = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    // Fallback if accessed directly
    if (!state) {
        return (
            <div className="container">
                <p>No result data.</p>
                <button className="pixel-btn primary" onClick={() => navigate('/')}>HOME</button>
            </div>
        );
    }

    const { score, totalQuestions, passed, duration, answers } = state;

    return (
        <div className="container" style={{ paddingBottom: '40px', maxWidth: '900px' }}>
            <h1 className="pixel-title" style={{
                fontSize: '3rem',
                color: passed ? 'var(--pixel-secondary)' : 'var(--pixel-primary)',
                textShadow: '4px 4px #000',
                marginBottom: '1rem'
            }}>
                {passed ? 'CLEAR!' : 'GAME OVER'}
            </h1>

            <div className="pixel-box dark" style={{ width: '100%', marginBottom: '2rem', display: 'flex', justifyContent: 'space-around' }}>
                <span style={{ margin: '10px 0' }}>SCORE: {score} / {totalQuestions}</span>
                <span style={{ margin: '10px 0' }}>TIME: {duration}s</span>
            </div>

            {/* Review Section */}
            <h2 style={{ marginBottom: '1rem' }}>REVIEW</h2>
            <div style={{ width: '100%', display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                {answers && answers.map((ans, idx) => (
                    <div key={idx} className="pixel-box" style={{
                        textAlign: 'left',
                        borderColor: ans.isCorrect ? 'var(--pixel-secondary)' : 'var(--pixel-primary)',
                        padding: '1rem'
                    }}>
                        <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                            Q{idx + 1}: {ans.questionText}
                        </p>
                        <div style={{ fontSize: '0.9rem' }}>
                            <p style={{ color: ans.isCorrect ? 'var(--pixel-secondary)' : 'var(--pixel-primary)' }}>
                                YOUR ANSWER: {ans.userChoice} ({ans.options[ans.userChoice]})
                            </p>
                            {!ans.isCorrect && (
                                <p style={{ color: '#000', marginTop: '5px' }}>
                                    CORRECT ANSWER: {ans.correctAnswer} ({ans.options[ans.correctAnswer]})
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <button className="pixel-btn primary" onClick={() => navigate('/')}>
                TRY AGAIN
            </button>
        </div>
    );
};

export default Result;

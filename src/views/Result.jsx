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

    const { score, totalQuestions, passed, duration } = state;

    return (
        <div className="container">
            <h1 className="pixel-title" style={{
                fontSize: '3rem',
                color: passed ? 'var(--pixel-secondary)' : 'var(--pixel-primary)',
                textShadow: '4px 4px #000',
                marginBottom: '2rem'
            }}>
                {passed ? 'CLEAR!' : 'GAME OVER'}
            </h1>

            <div className="pixel-box dark" style={{ width: '100%', maxWidth: '400px', marginBottom: '2rem' }}>
                <p style={{ margin: '10px 0' }}>SCORE: {score} / {totalQuestions}</p>
                <p style={{ margin: '10px 0' }}>TIME: {duration}s</p>
            </div>

            <button className="pixel-btn primary" onClick={() => navigate('/')}>
                TRY AGAIN
            </button>
        </div>
    );
};

export default Result;

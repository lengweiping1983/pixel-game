import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [id, setId] = useState('');
    const navigate = useNavigate();

    const handleStart = () => {
        if (id.trim()) {
            // Pass ID to game via state or standard way (e.g. localStorage or context)
            // For simplicity let's use localStorage to persist easily across refreshes if needed,
            // or just pass in navigation state.
            localStorage.setItem('pixel_game_user_id', id);
            navigate('/game');
        } else {
            alert('Please enter an ID / 请输入 ID');
        }
    };

    return (
        <div className="container">
            <h1 className="pixel-title" style={{ fontSize: '3rem', marginBottom: '2rem', color: 'var(--pixel-primary)', textShadow: '4px 4px #000' }}>
                PIXEL QUIZ
            </h1>

            <div className="pixel-box">
                <p style={{ marginBottom: '1rem' }}>ENTER YOUR ID</p>
                <input
                    type="text"
                    className="pixel-input"
                    placeholder="ID"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                />
            </div>

            <div style={{ marginTop: '2rem' }}>
                <button className="pixel-btn primary" onClick={handleStart}>
                    START GAME
                </button>
            </div>

            <div style={{ marginTop: '3rem', fontSize: '0.8rem', color: '#666' }}>
                POWERED BY REACT & VITE
            </div>
        </div>
    );
};

export default Home;

import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const auth = async (username, password) => {
    try {
        const resUser = await fetch('http://localhost:4000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (resUser.ok) {
            const user = await resUser.json();
            return user || null;
        }

        return null;
    } catch (error) {
        console.error('Error during login:', error);
        return null;
    }
};

export const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleClick = async () => {
        const res = await auth(username, password);
        if (!res) {
            setError('Invalid username or password');
        } else {
            sessionStorage.setItem('username', username);
            navigate('/');
        }
    };

    return (
        <div className="login-page-wrapper">
            <div className="login-page">
                <div className="login-box">
                    <span className="login-logo">🐝</span>
                    <div className="login-header">
                        <h1>Sign in to BlurredSpace</h1>
                    </div>
                    <div className="login-form">
                        <input
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            placeholder="Username"
                        />
                        <input
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            placeholder="Password"
                        />
                        <button onClick={handleClick}>Sign in</button>
                        {error && <div className="error">{error}</div>}
                    </div>
                    <div className="login-footer">
                        <div className="nav-link" onClick={() => navigate('/register')}>
                            Create an account
                        </div>
                        <div className="nav-link" onClick={() => navigate('/')}>
                            Back to Home
                        </div>
                    </div>
                </div>
            </div>

            <footer className="footer-in-login">
                <div className="footer-links-in-login">
                    <a href="#">Terms and rules</a>
                    <a href="#">Privacy policy</a>
                    <a href="#">Help</a>
                    <a href="#">Home</a>
                </div>
            </footer>
        </div>
    );
};

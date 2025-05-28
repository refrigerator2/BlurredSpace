import './registration.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const reg = async (username, password) => {
    try {
        const resUser = await fetch('http://localhost:4000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (resUser.ok) {
            const user = await resUser.json();
            if (user === null) {
                console.log('Registration failed');
            } else {
                console.log('Registration passed');
                return user;
            }
        }
    } catch (err) {
        console.log(err);
    }
};

export const Registration = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [checkPassword, setCheckPassword] = useState('');
    const [error, setError] = useState(null);

    const handleClick = async () => {
        if (checkPassword !== password) {
            setError('Passwords are not the same');
            return;
        }

        const res = await reg(username, password);
        if (res === null) {
            setError('Invalid username or password');
            console.log('Invalid registration');
        } else {
            sessionStorage.setItem('username', username);
            navigate('/');
        }
    };

    return (
        <div className="registration-page-wrapper">
            <div className="registration-page">
                <div className="registration-box">
                    <span className="registration-logo">🐝</span>
                    <div className="registration-header">
                        <h1>Sign up to BlurredSpace</h1>
                    </div>
                    <div className="registration-form">
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
                        <input
                            type="password"
                            onChange={(e) => setCheckPassword(e.target.value)}
                            value={checkPassword}
                            placeholder="Repeat Password"
                        />
                        <button onClick={handleClick}>Create</button>
                        {error && <div className="error">{error}</div>}
                    </div>
                    <div className="registration-footer">
                        <div className="nav-link" onClick={() => navigate('/login')}>
                            You already have an account
                        </div>
                        <div className="nav-link" onClick={() => navigate('/')}>
                            Back to Home
                        </div>
                    </div>
                </div>
            </div>

            <footer className="footer-in-registration">
                <div className="footer-links-in-registration">
                    <a href="#">Terms and rules</a>
                    <a href="#">Privacy policy</a>
                    <a href="#">Help</a>
                    <a href="#">Home</a>
                </div>
            </footer>
        </div>
    );
};

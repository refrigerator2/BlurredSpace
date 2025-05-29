import './registration.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const reg = async (username, password) => {
    try {
        const resUser = await axios.post('http://localhost:4000/register', {
           username,
            password,
        });
        const user = resUser.data;
            if (user === null) {
                console.log('Registration failed');
                return null;
            } else {
                console.log('Registration passed');
                return user;
            }
    } catch (err) {
        console.log(err);
        return null;
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
                            onChange={(e) => {setUsername(e.target.value)
                                setError(null)}}
                            value={username}
                            placeholder="Username"
                        />
                        <input
                            type="password"
                            onChange={(e) => {setPassword(e.target.value)
                                setError(null)}}
                            value={password}
                            placeholder="Password"
                        />
                        <input
                            type="password"
                            onChange={(e) => {setCheckPassword(e.target.value)
                                setError(null)}}
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

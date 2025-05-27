import './Login.css'
import {useNavigate} from 'react-router-dom'
import {useState} from 'react'

const auth = async (username, password) => {
    try {
        const resUser = await fetch('http://localhost:4000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (resUser.ok) {
            const user = await resUser.json();
            if (user) {
                console.log('Auth passed');
                // localStorage.setItem('authToken', pat.token);
                return user;
            } else {
                console.error('Invalid user');
                return null;
            }
        }

        console.log('No such user');
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
        if (res === null) {
            setError('Invalid username or password');
            console.log("Invalid login");
        } else {
            sessionStorage.setItem('username', username);
            navigate('/');
        }
    };

    return (
        <div className="login">
            <input onChange={(e) => setUsername(e.target.value)} value={username} placeholder="Username" />
            <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Password" />
            <button onClick={handleClick}>Login</button>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <div  style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                  onClick={() => navigate('/register')}>regist</div>
        </div>
    );
};
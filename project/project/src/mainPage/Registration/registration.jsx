import './registration.css'
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'

const reg = async (username, password) => {
    try{
        const resUser = await fetch('http://localhost:4000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password }),
        })
        if (resUser.ok) {
            const user = await resUser.json();
            if(user===null){
                console.log("registration failed")
            }
            else{
                console.log("registration passed")
                return user
            }
        }
    }catch(err) {
        console.log(err)
    }
}

export const Registration = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [checkPassword, setCheckPassword] = useState('');
    const [error, setError] = useState(null);

    const handleClick = async () => {
        if(checkPassword !== password){
            setError("passwords are not the same");
            return;
        }
        console.log(username, password);
        const res = await reg(username, password);
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
            <input type="password" onChange={(e) => setCheckPassword(e.target.value)} value={checkPassword} placeholder="Password" />
            <button onClick={handleClick}>Create</button>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <div  style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                  onClick={() => navigate('/login')}>You already have account</div>
        </div>
    );
}

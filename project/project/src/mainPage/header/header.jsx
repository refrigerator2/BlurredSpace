import "./header.css"
import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    const [clicked, setClicked] = useState(false);
    const [thread, setThread] = useState(false);
    const [main, setMain] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [serach, setSerach] = useState('');

    const onPress = () => {
        setClicked(true);
    }
    const handleThread = () => {
        setThread(true);
    }
    const handleMain = () => {
        setMain(true);
    }
    if (clicked) {
        navigate('/login');
    }
    if (thread) {
        navigate('/threadcreate');
    }
    if (main) {
        navigate('/');
    }
    const username = sessionStorage.getItem('username');

    useEffect(() => {
        if (username && username !== 'Guest') {
            setLoggedIn(true);
        }
        if(!username){
            setLoggedIn(false);
        }
    }, [username])
    const handleLogOut = () =>{
        sessionStorage.removeItem('username');
    }
    return (
        <>
        {!loggedIn ?
            <header className="header">
                <div className="header-left">
                    <a href="#" className="home" onClick={handleMain}>Home</a>
                    <span className="logo">🐝</span>
                </div>

                <div className="header-center">
                    <div className="search-wrapper">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search..."
                        />
                    </div>
                </div>
                <div className="header-right">
                    <button className="login-button" onClick={handleThread}>Create thread</button>
                </div>
                <div className="header-right">
                    <button className="login-button" onClick={onPress}>Log In</button>
                </div>
            </header>
            : <header className="header">
                <div className="header-left">
                    <a href="#" className="home" onClick={handleMain}>Home</a>
                    <span className="logo">🐝</span>
                </div>

                <div className="header-center">
                    <div className="search-wrapper">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search..."
                        />
                    </div>
                </div>
                <div className="header-right">
                    <button className="login-button" onClick={handleThread}>Create thread</button>
                </div>
                <div className="header-right">
                    <button className="login-button" onClick={handleLogOut}>Log Out</button>
                </div>
            </header>}
        </>
    );
};

export default Header;
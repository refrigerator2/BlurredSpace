import "./header.css"
import {useState, useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const Header = () => {
    const navigate = useNavigate();
    const [clicked, setClicked] = useState(false);
    const [thread, setThread] = useState(false);
    const [main, setMain] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [search, setSearch] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

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
        if (!username) {
            setLoggedIn(false);
        }
    }, [username]);

    const handleLogOut = () => {
        sessionStorage.removeItem('username');
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearchInput = async (e) => {
        const value = e.target.value;
        setSearch(value);
        if (value.trim() === '') {
            setSuggestions([]);
            setShowDropdown(false);
            return;
        }
        try {
            const res = await axios.get("http://localhost:4000/threads");
            const threads = res.data;
            console.log(threads);
            const matches = threads
                .filter(thread => thread.title.toLowerCase().includes(value.toLowerCase()))
                .slice(0, 5);
            setSuggestions(matches);
            setShowDropdown(true);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            {!loggedIn ?
                <header className="header">
                    <div className="header-left">
                        <a href="#" className="home" onClick={handleMain}>Home</a>
                        <span className="logo">🐝</span>
                    </div>

                    <div className="header-center" ref={dropdownRef}>
                        <div className="search-wrapper">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search..."
                                value={search}
                                onChange={handleSearchInput}
                            />
                        </div>
                        {showDropdown && suggestions.length > 0 && (
                            <ul className="dropdown">
                                {suggestions.map((thread) => (
                                    <li key={thread.id} onClick={() => {
                                        setSearch('');
                                        setShowDropdown(false);
                                        navigate(`/thread/${thread.id}`);
                                    }}>
                                        {thread.title}
                                    </li>
                                ))}
                            </ul>
                        )}
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

                    <div className="header-center" ref={dropdownRef}>
                        <div className="search-wrapper">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search..."
                                value={search}
                                onChange={handleSearchInput}
                            />
                        </div>
                        {showDropdown && suggestions.length > 0 && (
                            <ul className="dropdown">
                                {suggestions.map((thread) => (
                                    <li key={thread.id} onClick={() => {
                                        setSearch('');
                                        setShowDropdown(false);
                                        navigate(`/thread/${thread.id}`);
                                    }}>
                                        {thread.title}
                                    </li>
                                ))}
                            </ul>
                        )}
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

import "./header.css"
import {useState} from "react";
import {useNavigate} from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    const [clicked, setClicked] = useState(false);
    const onPress = () => {
        setClicked(true);
    }
    if (clicked) {
        navigate('/login');
    }
    return (
        <>
            <header className="header">
                <div className="header-left">
                    <a href="#" className="home">Home</a>
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
                    <button className="login-button" onClick={onPress}>Log In</button>
                </div>
            </header>
        </>
    );
};

export default Header;
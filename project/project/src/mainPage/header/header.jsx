import "./header.css"

const Header = () => {
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
                    <a href="#" className="login-button">Log In</a>
                </div>
            </header>
        </>
    );
};

export default Header;
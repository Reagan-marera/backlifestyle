import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Import the CSS file

const Navbar = ({ token, onLogout }) => {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                {/* Add a logo or any other image */}
                <Link to="/">
                    <img src="./logos.jpeg" alt="Logo" className="navbar-logo" />
                </Link>
            </div>
            <ul className="navbar-links">
                <li><Link to="/">HOME</Link></li>
                {token ? (
                    <>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                        <li><button onClick={onLogout} className="logout-button">Logout</button></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">LOGIN</Link></li>
                        <li><Link to="/register">REGISTER</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;

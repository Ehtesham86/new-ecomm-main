import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import 'boxicons';
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const [timeLeft, setTimeLeft] = useState('');
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    useEffect(() => {
        const targetTime = new Date();
        targetTime.setHours(17, 0, 0, 0);

        const interval = setInterval(() => {
            const currentTime = new Date();
            const difference = targetTime - currentTime;

            if (difference <= 0) {
                clearInterval(interval);
                setTimeLeft("00:00:00");
            } else {
                const hours = String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, '0');
                const minutes = String(Math.floor((difference / (1000 * 60)) % 60)).padStart(2, '0');
                const seconds = String(Math.floor((difference / 1000) % 60)).padStart(2, '0');

                setTimeLeft(`${hours}:${minutes}:${seconds}`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <header className="header">
            <Container fluid className="d-flex align-items-center justify-content-between header-container web-header">
                <div className='logo-section'>
                    <img src="assets/logo.png" alt="Logo" className="logo" />
                </div>
                <div className="search-bar">
                    <div className="search-input-wrapper">
                        <i className="bx bx-search search-icon"></i>
                        <input type="text" placeholder="I'm shopping for..." className="search-input" />
                    </div>
                </div>
                <div className='timer-section'>
                    <p className="delivery-timer">Next day delivery closing in: <b>{timeLeft}</b></p>
                </div>
                <div className="header-info d-flex align-items-center">
                    <div className='notification-section'>
                        <i className="bx bx-bell notification-icon"></i>
                    </div>
                    <div className="vertical-line"></div>
                    <img src="assets/user.png" alt="User" className="user-avatar" />
                    <div className='d-flex flex-column'>
                        <span className="username">{user.firstname}</span>
                        <span>WSF User</span>
                    </div>
                    <div className="vertical-line"></div>
                    <button
                        className='notification-section'
                        style={{ border: 'none', background: 'none' }}
                        onClick={handleLogout} >
                        <i className="bx bx-power-off power-off-icon"></i>
                    </button>
                </div>
            </Container>
            <Container fluid className="d-flex align-items-center justify-content-between header-container mobile-header">
                <div className='logo-section'>
                    <img src="assets/logo.png" alt="Logo" className="logo" />
                </div>
                <div className='timer-section'>
                    <p className="delivery-timer">Next day delivery closing in: <b>{timeLeft}</b></p>
                </div>
                <div className="header-info d-flex align-items-center">
                    <div className='notification-section'>
                        <i className="bx bx-bell notification-icon"></i>
                    </div>
                    <div className="vertical-line"></div>
                    <img src="assets/user.png" alt="User" className="user-avatar" />
                    <button
                        className='notification-section'
                        style={{ border: 'none', background: 'none' }}
                        onClick={handleLogout} >
                        <i className="bx bx-power-off power-off-icon"></i>
                    </button>
                </div>
            </Container>
            <div className="search-bar-mobile">
                <div className="search-input-wrapper">
                    <i className="bx bx-search search-icon"></i>
                    <input type="text" placeholder="I'm shopping for..." className="search-input" />
                </div>
            </div>
        </header>
    );
};

export default Header;

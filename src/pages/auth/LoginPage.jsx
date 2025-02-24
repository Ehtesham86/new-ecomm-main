import React, { useState } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import FormInput from '../../components/Common/FormInput';
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState("");
    const baseURL = process.env.REACT_APP_BASE_URL;

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const url = `${baseURL}/api/auth/login`;
            const response = await axios.post(url, { email, password }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: false,
            });
            login(response.data.token);
            navigate("/store");
        } catch (err) {
            setError("Invalid email or password.");
        }
    };

    return (
        <Container className='login-bg login-card'>
            <Row xs={1} sm={1} md={1} lg={2} className='login-row'>
                <Col>
                    <div className='login-logo-section'>
                        <img src="/assets/logo.png" alt="We Supply Food" width={75} height={'auto'} />
                        <div className='logo-text'>
                            <h1>Log in to continue</h1>
                            <div className='login-subheading'>
                                <p className='link'>To We Supply Food</p>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col>
                    <form onSubmit={handleLogin} className='login-form'>
                        <div style={{ display: 'grid' }}>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                            <FormInput
                                type="email"
                                placeholder="To log in, please enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="custom-input"
                            />
                            <FormInput
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="custom-input"
                            />
                            <Link to={'/forgot-password'} className='link'>Forgot Password?</Link>
                            <div className='mobile-login-form-buttons'>
                                <Button className='mobile-primary-button' onClick={handleLogin}>
                                    Login
                                </Button>
                                <Link to={'/'} className='mobile-link' style={{ fontWeight: '600' }}>Create Account</Link>
                                <hr />
                            </div>
                            <p className='login-form-text'>
                                To continue, Enter your email address and password with We Supply food. Before using this app, you can review We Supply food <Link to={'/'} className='link'>Privacy Policy</Link> and <Link to={'/'} className='link'>Terms of Service</Link>.
                            </p>
                        </div>
                        <div className='login-form-buttons'>
                            {/* <Link to={'/'} className='link' style={{ fontWeight: '600' }}>Create Account</Link> */}
                            <Button className='primary-button' onClick={handleLogin}>
                                Login
                            </Button>
                        </div>
                    </form>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginPage;

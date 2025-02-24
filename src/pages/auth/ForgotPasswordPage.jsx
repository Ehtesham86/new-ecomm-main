import React, { useState } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import FormInput from '../../components/Common/FormInput';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const baseURL = process.env.REACT_APP_BASE_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = `${baseURL}/api/auth/forgot-password`;
            const response = await axios.post(url, { email }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: false,
            });

            if (response.data.status) {
                navigate("/reset-password-email-sent");
            }
        } catch (err) {
            setError("Email does not exist");
        }
    };

    return (
        <Container className='login-bg login-card'>
            <Row xs={1} sm={1} md={1} lg={2} className='login-row'>
                <Col>
                    <div className='login-logo-section'>
                        <img src="/assets/logo.png" alt="We Supply Food" width={75} height={'auto'} />
                        <div className='logo-text'>
                            <h1>Forgot password</h1>
                            <div className='login-subheading'>
                                <p>to continue to</p>
                                <p className='link'>To We Supply Food</p>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col>
                    <form onSubmit={handleSubmit} className='login-form'>
                        <div style={{ display: 'grid' }}>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                            <FormInput
                                type="email"
                                placeholder="To forgot password, please enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="custom-input"
                            />
                            <p className='login-form-text'>
                                To continue, Enter your email address and password with We Supply food. Before using this app, you can review We Supply food <Link to={'/'} className='link'>Privacy Policy</Link> and <Link to={'/'} className='link'>Terms of Service</Link>.
                            </p>
                        </div>
                        <div className='login-form-buttons'>
                            <Button className='primary-button' type="submit">
                                Continue
                            </Button>
                        </div>
                    </form>
                </Col>
            </Row>
        </Container>
    );
};

export default ForgotPasswordPage;

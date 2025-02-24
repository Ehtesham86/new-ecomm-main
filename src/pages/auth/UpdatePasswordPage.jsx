import React, { useState } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import FormInput from '../../components/Common/FormInput';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from "axios";

const UpdatePasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [newPassword1, setNewPassword1] = useState('');
    const [newPassword2, setNewPassword2] = useState('');
    const [error, setError] = useState("");
    const baseURL = process.env.REACT_APP_BASE_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword1 === newPassword2) {
            try {
                const url = `${baseURL}/api/auth/reset-password/${token}`;
                const password = newPassword1;
                const response = await axios.post(url, { password }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: false,
                });

                if (response.data.status) {
                    navigate("/");
                }
            } catch (err) {
                setError("Unable to change password");
            }
        } else {
            setError("Passwords do not match");
        }
    };

    return (
        <Container className='login-bg login-card'>
            <Row xs={1} sm={1} md={1} lg={2} className='login-row'>
                <Col>
                    <div className='login-logo-section'>
                        <img src="/assets/logo.png" alt="We Supply Food" width={75} height={'auto'} />
                        <div className='logo-text'>
                            <h1>Update password</h1>
                            <div className='login-subheading'>
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
                                type="password"
                                placeholder="Enter your new password"
                                value={newPassword1}
                                onChange={(e) => setNewPassword1(e.target.value)}
                                className="custom-input"
                            />
                            <FormInput
                                type="password"
                                placeholder="Confirm new password"
                                value={newPassword2}
                                onChange={(e) => setNewPassword2(e.target.value)}
                                className="custom-input"
                            />
                            <div className='mobile-login-form-buttons'>
                                <Button className='mobile-primary-button' type="submit">
                                    Update Password
                                </Button>
                                <hr />
                            </div>
                            <p className='login-form-text'>
                                To continue, Enter your email address and password with We Supply food. Before using this app, you can review We Supply food <Link to={'/'} className='link'>Privacy Policy</Link> and <Link to={'/'} className='link'>Terms of Service</Link>.
                            </p>
                        </div>
                        <div className='login-form-buttons'>
                            <Button className='primary-button' type="submit" onClick={handleSubmit}>
                                Update Password
                            </Button>
                        </div>
                    </form>
                </Col>
            </Row>
        </Container>
    );
};

export default UpdatePasswordPage;

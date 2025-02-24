import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ResetPasswordEmailSentPage = () => {
  return (
    <Container className='login-bg login-card'>
        <Row xs={1} sm={1} md={1} lg={1} className='login-row'>
            <Col>
                <div className='email-sent-section'>
                    <img src="/assets/logo.png" alt="We Supply Food" width={120} height={'auto'} />
                    <h2>Password reset link sent to your email.</h2>
                    <p className='email-sent-text'>
                        To continue, Enter your email address and password with We Supply food. Before using this app, you can review We Supply food <Link to={'/'} className='link'>Privacy Policy</Link> and <Link to={'/'} className='link'>Terms of Service</Link>.
                    </p>
                </div>
            </Col>
        </Row>
    </Container>
  );
};

export default ResetPasswordEmailSentPage;

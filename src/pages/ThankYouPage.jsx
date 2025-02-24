import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ThankYouPage = () => {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const baseURL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/get-order/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.status) {
          setOrderDetails(response.data.order[0]);
        } else {
          setError('Failed to fetch order details');
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError('An error occurred while fetching the order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, baseURL, token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container
      className="d-flex justify-content-center align-items-center main-div"
      style={{
        minHeight: '50vh',
        backgroundColor: '#EFF4FE',
      }}
    >
      <div className="mb-3">
        <img src="../assets/logo-transparent-bg.png" alt="Logo" style={{ width: '100px', marginBottom: '15px' }} />
      </div>
      <h1 className="mb-4" style={{ color: '#333' }}>
        <span style={{ fontWeight: 'bold' }}>Thank You </span> For Your Order!
      </h1>
      <Card
        className='detail-card'
        style={{

        }}
      >
        <Card.Body>

          <Row className="justify-content-center mb-4">
            <Col xs={10}>
              <Card
                style={{
                  backgroundColor: '#EFF4FE',
                  padding: '20px',
                  borderRadius: '11px 11px 0px 0px',
                  border: 'none',
                }}
              >
                <Row>
                  <Col>
                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Product</div>
                  </Col>
                  <Col>
                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Quantity</div>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
          <Row className="justify-content-center mb-4" style={{ marginTop: '-24px' }}>
          {orderDetails ? 
           orderDetails.products.map((item, index) => (
            <Col xs={10} key={index}>
              <Card
                style={{
                  padding: '15px',
                  borderRadius: '0px 0px 11px 11px',
                  border: '1px solid #E1E1E1',
                  borderTop: 'none',
                }}
              >
                <Row className='thankyou-mobile-row'>
                  <Col sm={5} md={5} xl={5} lg={5}>
                    <div style={{ fontSize: '1rem', color: '#555' }}>{item.product.name}</div>
                  </Col>
                  <Col sm={2} md={2} xl={2} lg={2} className='vertical-line-col'>
                    <div className="vertical-line" style={{ width: '1px' }}></div>
                  </Col>
                  <Col sm={5} md={5} xl={5} lg={5}>
                    <div style={{ fontSize: '1rem', color: '#555' }}>{item.quantity}</div>
                  </Col>
                </Row>
              </Card>
            </Col>
          )) : ''}
          </Row>
          <p className='thankyou-note'>
            Thank you for your business - we're pleased to attach your invoice in PDF. <br />
            Full details, including payment terms, are included.
          </p>
          <p className='thankyou-note'>
            If you have any questions, please don't hesitate to contact us.<br />
            Kind regards, <br /><br />
            We Supply Food Ltd.<br />
            01234 56789
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ThankYouPage;

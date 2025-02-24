import React from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';

const InvoicePage2 = () => {
    return (
        <Container className='invoice-container' style={{  }}>

            {/* Header Section */}
            <Row className="mb-4" style={{ marginLeft: '10px', marginRight: '10px' }}>
                <Col>
                    <img src="assets/logo.png" alt="Logo" style={{ width: '100px' }} />
                </Col>
                <Col className="text-end">
                    <h5 style={{ color: '#2295BB', fontSize: '1.8rem' }}>SALES <strong>INVOICE</strong></h5>
                    <div className='invoice-header'>
                        <p>Order No</p>
                        <p>P45847920</p>
                    </div>
                    <div className='invoice-header'>
                        <p>Invoice Date</p>
                        <p>10/05/2024</p>
                    </div>
                    <div className='invoice-header'>
                        <p>Due Date</p>
                        <p>10/05/2024</p>
                    </div>
                </Col>
            </Row>

            {/* Address Section */}
            <Row style={{ margin: '80px 10px 40px 10px' }}>
                <Col>
                    <div style={{ marginBottom: '10px' }}>
                        <b>Delivery Address</b><br />
                        <b style={{ color: '#2295BB' }}>We Food Supply Ltd</b><br />
                    </div>
                    <p>SUITE 114<br />
                        UNIT 3 VICTORIA ROAD<br />
                        LONDON<br />
                        W3 6FA
                    </p>
                </Col>
            </Row>

            {/* Items Table */}
            <Table id="invoice-items">
                <tr>
                    <th>SKU</th>
                    <th>Description</th>
                    <th>Qty</th>
                </tr>
                {[...Array(7)].map((_, idx) => (
                    <tr key={idx}>
                        <td>36</td>
                        <td>EURO 4" SEEDED BUN 48</td>
                        <td>100.00</td>
                    </tr>
                ))}
            </Table>

            {/* Footer Section */}
            <Row style={{ marginTop: '100px' }}>
                <Col className='mt-4'>
                    <b style={{ color: '#2295BB' }}>Thank You for Your Order!</b>
                    <hr style={{ color: '#2295BB' }} />
                    <p style={{ fontSize: '0.8em', color: '#777', width: '50%' }}>
                    Registered in England and Wales No. 07180668 , VAT Registration Number GB 990652786 Registered Address Unit 13 - 14, The Sidings, Hainault Road, London, E11 1HD, United Kingdom
                    </p>
                </Col>
            </Row>
        </Container>
    );
};

export default InvoicePage2;

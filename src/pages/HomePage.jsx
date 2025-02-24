import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Tab, Tabs, Image } from 'react-bootstrap';
import 'boxicons';
import Header from '../components/Layout/Header';
import SupplierTab from './SupplierTab';
import axios from 'axios';
import { CartProvider } from '../context/CartContext';

const HomePage = () => {
    const [supplier, setSupplier] = useState('');
    const [products, setProducts] = useState([]);
    const token = localStorage.getItem('token');
    const baseURL = process.env.REACT_APP_BASE_URL;

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [isCartVisible, setIsCartVisible] = useState(!isMobile);

    useEffect(() => {
        const handleResize = () => {
            const mobileView = window.innerWidth <= 768;
            setIsMobile(mobileView);

            if (!mobileView) {
                setIsCartVisible(true);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleNavClick = (section) => {
        if (isMobile) {
            setIsCartVisible(section === 'cart');
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/get-suppliers-with-details`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.status) {
                    const suppliers = response.data.suppliers || [];
                    setProducts(suppliers);

                    // Set the first supplier as the initial active supplier
                    if (suppliers.length > 0) {
                        setSupplier(suppliers[0].name);
                    }
                } else {
                    alert('Failed to fetch products');
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                alert('An error occurred while fetching products');
            }
        };

        fetchProducts();
    }, [token]);

    return (
        <CartProvider>
            <Header />
            <Container fluid className="main-content">
                <Row>
                    <Col md={12} className="supplier-section">
                        <h3 className="section-heading">Suppliers</h3>
                        <Tabs
                            id="suppliers-tab"
                            className="supplier-logos category-scroll"
                            activeKey={supplier}
                            onSelect={(sup) => setSupplier(sup)}
                        >
                            {products.map((supplier, index) => (
                                <Tab
                                    key={index}
                                    eventKey={supplier.name}
                                    className="mb-3"
                                    title={
                                        <div className="tab-image-wrapper">
                                            <Image
                                                src={`${baseURL + supplier?.icon}`}
                                                alt={supplier.name}
                                                className="tab-image"
                                            />
                                        </div>
                                    }
                                >
                                    <SupplierTab
                                        categorizedProducts={supplier?.categorizedProducts}
                                        supplierId={supplier._id}
                                        supplierName={supplier.name}
                                        holidays={supplier.holidays[0].holidays}
                                    />
                                </Tab>
                            ))}
                        </Tabs>
                    </Col>
                </Row>
            </Container>

            <div className="mobile-nav d-block d-md-none">
                <Nav className="justify-content-between">
                    <Nav.Item>
                        <div onClick={() => handleNavClick('home')}>
                            <Image src="assets/home.svg" alt="Home" />
                            <h6 style={{ color: 'black', marginTop: '5px' }}>Home</h6>
                        </div>
                    </Nav.Item>
                    <Col sm={2} md={2} xl={2} lg={2} className="vertical-line-col">
                        <div className="home-vertical-line" style={{ width: '1px' }}></div>
                    </Col>
                    <Nav.Item>
                        <div onClick={() => handleNavClick('cart')}>
                            <Image src="assets/cart.svg" alt="Cart" />
                            <h6 style={{ color: 'black', marginTop: '5px' }}>Cart</h6>
                        </div>
                    </Nav.Item>
                </Nav>
            </div>
        </CartProvider>
    );
};

export default HomePage;

import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Tabs, Tab, Image } from 'react-bootstrap';
import 'boxicons';
import ProductsTab from './ProductsTab';
import Cart from '../components/Cart';

const SupplierTab = (props) => {
    const [category, setCategory] = useState('');
    const [showAllProducts, setShowAllProducts] = useState(true);
    const baseURL = process.env.REACT_APP_BASE_URL;

    const handleSwitchChange = () => {
        setShowAllProducts(!showAllProducts);
    };

    useEffect(() => {
        if (props.categorizedProducts && props.categorizedProducts.length > 0) {
            setCategory(props.categorizedProducts[0].name);
        }
    }, [props.categorizedProducts]);

    return (
        <Row>
            <Col sm={12} className="products-section">
                <div className="d-flex justify-content-between align-items-center">
                    <h3 className="section-heading">Categories</h3>
                    <div className="all-products-toggle">
                        <b className="ms-2 mx-2">All Products</b>
                        <Form.Check
                            type="switch"
                            id="all-products-switch"
                            checked={showAllProducts}
                            onChange={handleSwitchChange}
                        />
                    </div>
                </div>
                <Tabs
                    id="category-tab"
                    className="category-tab"
                    activeKey={category}
                    onSelect={(selectedCategory) => setCategory(selectedCategory)}
                >
                    {props.categorizedProducts.map((category, index) => (
                        <Tab
                            key={index}
                            eventKey={category.name}
                            className="mb-3"
                            title={
                                <div className="tab-category-wrapper">
                                    <Image
                                        src={baseURL + category.image}
                                        alt={category.name}
                                        className="category-image"
                                    />
                                    <div className="category-desc">
                                        <h5 style={{ fontWeight: '600' }}>{category['name']}</h5>
                                        <p>{category['stock']} Menu in Stock</p>
                                    </div>
                                </div>
                            }
                        >
                            <ProductsTab
                                products={category.products}
                                supplierId={props.supplierId}
                                supplierName={props.supplierName}
                                holidays={props.holidays}
                            />
                        </Tab>
                    ))}
                </Tabs>
            </Col>

            <Col sm={12} className="cart-sidebar">
                <Cart />
            </Col>
        </Row>
    );
};

export default SupplierTab;

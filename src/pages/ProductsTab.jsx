import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { useCart } from '../context/CartContext';

const ProductsTab = ({ products: initialProducts, supplierId, supplierName, holidays }) => {
    const [products, setProducts] = useState([]);
    const { cart, addToCart } = useCart(); // Access cart from context

    useEffect(() => {
        const initializedProducts = initialProducts.map((product) => ({
            ...product,
            quantity: cart[supplierId]?.products.find((item) => item._id === product._id)?.quantity || 0, // Fetch quantity from cart
        }));
        setProducts(initializedProducts);
    }, [initialProducts, cart, supplierId]); // Re-run whenever cart or initial products change

    const incrementQuantity = (index) => {
        const updatedProducts = [...products];
        updatedProducts[index].quantity += 1;

        setProducts(updatedProducts);
        addToCart(supplierId, supplierName, holidays, updatedProducts[index]);
    };

    const decrementQuantity = (index) => {
        const updatedProducts = [...products];
        if (updatedProducts[index].quantity > 0) {
            updatedProducts[index].quantity -= 1;
        }

        setProducts(updatedProducts);
        addToCart(supplierId, supplierName, holidays, updatedProducts[index]);
    };

    return (
        <Row>
            <Col>
                <h3 className="section-heading">{supplierName}</h3>
                <Row>
                    {products.map((product, index) => (
                        <Col xs={6} sm={6} lg={4} key={index} className="mb-3">
                            <Card className="product-card">
                                <div className="product-image">
                                    <Card.Img
                                        variant="top"
                                        src={process.env.REACT_APP_BASE_URL + product.image}
                                        className="product-img"
                                    />
                                    <Card.Text className="product-price">{product.price}</Card.Text>
                                </div>
                                <Card.Body className="product-desc">
                                    <b>{product.name}</b>
                                    <div className="quantity-control">
                                        <Button
                                            variant="outline-secondary"
                                            className="minus-qty"
                                            onClick={() => decrementQuantity(index)}
                                        >
                                            -
                                        </Button>
                                        <input
                                            type="text"
                                            value={product.quantity} // Reflects cart quantity
                                            className="quantity-input"
                                            readOnly
                                        />
                                        <Button
                                            variant="outline-primary"
                                            className="plus-qty"
                                            onClick={() => incrementQuantity(index)}
                                        >
                                            +
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Col>
        </Row>
    );
};

export default ProductsTab;

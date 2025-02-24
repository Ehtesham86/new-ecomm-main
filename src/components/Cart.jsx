import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Modal, Alert, Spinner } from 'react-bootstrap';
import 'boxicons';
import { useNavigate } from 'react-router-dom';
import CustomDatePicker from './Common/CustomDatePicker';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import cardValidator from 'card-validator';

const Cart = () => {
    const [payment, setPayment] = useState('Card Payment');
    const { cart, deleteCart } = useCart();
    const token = localStorage.getItem('token');
    const baseURL = process.env.REACT_APP_BASE_URL;
    const navigate = useNavigate();

    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [deliveryAddresses, setDeliveryAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [newAddress, setNewAddress] = useState({
        addressLine1: '',
        addressLine2: '',
        townCity: '',
        county: '',
        postcode: ''
    });
    const [deliveryInstructions, setDeliveryInstructions] = useState('');
    const [cards, setCards] = useState([]);
    const [selectedCardId, setSelectedCardId] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardHolderName, setCardHolderName] = useState('');
    const [cardType, setCardType] = useState('');
    const [cardError, setCardError] = useState('');
    const [validationError, setValidationError] = useState('');

    const openAddressModal = () => setIsAddressModalOpen(true);
    const closeAddressModal = () => setIsAddressModalOpen(false);

    const openPaymentModal = () => setIsPaymentModalOpen(true);
    const closePaymentModal = () => setIsPaymentModalOpen(false);

    const [supplierDeliveryData, setSupplierDeliveryData] = useState({});

    useEffect(() => {
        const fetchSupplierData = async () => {
            const updatedSupplierData = {};

            for (const [supplierId, supplierData] of Object.entries(cart)) {
                try {
                    const response = await axios.get(`${baseURL}/api/get-delivery-days-with-shop/${supplierId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (response.data.status) {
                        updatedSupplierData[supplierId] = {
                            deliveryDays: response.data.deliveryDays.days,
                            holidays: supplierData.holidays || [],
                            selectedDate: null, // Initialize selectedDate as null
                        };
                    }
                } catch (error) {
                    console.error(`Error fetching delivery days for supplier ${supplierId}:`, error);
                }
            }

            setSupplierDeliveryData(updatedSupplierData);
        };

        if (Object.keys(cart).length > 0) {
            fetchSupplierData();
        }
    }, [cart, baseURL]);

    useEffect(() => {
        const fetchDeliveryAddresses = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/delivery-addresses`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.status) {
                    setDeliveryAddresses(response.data.addresses);
                    setSelectedAddress(response.data.addresses[0]?._id || '');
                }
            } catch (error) {
                console.error('Error fetching delivery addresses:', error);
            }
        };

        const fetchCards = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/cards`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.status) {
                    setCards(response.data.cards);
                    setSelectedCardId(response.data.cards[0]?._id || '');
                }
            } catch (error) {
                console.error('Error fetching cards:', error);
            }
        };

        fetchDeliveryAddresses();
        fetchCards();
    }, [baseURL, token]);

    const isDateEnabled = (date, deliveryDays, holidays) => {
        const today = new Date();
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
        const formattedDate = date.toISOString().split('T')[0];

        if (date <= today.setHours(0, 0, 0, 0)) {
            return false;
        }

        if (date.toDateString() === new Date(today.setDate(today.getDate() + 1)).toDateString() && today.getHours() < 17) {
            return false;
        }

        return deliveryDays.includes(dayOfWeek) && !holidays.some((holiday) => holiday.startsWith(formattedDate));
    };

    const handleDateChange = (supplierId, date) => {
        setSupplierDeliveryData(prevData => ({
            ...prevData,
            [supplierId]: {
                ...prevData[supplierId],
                selectedDate: date,
            },
        }));
    };

    const validateOrder = () => {
        if (!selectedAddress) {
            setValidationError('Please select a delivery address.');
            return false;
        }

        if (!selectedCardId) {
            setValidationError('Please select a payment method.');
            return false;
        }

        if (Object.keys(cart).length === 0) {
            setValidationError('Your cart is empty.');
            return false;
        }

        for (const [supplierId, supplierData] of Object.entries(cart)) {
            if (!supplierDeliveryData[supplierId]?.selectedDate) {
                setValidationError(`Please select a delivery date for supplier ${supplierData.name}.`);
                return false;
            }
        }

        setValidationError('');
        return true;
    };

    const handlePlaceOrder = async () => {
        if (!validateOrder()) {
            return;
        }

        setIsLoading(true);

        const suppliers = Object.entries(cart).map(([supplierId, { name, products }]) => ({
            supplierId,
            supplierName: name,
            deliveryDate: supplierDeliveryData[supplierId]?.selectedDate || '',
            products: products.map(product => ({
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity: product.quantity
            }))
        }));

        const payload = {
            deliveryAddress: selectedAddress,
            deliveryInstructions,
            paymentMethod: payment,
            paymentDetails: {
                cardId: selectedCardId
            },
            suppliers
        };

        try {
            const response = await axios.post(`${baseURL}/api/place_order`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.status) {
                deleteCart();
                navigate(`/thankyou/${response.data.order._id}`);
            } else {
                alert('Failed to place order');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('An error occurred while placing the order');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddAddress = async () => {
        try {
            const response = await axios.post(`${baseURL}/api/add-delivery-address`, newAddress, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.status) {
                setDeliveryAddresses([...deliveryAddresses, response.data.address]);
                setSelectedAddress(response.data.address._id);
                closeAddressModal();
            } else {
                alert('Failed to add address');
            }
        } catch (error) {
            console.error('Error adding address:', error);
            alert('An error occurred while adding the address');
        }
    };

    const handleAddCard = async () => {
        const newCard = {
            cardNumber,
            expiryDate,
            cvv,
            cardHolderName,
            cardType
        };

        try {
            const response = await axios.post(`${baseURL}/api/add-card`, newCard, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.status) {
                setCards([...cards, response.data.card]);
                setSelectedCardId(response.data.card._id);
                closePaymentModal();
            } else {
                alert('Failed to add card');
            }
        } catch (error) {
            console.error('Error adding card:', error);
            alert('An error occurred while adding the card');
        }
    };

    const handleCardNumberChange = (e) => {
        const number = e.target.value;
        const formattedNumber = number.replace(/\s+/g, '').replace(/(\d{4})/g, '$1 ').trim();
        setCardNumber(formattedNumber);

        const validation = cardValidator.number(number);
        if (validation.card) {
            setCardType(validation.card.type);
            if (!validation.isValid) {
                setCardError('Invalid card number');
            } else {
                setCardError('');
            }
        } else {
            setCardType('');
            setCardError('Invalid card number');
        }
    };

    const formatExpiryDate = (date) => {
        const [year, month] = date.split('-');
        return `${month}/${year}`;
    };

    return (
        <>
            <div className='cart-section'>
                <h3 className='cart-heading'>Cart</h3>

                {validationError && <Alert variant="danger">{validationError}</Alert>}

                <div className='scrollable-section' style={{ maxHeight: '800px', overflowY: 'scroll' }}>
                    {Object.entries(cart).map(([supplierId, { name, products }]) => (
                        <div key={supplierId}>
                            <h5 className="cart-subheading">{name}</h5>

                            <div className="date-input-container">
                                <CustomDatePicker
                                    label="Select Delivery Date"
                                    filterDate={(date) =>
                                        supplierDeliveryData[supplierId]
                                            ? isDateEnabled(
                                                date,
                                                supplierDeliveryData[supplierId].deliveryDays,
                                                supplierDeliveryData[supplierId].holidays
                                            )
                                            : false
                                    }
                                    onChange={(date) => handleDateChange(supplierId, date)}
                                />
                            </div>

                            {products.map((product) => (
                                <Card key={product.id} className="cart-item">
                                    <Card.Img
                                        variant="top"
                                        src={process.env.REACT_APP_BASE_URL + product.image}
                                        className="product-img"
                                    />
                                    <Card.Body>
                                        <Card.Title>{product.name}</Card.Title>
                                        <p>{product.quantity}x</p>
                                        <div className="cart-item-price">
                                            <b>£{product.price}</b>
                                        </div>
                                    </Card.Body>
                                </Card>
                            ))}

                            <hr />
                        </div>
                    ))}
                </div>

                <Form.Group className="mt-3 delivery-section">
                    <h3 className='cart-heading'>Delivery Address</h3>
                    <div className='selected-address'>
                        {deliveryAddresses.map((address, index) => (
                            <div key={index}>
                                <input
                                    type="radio"
                                    checked={selectedAddress === address._id}
                                    onChange={() => setSelectedAddress(address._id)}
                                /> {address.addressLine1}
                            </div>
                        ))}
                    </div>
                    <div className='address-model'>
                        <a href="/" className='address-model-link' onClick={(e) => { e.preventDefault(); openAddressModal(); }}>Add new delivery address</a>
                    </div>
                    <Form.Control as="textarea" className='address-textarea' rows={4} placeholder="Delivery Instructions (Optional)" value={deliveryInstructions} onChange={(e) => setDeliveryInstructions(e.target.value)} />
                </Form.Group>

                <div className="payment-options-container">
                    <h3 className="section-heading">Payment Options</h3>

                    <div className="tab-buttons">
                        <Button
                            variant={payment === 'Card Payment' ? 'primary' : 'outline-secondary'}
                            className="tab-button"
                            onClick={() => setPayment('Card Payment')}
                        >
                            Card Payment
                        </Button>
                        {payment === 'Card Payment' && (
                            <div className="card-payment-content">
                                <p className="subheading">Your credit cards</p>
                                <Form>
                                    {cards.map((card, index) => (
                                        <div className="credit-card-option" key={index}>
                                            <Form.Check
                                                type="radio"
                                                id={`card-${index}`}
                                                name="creditCard"
                                                label={`${cardValidator.number(card.cardNumber).card?.type || 'Unknown'} card ending in ${card.cardNumber.slice(-4)}`}
                                                checked={selectedCardId === card._id}
                                                onChange={() => setSelectedCardId(card._id)}
                                            />
                                            <span className="expiry-date">{formatExpiryDate(card.expiryDate)}</span>
                                        </div>
                                    ))}
                                </Form>
                                <a href="/" className='add-card-link' onClick={(e) => { e.preventDefault(); openPaymentModal(); }}>Add a credit or debit card</a>
                            </div>
                        )}

                        <Button
                            variant={payment === 'Cash on Delivery (Net 30)' ? 'primary' : 'outline-secondary'}
                            className="tab-button"
                            onClick={() => setPayment('Cash on Delivery (Net 30)')}
                        >
                            Cash on Delivery (Net 30)
                        </Button>
                    </div>
                </div>

                <Button className="mt-3 btn place-order-btn" onClick={handlePlaceOrder} disabled={isLoading}>
                    {isLoading ? <Spinner animation="border" size="sm" /> : 'Place Order'}
                </Button>
            </div>
            {/* Address Modal */}
            {isAddressModalOpen && (
                <Modal show={isAddressModalOpen} onHide={closeAddressModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Delivery Address</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="addressLine1">
                                <Form.Label>Address Line 1</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newAddress.addressLine1}
                                    onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                                    placeholder="Start typing your address"
                                />
                            </Form.Group>
                            <Form.Group controlId="addressLine2" className="mt-3">
                                <Form.Label>Address Line 2 (optional)</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newAddress.addressLine2}
                                    onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                                    placeholder="Start typing your address"
                                />
                            </Form.Group>
                            <Form.Group controlId="townCity" className="mt-3">
                                <Form.Label>Town/City</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newAddress.townCity}
                                    onChange={(e) => setNewAddress({ ...newAddress, townCity: e.target.value })}
                                    placeholder="Enter your town/city"
                                />
                            </Form.Group>
                            <Form.Group controlId="county" className="mt-3">
                                <Form.Label>County (if applicable)</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newAddress.county}
                                    onChange={(e) => setNewAddress({ ...newAddress, county: e.target.value })}
                                    placeholder="Enter county"
                                />
                            </Form.Group>
                            <Form.Group controlId="postcode" className="mt-3">
                                <Form.Label>Postcode</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newAddress.postcode}
                                    onChange={(e) => setNewAddress({ ...newAddress, postcode: e.target.value })}
                                    placeholder="Enter your area postcode"
                                />
                            </Form.Group>
                            <Button variant="primary" className="mt-4 w-100 modal-btn" onClick={handleAddAddress}>
                                Save Address
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            )}

            {/* Payment Modal */}
            {isPaymentModalOpen && (
                <Modal show={isPaymentModalOpen} onHide={closePaymentModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Add card and save for future purchases</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form className='card-payment-form'>
                            <Form.Group controlId="number" className="mt-3 card-payment-input">
                                <Form.Label>Card Number</Form.Label>
                                <Form.Control type="text" value={cardNumber} onChange={handleCardNumberChange} />
                                {cardError && <p className="text-danger">{cardError}</p>}
                            </Form.Group>
                            <Form.Group controlId="name" className="mt-3 card-payment-input">
                                <Form.Label>Name on card</Form.Label>
                                <Form.Control type="text" value={cardHolderName} onChange={(e) => setCardHolderName(e.target.value)} />
                            </Form.Group>
                            <Form.Group controlId="exp-date" className="mt-3 card-payment-input">
                                <Form.Label>Expiration date</Form.Label>
                                <Form.Control type="month" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
                            </Form.Group>
                            <Form.Group controlId="cvv" className="mt-3 card-payment-input">
                                <Form.Label>Security Code (CVV/CVC)</Form.Label>
                                <Form.Control type="text" value={cvv} onChange={(e) => setCvv(e.target.value)} />
                            </Form.Group>
                            <Button variant="primary" className="mt-4 w-100 modal-btn" onClick={handleAddCard}>
                                Add your card
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            )}
        </>
    );
};

export default Cart;
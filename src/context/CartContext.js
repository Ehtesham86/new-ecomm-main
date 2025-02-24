import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = Cookies.get('cart');
        return savedCart ? JSON.parse(savedCart) : {};
    });

    const addToCart = (supplierId, supplierName, holidays, product) => {
        setCart((prevCart) => {
            const currentSupplierCart = prevCart[supplierId]?.products || [];

            const existingProduct = currentSupplierCart.find((item) => item._id === product._id);

            let updatedSupplierCart;
            if (existingProduct) {
                updatedSupplierCart = currentSupplierCart.map((item) =>
                    item._id === product._id ? { ...item, quantity: product.quantity } : item
                );
            } else {
                updatedSupplierCart = [...currentSupplierCart, product];
            }

            updatedSupplierCart = updatedSupplierCart.filter((item) => item.quantity > 0);

            if (updatedSupplierCart.length === 0) {
                const { [supplierId]: removedSupplier, ...remainingCart } = prevCart;
                return remainingCart;
            }

            return {
                ...prevCart,
                [supplierId]: {
                    name: supplierName,
                    holidays: holidays,
                    products: updatedSupplierCart,
                },
            };
        });
    };

    const deleteCart = () => {
        setCart({});
        Cookies.remove('cart');
    };

    useEffect(() => {
        Cookies.set('cart', JSON.stringify(cart), { expires: 7 });
    }, [cart]);

    return (
        <CartContext.Provider value={{ cart, addToCart, deleteCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};

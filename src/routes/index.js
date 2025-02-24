import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from "../context/ProtectedRoute";
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordEmailSentPage from '../pages/auth/ResetPasswordEmailSentPage';
import UpdatePasswordPage from '../pages/auth/UpdatePasswordPage';
import ThankYouPage from '../pages/ThankYouPage';
import InvoicePage from '../pages/InvoicePage';
import InvoicePage2 from '../pages/InvoicePage2';

const AppRoutes = () => (
    
    <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password-email-sent" element={<ResetPasswordEmailSentPage />} />
        <Route path="/update-password/:token" element={<UpdatePasswordPage />} />
        <Route path="/store" element={<ProtectedRoute element={HomePage} allowedRoles={['branch']} />} />
        <Route path="/thankyou/:orderId" element={<ProtectedRoute element={ThankYouPage} allowedRoles={['branch']} />} />
        <Route path="/invoice" element={<InvoicePage />} />
        <Route path="/invoice-2" element={<InvoicePage2 />} />
    </Routes>
);

export default AppRoutes;

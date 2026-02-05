import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import FormBuilder from './pages/FormBuilder';
import Layout from './components/Layout';
import { isAuthenticated } from './services/api';

function ProtectedRoute({ children }) {
    return isAuthenticated() ? (
        <Layout>{children}</Layout>
    ) : (
        <Navigate to="/login" />
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/members"
                    element={
                        <ProtectedRoute>
                            <Members />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/form-builder"
                    element={
                        <ProtectedRoute>
                            <FormBuilder />
                        </ProtectedRoute>
                    }
                />

                <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

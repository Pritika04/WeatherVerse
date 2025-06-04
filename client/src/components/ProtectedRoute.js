import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "universal-cookie";

export default function ProtectedRoute({ children }) {
    const cookies = new Cookies();
    const token = cookies.get("TOKEN");

    if (!token) {
        return <Navigate to="/" />;
    }

    return children;
}
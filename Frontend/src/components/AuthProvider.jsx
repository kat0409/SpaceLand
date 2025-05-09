import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        token: null,
        role: null,
        userID: null,
        isAuthenticated: false,
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        const userID = localStorage.getItem("userID");

        if(role && userID){
            setAuth({
                token,
                role,
                userID,
                isAuthenticated: true,
            });
        }
    }, []);

    const logout = () => {
        localStorage.clear();
        setAuth({
            token: null,
            role: null,
            userID: null,
            isAuthenticated: false,
        });
    };

    return (
        <AuthContext.Provider value={{ auth, setAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
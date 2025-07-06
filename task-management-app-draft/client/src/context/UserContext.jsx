import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, checkAuth } from '../utils/api';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    useEffect(() => {
        const checkUserAuth = async () => {
            try {
                const data = await checkAuth();
                setUser(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        checkUserAuth();
    }, []);
    
    const login = async (email, password) => {
        const data = await loginUser(email, password);
        setUser(data);
        navigate('/');
    };
    
    const register = async (name, email, password) => {
        const data = await registerUser(name, email, password);
        setUser(data);
        navigate('/');
    };
    
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };
    
    return (
        <UserContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </UserContext.Provider>
    );
};
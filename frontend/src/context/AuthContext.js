import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const res = await api.get('/api/auth/me');
      setUser(res.data.user);
    } catch (error) {
      console.error('Load user error:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role) => {
    try {
      console.log('Registering user...');
      const res = await api.post('/api/auth/register', {
        name,
        email,
        password,
        role
      });
      
      console.log('Register response:', res.data);
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        toast.success('Registration successful!');
        return true;
      }
    } catch (error) {
      console.error('Register error:', error.response?.data || error.message);
      toast.error(error.response?.data?.error || 'Registration failed');
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Logging in user...');
      const res = await api.post('/api/auth/login', { email, password });
      
      console.log('Login response:', res.data);
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        toast.success('Login successful!');
        return true;
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      toast.error(error.response?.data?.error || 'Login failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
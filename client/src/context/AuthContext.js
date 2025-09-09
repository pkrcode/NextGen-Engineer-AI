import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);



  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authAPI.getProfile();
          setUser(response.data.user);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      await authAPI.register(userData);
      toast.success('Registration successful! Please login to continue.');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, user: loggedInUser } = response.data;
      
      localStorage.setItem('token', token);
      setUser(loggedInUser);
      
      toast.success(`Welcome back, ${loggedInUser.firstName || loggedInUser.username}!`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      setUser(response.data.user);
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    try {
      await authAPI.changePassword(passwordData);
      toast.success('Password changed successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      await authAPI.forgotPassword(email);
      toast.success('Password reset email sent');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset email';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Reset password
  const resetPassword = async (resetData) => {
    try {
      await authAPI.resetPassword(resetData);
      toast.success('Password reset successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Verify email
  const verifyEmail = async (token) => {
    try {
      const response = await authAPI.verifyEmail(token);
      setUser(response.data.user);
      toast.success('Email verified successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Email verification failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    verifyEmail,
    refreshUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isStudent: user?.role === 'student'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('nostalgia_token'));
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchCurrentUser = useCallback(async () => {
    const savedToken = localStorage.getItem('nostalgia_token');
    if (!savedToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/auth/me');
      if (res.success && res.user) {
        setUser(res.user);
      }
    } catch (err) {
      console.warn('Session expired or invalid:', err.message);
      localStorage.removeItem('nostalgia_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (identifier, password) => {
    try {
      const res = await api.post('/auth/login', { identifier, password });
      if (res.success) {
        localStorage.setItem('nostalgia_token', res.token);
        setToken(res.token);
        setUser(res.user);
        toast.success(`Welcome back to the time machine, ${res.user.username}! 🕰️`);
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch (err) {
      toast.error(err.data?.message || err.message || 'Login failed');
      return { success: false, message: err.data?.message || err.message };
    }
  };

  const register = async ({ username, email, password, eraPreference, bio }) => {
    try {
      const res = await api.post('/auth/register', {
        username,
        email,
        password,
        eraPreference,
        bio,
      });
      if (res.success) {
        localStorage.setItem('nostalgia_token', res.token);
        setToken(res.token);
        setUser(res.user);
        toast.success(`Account created! Welcome, ${res.user.username} 🚀`);
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch (err) {
      toast.error(err.data?.message || err.message || 'Registration failed');
      return { success: false, message: err.data?.message || err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('nostalgia_token');
    setToken(null);
    setUser(null);
    toast.info('You have left the time machine. See you soon!');
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await api.put('/auth/profile', profileData);
      if (res.success) {
        setUser(res.user);
        toast.success('Profile updated successfully!');
        return { success: true };
      }
    } catch (err) {
      toast.error('Failed to update profile');
      return { success: false };
    }
  };

  const isSavedPost = (postId) => {
    if (!user || !user.savedPosts) return false;
    return user.savedPosts.some(
      (p) => (typeof p === 'object' ? p._id : p) === postId
    );
  };

  const isJoinedCommunity = (communityId) => {
    if (!user || !user.joinedCommunities) return false;
    return user.joinedCommunities.some(
      (c) => (typeof c === 'object' ? c._id : c) === communityId
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        refreshUser: fetchCurrentUser,
        isSavedPost,
        isJoinedCommunity,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

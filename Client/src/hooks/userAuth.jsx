import { useEffect, useState, createContext, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth state on app load
useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      
      // If no token exists in storage, don't bother the server
      if (!token) {
        setLoading(false);
        return; 
      }

      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
        localStorage.removeItem('token'); 
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const {accessToken,user} = res.data.data

    localStorage.setItem('token',accessToken)
    setUser(user);
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
  };


  const register =  async(username, email, password, confirm )=>{
    const res = await api.post('/auth/signup',{username, email, password, confirm})
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout,register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
};

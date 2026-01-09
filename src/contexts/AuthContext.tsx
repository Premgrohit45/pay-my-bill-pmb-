import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, getUsers, saveUsers, initializeData } from '@/lib/mockData';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Omit<User, 'id'>) => Promise<boolean>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    initializeData();
    const savedUser = localStorage.getItem('paymybill_current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (emailOrUsername: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = getUsers();
    const foundUser = users.find(u => (u.username === emailOrUsername || u.email === emailOrUsername) && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('paymybill_current_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('paymybill_current_user');
  };

  const register = async (userData: Omit<User, 'id'>): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = getUsers();
    if (users.find(u => u.username === userData.username || u.email === userData.email)) {
      return false;
    }
    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}`,
    };
    users.push(newUser);
    saveUsers(users);
    setUser(newUser);
    localStorage.setItem('paymybill_current_user', JSON.stringify(newUser));
    return true;
  };

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    const users = getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      const updatedUser = { ...users[index], ...userData };
      users[index] = updatedUser;
      saveUsers(users);
      setUser(updatedUser);
      localStorage.setItem('paymybill_current_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateUser }}>
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

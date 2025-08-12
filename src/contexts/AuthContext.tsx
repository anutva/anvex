import React, { createContext, useState, useContext, ReactNode } from 'react';
import { CredentialResponse } from '@react-oauth/google';

// Define the shape of the user profile
interface UserProfile {
  email: string;
  name: string;
  picture: string;
}

// Define the shape of the AuthContext
interface AuthContextType {
  user: UserProfile | null;
  login: (credentialResponse: CredentialResponse) => void;
  logout: () => void;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  const login = (credentialResponse: CredentialResponse) => {
    // Decode the credential to get user info
    if (credentialResponse.credential) {
      const decoded: { email: string, name: string, picture: string } = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
      setUser({
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
      });
    }
  };

  const logout = () => {
    setUser(null);
    // Here you might also want to clear any related local storage, cookies, etc.
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

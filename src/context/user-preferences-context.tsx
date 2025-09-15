
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserPreferencesContextType {
  pincode: string | null;
  setPincode: (pincode: string) => void;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const UserPreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [pincode, setPincodeState] = useState<string | null>(null);

  // Load preferences from localStorage on initial render
  useEffect(() => {
    try {
      const savedPincode = localStorage.getItem('viraasat-pincode');
      if (savedPincode) {
        setPincodeState(savedPincode);
      }
    } catch (error) {
      console.error("Failed to parse pincode from localStorage", error);
    }
  }, []);

  const setPincode = (newPincode: string) => {
    if (newPincode.length === 6 && /^\d+$/.test(newPincode)) {
        setPincodeState(newPincode);
        localStorage.setItem('viraasat-pincode', newPincode);
    } else {
        setPincodeState(null);
        localStorage.removeItem('viraasat-pincode');
    }
  };


  return (
    <UserPreferencesContext.Provider
      value={{
        pincode,
        setPincode,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};

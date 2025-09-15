
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';

type FeatherlightMode = 'on' | 'off' | 'auto';

interface FeatherlightContextType {
  mode: FeatherlightMode;
  setMode: (mode: FeatherlightMode) => void;
  isFeatherlightActive: boolean;
}

const FeatherlightContext = createContext<FeatherlightContextType | undefined>(undefined);

// Define a type for the navigator.connection object
interface NetworkInformation extends EventTarget {
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  saveData?: boolean;
  downlink?: number;
}

export const FeatherlightProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<FeatherlightMode>('auto');
  const [isSlowNetwork, setIsSlowNetwork] = useState(false);

  // Load saved preference from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('featherlight-mode') as FeatherlightMode | null;
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  // Save preference to localStorage and detect network speed
  useEffect(() => {
    localStorage.setItem('featherlight-mode', mode);

    const checkNetwork = () => {
      const connection = (navigator as any).connection as NetworkInformation | undefined;
      if (!connection) {
        setIsSlowNetwork(false);
        return;
      }
      
      const slow = connection.saveData || 
                   ['slow-2g', '2g'].includes(connection.effectiveType || '') ||
                   (connection.downlink || 0) < 1; // Less than 1 Mbps
      setIsSlowNetwork(slow);
    };

    checkNetwork();

    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', checkNetwork);
      return () => connection.removeEventListener('change', checkNetwork);
    }
  }, [mode]);

  const isFeatherlightActive = useMemo(() => {
    if (mode === 'on') return true;
    if (mode === 'off') return false;
    // 'auto' mode
    return isSlowNetwork;
  }, [mode, isSlowNetwork]);

  const value = {
    mode,
    setMode,
    isFeatherlightActive,
  };

  return (
    <FeatherlightContext.Provider value={value}>
      {children}
    </FeatherlightContext.Provider>
  );
};

export const useFeatherlight = () => {
  const context = useContext(FeatherlightContext);
  if (context === undefined) {
    throw new Error('useFeatherlight must be used within a FeatherlightProvider');
  }
  return context;
};

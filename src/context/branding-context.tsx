'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface BrandingContextType {
  logo: string | null;
  setLogo: (logo: string | null) => void;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export const BrandingProvider = ({ children }: { children: ReactNode }) => {
  const [logo, setLogo] = useState<string | null>(null);

  return (
    <BrandingContext.Provider value={{ logo, setLogo }}>
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = () => {
  const context = useContext(BrandingContext);
  if (context === undefined) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
};

// src/context/command-context.tsx
'use client';
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface CommandContextType {
  isCommandOpen: boolean;
  setCommandOpen: (open: boolean) => void;
}

const CommandContext = createContext<CommandContextType | undefined>(undefined);

export const CommandProvider = ({ children }: { children: ReactNode }) => {
  const [isCommandOpen, setCommandOpen] = useState(false);

  return (
    <CommandContext.Provider value={{ isCommandOpen, setCommandOpen }}>
      {children}
    </CommandContext.Provider>
  );
};

export const useCommand = () => {
  const context = useContext(CommandContext);
  if (context === undefined) {
    throw new Error('useCommand must be used within a CommandProvider');
  }
  return context;
};

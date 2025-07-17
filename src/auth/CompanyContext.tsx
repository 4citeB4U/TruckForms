"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from './AuthProvider';

interface CompanyContextType {
  companyId: string | null;
  company: any | null;
  setCompanyId: (id: string | null) => void;
}

const CompanyContext = createContext<CompanyContextType>({
  companyId: null,
  company: null,
  setCompanyId: () => {},
});

export function useCompany() {
  return useContext(CompanyContext);
}

export function CompanyProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [company, setCompany] = useState<any | null>(null);

  useEffect(() => {
    if (user) {
      // Fetch user's companyId from Firestore user profile
      // For demo, assume companyId is stored in user metadata
      const fetchCompany = async () => {
        // Replace with actual user profile fetch
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
        if (userData?.companyId) {
          setCompanyId(userData.companyId);
          const companyDoc = await getDoc(doc(db, 'companies', userData.companyId));
          setCompany(companyDoc.data());
        }
      };
      fetchCompany();
    } else {
      setCompanyId(null);
      setCompany(null);
    }
  }, [user]);

  return (
    <CompanyContext.Provider value={{ companyId, company, setCompanyId }}>
      {children}
    </CompanyContext.Provider>
  );
}

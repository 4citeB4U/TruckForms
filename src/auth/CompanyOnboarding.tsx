"use client";
import { useState } from 'react';
import { db } from './firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useAuth } from './AuthProvider';

export function CompanyOnboarding({ onCompleteAction }: { onCompleteAction?: () => void }) {
  const { user } = useAuth();
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const docRef = await addDoc(collection(db, 'companies'), {
        name: companyName,
        createdAt: Timestamp.now(),
        ownerId: user?.uid,
        members: [user?.uid],
      });
      // Optionally update user profile with companyId
      if (onCompleteAction) onCompleteAction();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCreateCompany} className="space-y-4">
      <input
        type="text"
        placeholder="Company Name"
        value={companyName}
        onChange={e => setCompanyName(e.target.value)}
        required
        className="input"
      />
      <button type="submit" className="btn" disabled={loading}>Create Company</button>
      {error && <div className="text-red-500">{error}</div>}
    </form>
  );
}

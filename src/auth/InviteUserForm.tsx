"use client";
import { useState } from 'react';
import { db } from './firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useCompany } from './CompanyContext';

export function InviteUserForm() {
  const { companyId } = useCompany();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('driver');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await addDoc(collection(db, 'users'), {
        email,
        companyId,
        role,
        joinedAt: Timestamp.now(),
      });
      setSuccess(true);
      setEmail('');
      setRole('driver');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleInvite} className="space-y-4">
      <input
        type="email"
        placeholder="User Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="input"
      />
      <select value={role} onChange={e => setRole(e.target.value)} className="input">
        <option value="admin">Admin</option>
        <option value="manager">Manager</option>
        <option value="driver">Driver</option>
        <option value="dispatcher">Dispatcher</option>
        <option value="trainer">Trainer</option>
      </select>
      <button type="submit" className="btn" disabled={loading}>Invite User</button>
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">User invited!</div>}
    </form>
  );
}

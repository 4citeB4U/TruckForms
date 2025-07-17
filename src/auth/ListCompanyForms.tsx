"use client";
import { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useCompany } from './CompanyContext';

export function ListCompanyForms() {
  const { companyId } = useCompany();
  const [forms, setForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) return;
    const fetchForms = async () => {
      setLoading(true);
      const q = query(collection(db, 'formSubmissions'), where('companyId', '==', companyId));
      const snapshot = await getDocs(q);
      setForms(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchForms();
  }, [companyId]);

  if (loading) return <div>Loading forms...</div>;
  if (!forms.length) return <div>No forms submitted yet.</div>;

  return (
    <div>
      <h2 className="font-bold mb-2">Company Form Submissions</h2>
      <ul>
        {forms.map(form => (
          <li key={form.id} className="mb-2">
            <strong>{form.formType}</strong> by {form.userId} on {form.submittedAt?.toDate().toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

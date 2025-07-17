import { db } from './firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useCompany } from './CompanyContext';
import { useAuth } from './AuthProvider';

export async function submitFormToCompany(formType: string, data: Record<string, any>) {
  const { companyId } = useCompany();
  const { user } = useAuth();
  if (!companyId || !user) throw new Error('No company or user context');
  await addDoc(collection(db, 'formSubmissions'), {
    companyId,
    userId: user.uid,
    formType,
    data,
    submittedAt: Timestamp.now(),
  });
}

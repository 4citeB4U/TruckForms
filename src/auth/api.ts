// Example REST API endpoints for integrations
import { db } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next';

// GET /api/company/:companyId/forms
export async function getCompanyForms(req: NextApiRequest, res: NextApiResponse) {
  const { companyId } = req.query;
  if (!companyId) return res.status(400).json({ error: 'Missing companyId' });
  const q = query(collection(db, 'formSubmissions'), where('companyId', '==', companyId));
  const snapshot = await getDocs(q);
  const forms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.status(200).json(forms);
}

// More endpoints can be added for users, companies, webhooks, etc.

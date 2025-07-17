// Firestore data model for companies, users, and form submissions
import { Timestamp } from 'firebase/firestore';

export interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  createdAt: Timestamp;
  ownerId: string;
  members: string[]; // user IDs
  settings?: Record<string, any>;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  companyId: string;
  role: 'admin' | 'manager' | 'driver' | 'dispatcher' | 'trainer';
  joinedAt: Timestamp;
}

export interface FormSubmission {
  id: string;
  companyId: string;
  userId: string;
  formType: string;
  data: Record<string, any>;
  submittedAt: Timestamp;
}

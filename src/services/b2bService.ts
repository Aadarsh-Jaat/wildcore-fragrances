import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

export type B2BInquiryStatus = 'new' | 'contacted' | 'closed';

export interface B2BInquiry {
  id: string;
  businessName: string;
  businessType: string;
  phone: string;
  city: string;
  quantity: string;
  brandName: string;
  message: string;
  status: B2BInquiryStatus;
  createdAt?: any;
}

const b2bRef = collection(db, 'b2bInquiries');

export async function addB2BInquiry(
  inquiry: Omit<B2BInquiry, 'id' | 'status' | 'createdAt'>
) {
  return addDoc(b2bRef, {
    ...inquiry,
    status: 'new',
    createdAt: serverTimestamp(),
  });
}

export async function getB2BInquiries(): Promise<B2BInquiry[]> {
  const snapshot = await getDocs(b2bRef);

  return snapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...docSnap.data(),
  })) as B2BInquiry[];
}

export async function updateB2BInquiryStatus(
  id: string,
  status: B2BInquiryStatus
) {
  const inquiryRef = doc(db, 'b2bInquiries', id);
  return updateDoc(inquiryRef, { status });
}
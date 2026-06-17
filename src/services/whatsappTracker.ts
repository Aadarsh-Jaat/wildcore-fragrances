import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore';

export interface WhatsAppClick {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  volume?: number;
  customerName?: string;
  phone?: string;
  email?: string;
  message: string;
  whatsappLink: string;
  source: 'product_page' | 'cart' | 'homepage' | 'custom';
  status: 'new' | 'contacted' | 'ordered' | 'converted' | 'lost';
  notes?: string;
  createdAt: any;
  userAgent?: string;
  ip?: string;
}

export const trackWhatsAppClick = async (data: Omit<WhatsAppClick, 'id' | 'createdAt' | 'status'>) => {
  try {
    console.log('📤 Tracking WhatsApp click:', data);
    
    const clickData = {
      ...data,
      status: 'new' as const,
      createdAt: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };
    
    const docRef = await addDoc(collection(db, 'whatsappClicks'), clickData);
    console.log('✅ WhatsApp click tracked! ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error tracking WhatsApp click:', error);
    return null;
  }
};

export const getWhatsAppClicks = async () => {
  try {
    const q = query(collection(db, 'whatsappClicks'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as WhatsAppClick[];
  } catch (error) {
    console.error('Error fetching WhatsApp clicks:', error);
    return [];
  }
};

export const updateWhatsAppClickStatus = async (id: string, status: WhatsAppClick['status'], notes?: string) => {
  try {
    await updateDoc(doc(db, 'whatsappClicks', id), {
      status,
      notes: notes || '',
      updatedAt: new Date().toISOString(),
    });
    console.log('✅ WhatsApp click updated!');
  } catch (error) {
    console.error('Error updating WhatsApp click:', error);
  }
};
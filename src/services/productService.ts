import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase';

export interface ProductVolume {
  ml: number;
  price: number;
}

export interface ProductNotes {
  top: string[];
  middle: string[];
  base: string[];
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  gender: string;
  type: string;
  image: string;
  images: string[];
  notes: ProductNotes;
  volumes: ProductVolume[];
  rating: number;
  reviews: number;
  stock: number;
  bestseller: boolean;
  newArrival: boolean;
}

const productsRef = collection(db, 'products');

export async function getProducts(): Promise<Product[]> {
  const snapshot = await getDocs(productsRef);

  return snapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...docSnap.data(),
  })) as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
  const productRef = doc(db, 'products', id);
  const snapshot = await getDoc(productRef);

  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Product;
}

export async function addProduct(id: string, product: Omit<Product, 'id'>) {
  const productRef = doc(db, 'products', id);
  return setDoc(productRef, product);
}

export async function updateProduct(id: string, product: Partial<Product>) {
  const productRef = doc(db, 'products', id);
  return updateDoc(productRef, product);
}

export async function deleteProduct(id: string) {
  const productRef = doc(db, 'products', id);
  return deleteDoc(productRef);
}
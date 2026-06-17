import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  addDoc,
} from "firebase/firestore";

import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Package,
  LogOut,
  Plus,
  Boxes,
  Trash2,
  Edit,
  X,
  Briefcase,
  Mail,
  FileText,
  Download,
  Eye,
  Send,
} from 'lucide-react';
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from '../services/productService';
import {
  getB2BInquiries,
  updateB2BInquiryStatus,
  type B2BInquiry,
} from '../services/b2bService';
import type { Product } from '../services/productService';

type Tab = 'orders' | 'users' | 'products' | 'b2b' | 'subscribers' | 'invoices' | 'whatsapp';
type ProductForm = Omit<Product, 'id'>;

interface FirestoreUser {
  id: string;
  name: string;
  email: string;
  role: string;
  address?: string;
  phone?: string;
  orders: any[];
}

interface OrderItem {
  name: string;
  volume: number;
  qty: number;
  price: number;
}

interface Order {
  id: string;
  userId: string;
  userName: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: 'processing' | 'shipped' | 'delivered';
  paymentStatus: 'paid' | 'unpaid';
  note?: string;
}

interface Subscriber {
  id: string;
  email: string;
  source: string;
  createdAt?: any;
}

interface InvoiceItem {
  productName: string;
  qty: number;
  price: number;
}

interface Invoice {
  id: string;
  invoiceNo: string;
  buyerName: string;
  buyerPhone: string;
  buyerAddress: string;
  date: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  grandTotal: number;
  advanceReceived: number;
  balanceDue: number;
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  notes?: string;
  createdAt?: any;
}

interface WhatsAppClick {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  volume?: number;
  customerName?: string;
  phone?: string;
  email?: string;
  address?: string;
  message: string;
  whatsappLink: string;
  source: 'product_page' | 'cart' | 'homepage' | 'custom';
  status: 'new' | 'contacted' | 'ordered' | 'converted' | 'lost';
  notes?: string;
  createdAt: any;
  userAgent?: string;
  ip?: string;
}

const createAutoInvoiceNo = () => {
  const year = new Date().getFullYear();
  const timeCode = Date.now().toString().slice(-6);
  return `WC-INV-${year}-${timeCode}`;
};

const emptyInvoiceForm = {
  invoiceNo: createAutoInvoiceNo(),
  buyerName: '',
  buyerPhone: '',
  buyerAddress: '',
  date: new Date().toISOString().slice(0, 10),
  items: [{ productName: '', qty: 1, price: 0 }] as InvoiceItem[],
  discount: 0,
  deliveryCharge: 0,
  advanceReceived: 0,
  balanceDue: 0,
  paymentStatus: 'unpaid' as 'unpaid' | 'partial' | 'paid',
  notes: '',
};

const emptyProductForm: ProductForm = {
  name: '',
  tagline: '',
  description: '',
  category: 'Luxury',
  gender: 'Unisex',
  type: 'Liquid Perfume',
  image: '',
  images: [],
  notes: {
    top: [],
    middle: [],
    base: [],
  },
  volumes: [
    { ml: 30, price: 0 },
    { ml: 8, price: 0 },
    { ml: 100, price: 0 },
  ],
  rating: 4.5,
  reviews: 0,
  stock: 10,
  bestseller: false,
  newArrival: false,
};

export default function Admin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // State
  const [tab, setTab] = useState<Tab>('orders');
  const [users, setUsers] = useState<FirestoreUser[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [b2bInquiries, setB2BInquiries] = useState<B2BInquiry[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [whatsappClicks, setWhatsappClicks] = useState<WhatsAppClick[]>([]);
  const [loading, setLoading] = useState(true);

  // Order Modal
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { name: '', volume: 50, qty: 1, price: 0 },
  ]);
  const [orderNote, setOrderNote] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'unpaid'>('unpaid');

  // Product Modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productId, setProductId] = useState('');
  const [productForm, setProductForm] = useState<ProductForm>(emptyProductForm);

  // Invoice
  const [saving, setSaving] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState(emptyInvoiceForm);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Auth check
  useEffect(() => {
    if (user && user.role !== 'admin') navigate('/');
  }, [user, navigate]);

  // Fetch data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    try {
      // Users
      const usersSnap = await getDocs(collection(db, 'users'));
      const usersData = usersSnap.docs.map(d => ({
        id: d.id,
        ...d.data(),
      })) as FirestoreUser[];
      setUsers(usersData);

      // Orders
      const allOrders: Order[] = [];
      usersData.forEach(u => {
        if (u.orders && u.orders.length > 0) {
          u.orders.forEach((o: any) => {
            allOrders.push({ ...o, userId: u.id, userName: u.name });
          });
        }
      });
      allOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setOrders(allOrders);

      // Products
      const productsData = await getProducts();
      setProducts(productsData);

      // B2B
      const inquiriesData = await getB2BInquiries();
      setB2BInquiries(inquiriesData);

      // Subscribers
      const subscribersSnap = await getDocs(collection(db, 'newsletterSubscribers'));
      const subscribersData = subscribersSnap.docs.map(d => ({
        id: d.id,
        ...d.data(),
      })) as Subscriber[];
      setSubscribers(subscribersData);

      // Invoices
      const invoicesSnap = await getDocs(collection(db, 'invoices'));
      const invoicesData = invoicesSnap.docs.map(d => ({
        id: d.id,
        ...d.data(),
      })) as Invoice[];
      invoicesData.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.date).getTime();
        const dateB = new Date(b.createdAt || b.date).getTime();
        return dateB - dateA;
      });
      setInvoices(invoicesData);

      // WhatsApp Clicks
      const clicksQuery = query(collection(db, 'whatsappClicks'), orderBy('createdAt', 'desc'));
      const clicksSnap = await getDocs(clicksQuery);
      const clicksData = clicksSnap.docs.map(d => ({
        id: d.id,
        ...d.data(),
      })) as WhatsAppClick[];
      setWhatsappClicks(clicksData);

    } catch (error) {
      console.error('Admin fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Order functions
  const addItem = () => {
    setOrderItems([...orderItems, { name: '', volume: 50, qty: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof OrderItem, value: string | number) => {
    setOrderItems(orderItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  };

  const createOrder = async () => {
    if (!selectedUserId) return alert('Please select a user');
    if (orderItems.some(i => !i.name || i.price === 0)) return alert('Fill all item details');

    setSaving(true);

    const targetUser = users.find(u => u.id === selectedUserId);
    if (!targetUser) {
      setSaving(false);
      return;
    }

    const newOrder = {
      id: `WC-${Date.now()}`,
      date: new Date().toISOString(),
      items: orderItems,
      total: calculateTotal(),
      status: 'processing' as const,
      paymentStatus,
      note: orderNote || '',
    };

    const updatedOrders = [...(targetUser.orders || []), newOrder];
    await updateDoc(doc(db, 'users', selectedUserId), { orders: updatedOrders });

    setSelectedUserId('');
    setOrderItems([{ name: '', volume: 50, qty: 1, price: 0 }]);
    setOrderNote('');
    setPaymentStatus('unpaid');
    setShowOrderModal(false);
    setSaving(false);
    await fetchData();
  };

  const updateOrderStatus = async (
    userId: string,
    orderId: string,
    newStatus: Order['status']
  ) => {
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          orders: u.orders.map(o =>
            o.id === orderId ? { ...o, status: newStatus } : o
          ),
        };
      }
      return u;
    });

    setUsers(updatedUsers);
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    const targetUser = updatedUsers.find(u => u.id === userId);
    if (targetUser) {
      await updateDoc(doc(db, 'users', userId), { orders: targetUser.orders });
    }
  };

  const updatePaymentStatus = async (
    userId: string,
    orderId: string,
    newPaymentStatus: Order["paymentStatus"]
  ) => {
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          orders: u.orders.map(o =>
            o.id === orderId ? { ...o, paymentStatus: newPaymentStatus } : o
          ),
        };
      }
      return u;
    });

    setUsers(updatedUsers);
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId ? { ...o, paymentStatus: newPaymentStatus } : o
      )
    );

    const userRef = doc(db, "users", userId);
    const targetUser = updatedUsers.find(u => u.id === userId);
    if (targetUser) {
      await updateDoc(userRef, { orders: targetUser.orders });
    }
  };

  // Product functions
  const updateProductStock = async (productId: string, stock: number) => {
    await updateProduct(productId, { stock });
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, stock } : p))
    );
  };

  const toggleProductField = async (
    product: Product,
    field: 'bestseller' | 'newArrival'
  ) => {
    const newValue = !product[field];
    await updateProduct(product.id, { [field]: newValue });
    setProducts(prev =>
      prev.map(p => (p.id === product.id ? { ...p, [field]: newValue } : p))
    );
  };

  const openAddProduct = () => {
    setEditingProduct(null);
    setProductId('');
    setProductForm(emptyProductForm);
    setShowProductModal(true);
  };

  const openEditProduct = (product: Product) => {
    const sortedVolumes = [...(product.volumes || [])].sort((a, b) => {
      const priority: Record<number, number> = { 30: 0, 8: 1, 50: 2, 100: 3 };
      return (priority[a.ml] ?? 99) - (priority[b.ml] ?? 99);
    });

    setEditingProduct(product);
    setProductId(product.id);
    setProductForm({
      name: product.name,
      tagline: product.tagline || '',
      description: product.description || '',
      category: product.category || 'Luxury',
      gender: product.gender || 'Unisex',
      type: product.type || 'Liquid Perfume',
      image: product.image || '',
      images: product.images || [],
      notes: product.notes || { top: [], middle: [], base: [] },
      volumes: sortedVolumes,
      rating: product.rating || 4.5,
      reviews: product.reviews || 0,
      stock: product.stock || 0,
      bestseller: product.bestseller || false,
      newArrival: product.newArrival || false,
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async () => {
    if (!productId.trim()) return alert('Product ID is required');
    if (!productForm.name.trim()) return alert('Product name is required');
    if (!productForm.image.trim()) return alert('Product image is required');

    setSaving(true);

    const cleanId = productId.trim().toLowerCase().replace(/\s+/g, '-');

    const finalProduct = {
      ...productForm,
      images: productForm.images.length > 0 ? productForm.images : [productForm.image],
    };

    if (editingProduct) {
      await updateProduct(editingProduct.id, finalProduct);
    } else {
      await addProduct(cleanId, finalProduct);
    }

    setShowProductModal(false);
    setEditingProduct(null);
    setProductId('');
    setProductForm(emptyProductForm);
    setSaving(false);
    await fetchData();
  };

  const updateVolume = (index: number, field: 'ml' | 'price', value: number) => {
    setProductForm(prev => ({
      ...prev,
      volumes: prev.volumes.map((v, i) =>
        i === index ? { ...v, [field]: value } : v
      ),
    }));
  };

  const updateNotes = (layer: 'top' | 'middle' | 'base', value: string) => {
    setProductForm(prev => ({
      ...prev,
      notes: {
        ...prev.notes,
        [layer]: value.split(',').map(note => note.trim()).filter(Boolean),
      },
    }));
  };

  const handleDeleteProduct = async (productId: string) => {
    const ok = window.confirm('Delete this product permanently?');
    if (!ok) return;
    await deleteProduct(productId);
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const deleteSubscriber = async (id: string) => {
    const ok = confirm("Delete this subscriber?");
    if (!ok) return;
    await deleteDoc(doc(db, "newsletterSubscribers", id));
    setSubscribers(prev => prev.filter(sub => sub.id !== id));
  };

  // Invoice functions
  const updateInvoiceItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    setInvoiceForm(prev => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addInvoiceItem = () => {
    setInvoiceForm(prev => ({
      ...prev,
      items: [...prev.items, { productName: '', qty: 1, price: 0 }],
    }));
  };

  const removeInvoiceItem = (index: number) => {
    setInvoiceForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const invoiceSubtotal = invoiceForm.items.reduce(
    (sum, item) => sum + Number(item.qty || 0) * Number(item.price || 0),
    0
  );

  const invoiceGrandTotal = Math.max(
    invoiceSubtotal + Number(invoiceForm.deliveryCharge || 0) - Number(invoiceForm.discount || 0),
    0
  );

  const invoiceBalanceDue = Math.max(
    invoiceGrandTotal - Number(invoiceForm.advanceReceived || 0),
    0
  );

  const determinePaymentStatus = (grandTotal: number, advanceReceived: number, balanceDue: number): 'unpaid' | 'partial' | 'paid' => {
    if (balanceDue === 0 && advanceReceived > 0) return 'paid';
    if (advanceReceived > 0 && balanceDue > 0) return 'partial';
    return 'unpaid';
  };

  const saveInvoice = async () => {
    if (!invoiceForm.invoiceNo.trim()) return alert('Invoice number is required');
    if (!invoiceForm.buyerName.trim()) return alert('Buyer name is required');
    if (invoiceForm.items.some(i => !i.productName.trim() || Number(i.qty) <= 0 || Number(i.price) <= 0)) {
      return alert('Fill all product details correctly');
    }
    if (Number(invoiceForm.advanceReceived) > invoiceGrandTotal) {
      alert('Advance received cannot exceed Grand Total');
      return;
    }

    setSaving(true);

    const subtotal = invoiceSubtotal;
    const grandTotal = invoiceGrandTotal;
    const advanceReceived = Number(invoiceForm.advanceReceived || 0);
    const balanceDue = Math.max(grandTotal - advanceReceived, 0);
    const paymentStatus = determinePaymentStatus(grandTotal, advanceReceived, balanceDue);

    const invoiceData = {
      invoiceNo: invoiceForm.invoiceNo.trim(),
      buyerName: invoiceForm.buyerName.trim(),
      buyerPhone: invoiceForm.buyerPhone.trim(),
      buyerAddress: invoiceForm.buyerAddress.trim(),
      date: invoiceForm.date,
      items: invoiceForm.items.map(i => ({
        productName: i.productName.trim(),
        qty: Number(i.qty),
        price: Number(i.price),
      })),
      subtotal: subtotal,
      discount: Number(invoiceForm.discount || 0),
      deliveryCharge: Number(invoiceForm.deliveryCharge || 0),
      grandTotal: grandTotal,
      advanceReceived: advanceReceived,
      balanceDue: balanceDue,
      paymentStatus: paymentStatus,
      notes: invoiceForm.notes.trim(),
      createdAt: new Date().toISOString(),
    };

    const ref = await addDoc(collection(db, 'invoices'), invoiceData);
    const savedInvoice = { id: ref.id, ...invoiceData } as Invoice;

    setInvoices(prev => [savedInvoice, ...prev]);
    setInvoiceForm({
      ...emptyInvoiceForm,
      invoiceNo: createAutoInvoiceNo(),
      date: new Date().toISOString().slice(0, 10),
    });
    setSelectedInvoice(savedInvoice);
    setSaving(false);
  };

  // Invoice HTML Builder
  const buildInvoiceHtml = (invoice: Invoice) => {
    const itemsRows = invoice.items
      .map(
        item => `
          <tr>
            <td>${item.productName}</td>
            <td style="text-align:center;">${item.qty}</td>
            <td style="text-align:right;">₹${Number(item.price).toFixed(2)}</td>
            <td style="text-align:right;">₹${(Number(item.qty) * Number(item.price)).toFixed(2)}</td>
          </tr>`
      )
      .join('');

    let totalsHtml = `
      <div style="display:flex; justify-content:space-between; padding:8px 0;">
        <span>Subtotal</span>
        <b>₹${invoice.subtotal.toFixed(2)}</b>
      </div>
    `;

    if (invoice.discount > 0) {
      totalsHtml += `
        <div style="display:flex; justify-content:space-between; padding:8px 0; color:#dc2626;">
          <span>Discount</span>
          <b>- ₹${invoice.discount.toFixed(2)}</b>
        </div>
      `;
    }

    if (invoice.deliveryCharge > 0) {
      totalsHtml += `
        <div style="display:flex; justify-content:space-between; padding:8px 0;">
          <span>Delivery</span>
          <b>₹${invoice.deliveryCharge.toFixed(2)}</b>
        </div>
      `;
    }

    totalsHtml += `
      <div style="display:flex; justify-content:space-between; padding:8px 0; border-top:2px solid #111; margin-top:8px; padding-top:12px; font-size:20px; font-weight:800;">
        <span>Grand Total</span>
        <span>₹${invoice.grandTotal.toFixed(2)}</span>
      </div>
    `;

    if (invoice.advanceReceived > 0) {
      totalsHtml += `
        <div style="display:flex; justify-content:space-between; padding:8px 0; color:#2563eb;">
          <span>Advance Paid</span>
          <b>₹${invoice.advanceReceived.toFixed(2)}</b>
        </div>
        <div style="display:flex; justify-content:space-between; padding:8px 0; font-size:18px; font-weight:700; border-top:1px solid #ddd; padding-top:12px;">
          <span>Balance Due</span>
          <span style="color:#dc2626;">₹${invoice.balanceDue.toFixed(2)}</span>
        </div>
      `;
    }

    const upiLink = `upi://pay?pa=aadarshlpnt16-2@oksbi&pn=Wildcore%20Fragrances&am=${invoice.balanceDue.toFixed(2)}&cu=INR`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(upiLink)}`;

    const statusColor = invoice.paymentStatus === 'paid' ? '#166534' : invoice.paymentStatus === 'partial' ? '#92400e' : '#991b1b';
    const statusBg = invoice.paymentStatus === 'paid' ? '#dcfce7' : invoice.paymentStatus === 'partial' ? '#fef3c7' : '#fee2e2';

    return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${invoice.invoiceNo}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #111; margin: 0; padding: 30px; background: #f5f5f5; }
    .invoice { max-width: 800px; margin: 0 auto; background: #fff; padding: 34px; border: 1px solid #ddd; }
    .top { display: flex; justify-content: space-between; gap: 24px; border-bottom: 2px solid #111; padding-bottom: 20px; }
    .brand { font-size: 28px; font-weight: 800; letter-spacing: 2px; }
    .tagline { font-size: 12px; color: #9a7a2e; letter-spacing: 2px; margin-top: 2px; }
    .company-contact { font-size: 11px; color: #666; margin-top: 4px; line-height: 1.6; }
    .company-contact span { margin-right: 16px; }
    .muted { color: #666; font-size: 13px; line-height: 1.6; }
    .gold { color: #9a7a2e; }
    .section { margin-top: 26px; }
    table { width: 100%; border-collapse: collapse; margin-top: 18px; }
    th { background: #111; color: #fff; padding: 12px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
    td { padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; }
    .totals { width: 380px; margin-left: auto; margin-top: 18px; }
    .footer { margin-top: 36px; padding-top: 18px; border-top: 1px solid #eee; text-align: center; }
    .payment-section { 
      margin-top: 20px; 
      padding-top: 16px; 
      border-top: 1px solid #ddd;
      display: flex;
      gap: 16px;
      align-items: center;
      justify-content: flex-start;
      flex-wrap: wrap;
    }
    .qr-container { text-align: center; }
    .qr-container img { border: 1px solid #ddd; border-radius: 6px; padding: 6px; background: white; width: 80px; height: 80px; }
    .qr-container .qr-label { font-size: 11px; font-weight: 600; color: #333; display: block; margin-bottom: 4px; }
    .upi-details { text-align: left; }
    .upi-details .upi-id { font-size: 14px; font-weight: 700; color: #2563eb; background: #f0f7ff; padding: 4px 12px; border-radius: 4px; display: inline-block; }
    .upi-details .upi-label { font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 1px; }
    .payment-badge { display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 600; text-transform: uppercase; background: ${statusBg}; color: ${statusColor}; }
    .notes-box { margin-top: 16px; padding: 12px 16px; background: #f9fafb; border-left: 3px solid #9a7a2e; border-radius: 4px; }
    .notes-box .label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #999; }
    .notes-box .text { font-size: 13px; color: #444; margin-top: 2px; }
    @media print { body { background: #fff; padding: 0; } .invoice { border: 0; } }
  </style>
</head>
<body>
  <div class="invoice">
    <div class="top">
      <div>
        <div class="brand">WILDCORE</div>
        <div class="tagline">FRAGRANCES · Wear The Wild</div>
        <div class="company-contact">
          <span>📧 wildcorefragrances@gmail.com</span>
          <span>📞 +91 7056713252</span>
          <span>📍 Panipat, Haryana</span>
        </div>
      </div>
      <div style="text-align:right;">
        <h2 style="margin:0;">INVOICE</h2>
        <div class="muted">Invoice No: <b>${invoice.invoiceNo}</b></div>
        <div class="muted">Date: ${new Date(invoice.date).toLocaleDateString('en-IN')}</div>
        <div class="muted" style="margin-top:4px;">Payment: <span class="payment-badge">${invoice.paymentStatus.toUpperCase()}</span></div>
      </div>
    </div>

    <div class="section">
      <h3>Bill To</h3>
      <div><b>${invoice.buyerName}</b></div>
      <div class="muted">Phone: ${invoice.buyerPhone || '-'}</div>
      <div class="muted">Address: ${invoice.buyerAddress || '-'}</div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="text-align:left;">Product</th>
          <th>Qty</th>
          <th style="text-align:right;">Price</th>
          <th style="text-align:right;">Total</th>
        </tr>
      </thead>
      <tbody>${itemsRows}</tbody>
    </table>

    <div class="totals">${totalsHtml}</div>

    ${invoice.notes ? `
      <div class="notes-box">
        <div class="label">📝 Notes</div>
        <div class="text">${invoice.notes}</div>
      </div>
    ` : ''}

    <div class="payment-section">
      <div class="qr-container">
        <span class="qr-label">Scan to Pay</span>
        <img src="${qrCodeUrl}" alt="UPI QR" />
        <div style="font-size:10px; color:#666; margin-top:2px;">₹${invoice.balanceDue.toFixed(2)}</div>
      </div>
      <div class="upi-details">
        <div class="upi-label">UPI ID</div>
        <div class="upi-id">aadarshlpnt16-2@oksbi</div>
        <div style="font-size:11px; color:#666; margin-top:4px;">Pay using GPay, PhonePe, Paytm</div>
      </div>
    </div>

    <div class="footer">
      <b>Thank you for choosing Wildcore Fragrances.</b>
      <div class="muted">Drive Your Instinct · Wear The Wild</div>
    </div>
  </div>
</body>
</html>`;
  };

  const downloadInvoice = (invoice: Invoice) => {
    const html = buildInvoiceHtml(invoice);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${invoice.invoiceNo}.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const printInvoice = (invoice: Invoice) => {
    const win = window.open('', '_blank');
    if (!win) return alert('Please allow popups to print invoice');
    win.document.open();
    win.document.write(buildInvoiceHtml(invoice));
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  };

  const deleteInvoice = async (invoiceId: string) => {
    const ok = confirm('Delete this invoice from history?');
    if (!ok) return;
    await deleteDoc(doc(db, 'invoices', invoiceId));
    setInvoices(prev => prev.filter(inv => inv.id !== invoiceId));
    if (selectedInvoice?.id === invoiceId) setSelectedInvoice(null);
  };

  // WhatsApp Click functions
  const updateWhatsAppStatus = async (id: string, status: WhatsAppClick['status'], notes?: string) => {
    await updateDoc(doc(db, 'whatsappClicks', id), {
      status,
      notes: notes || '',
      updatedAt: new Date().toISOString(),
    });
    setWhatsappClicks(prev =>
      prev.map(w => w.id === id ? { ...w, status, notes: notes || w.notes } : w)
    );
  };

  // Stats
  const statusColors = {
    delivered: 'text-green-400 bg-green-400/10',
    shipped: 'text-blue-400 bg-blue-400/10',
    processing: 'text-yellow-400 bg-yellow-400/10',
  };

  const totalRevenue = orders
    .filter(order => order.paymentStatus === 'paid')
    .reduce((sum, order) => sum + (order.total || 0), 0);

  const pendingAmount = orders
    .filter(order => order.paymentStatus === 'unpaid')
    .reduce((sum, order) => sum + (order.total || 0), 0);

  const lowStockProducts = products.filter(p => p.stock <= 5).length;

  // Auth checks
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--text-muted)]">Please login to access this page.</p>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--text-muted)]">Access denied.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-xs tracking-[0.4em] text-gold uppercase mb-2">Admin Panel</p>
            <h1 className="font-serif text-4xl font-bold text-[var(--text)]">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowOrderModal(true)}
              className="flex items-center gap-2 text-sm bg-gold text-black font-semibold px-4 py-2 rounded-xl hover:bg-gold/90 transition-all"
            >
              <Plus size={15} /> New Order
            </button>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-red-400 transition-colors glass px-4 py-2 rounded-xl"
            >
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="glass rounded-2xl p-5">
            <p className="text-xs tracking-widest text-[var(--text-muted)] uppercase mb-2">Users</p>
            <p className="font-serif text-3xl font-bold text-gold">{users.length}</p>
          </div>
          <div className="glass rounded-2xl p-5">
            <p className="text-xs tracking-widest text-[var(--text-muted)] uppercase mb-2">Orders</p>
            <p className="font-serif text-3xl font-bold text-gold">{orders.length}</p>
          </div>
          <div className="glass rounded-2xl p-5">
            <p className="text-xs tracking-widest text-[var(--text-muted)] uppercase mb-2">Revenue</p>
            <p className="font-serif text-3xl font-bold text-gold">₹{totalRevenue}</p>
          </div>
          <div className="glass rounded-2xl p-5">
            <p className="text-xs tracking-widest text-[var(--text-muted)] uppercase mb-2">Pending</p>
            <p className="font-serif text-3xl font-bold text-gold">₹{pendingAmount}</p>
          </div>
          <div className="glass rounded-2xl p-5">
            <p className="text-xs tracking-widest text-[var(--text-muted)] uppercase mb-2">Low Stock</p>
            <p className="font-serif text-3xl font-bold text-gold">{lowStockProducts}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex glass rounded-xl p-1 mb-8 w-fit flex-wrap">
          {([
            { key: 'orders', label: 'Orders', icon: Package },
            { key: 'users', label: 'Users', icon: Users },
            { key: 'products', label: 'Products', icon: Boxes },
            { key: 'b2b', label: 'B2B', icon: Briefcase },
            { key: 'subscribers', label: 'Subscribers', icon: Mail },
            { key: 'invoices', label: 'Invoices', icon: FileText },
            { key: 'whatsapp', label: 'WhatsApp Leads', icon: Send },
          ] as const).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                tab === key
                  ? 'bg-gold text-black'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-[var(--text-muted)] text-center py-20">Loading...</p>
        ) : (
          <>
            {/* ORDERS TAB */}
            {tab === 'orders' && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-20">
                    <Package size={48} className="text-[var(--text-muted)] mx-auto mb-4 opacity-30" />
                    <p className="text-[var(--text-muted)] italic">No orders yet.</p>
                    <button
                      onClick={() => setShowOrderModal(true)}
                      className="mt-4 text-gold text-sm hover:underline"
                    >
                      Create first order
                    </button>
                  </div>
                ) : (
                  orders.map(order => (
                    <div key={order.id} className="glass rounded-2xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-xs tracking-wider text-[var(--text-muted)] uppercase">
                            Order #{order.id}
                          </p>
                          <p className="text-sm text-[var(--text)] mt-0.5">by {order.userName}</p>
                          <p className="text-xs text-[var(--text-muted)] mt-0.5">
                            {new Date(order.date).toLocaleDateString()}
                          </p>
                          {order.note && (
                            <p className="text-xs text-gold mt-1">Note: {order.note}</p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <select
                            value={order.status}
                            onChange={e =>
                              updateOrderStatus(
                                order.userId,
                                order.id,
                                e.target.value as Order['status']
                              )
                            }
                            className={`text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-lg border-0 cursor-pointer ${statusColors[order.status]}`}
                          >
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                          <select
                            value={order.paymentStatus}
                            onChange={(e) =>
                              updatePaymentStatus(
                                order.userId,
                                order.id,
                                e.target.value as Order["paymentStatus"]
                              )
                            }
                            className={`text-xs px-3 py-1 rounded-full border outline-none ${
                              order.paymentStatus === "paid"
                                ? "text-green-400 bg-green-400/10 border-green-400/20"
                                : "text-red-400 bg-red-400/10 border-red-400/20"
                            }`}
                          >
                            <option value="unpaid">unpaid</option>
                            <option value="paid">paid</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2 border-t border-[var(--border)] pt-4">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-[var(--text-muted)]">
                              {item.name} ({item.volume}ml) x {item.qty}
                            </span>
                            <span className="text-[var(--text)]">
                              ₹{(item.price * item.qty).toFixed(2)}
                            </span>
                          </div>
                        ))}
                        <div className="flex justify-between font-semibold text-sm pt-2 border-t border-[var(--border)]">
                          <span>Total</span>
                          <span className="text-gold">₹{order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* USERS TAB */}
            {tab === 'users' && (
              <div className="space-y-4">
                {users.map(u => (
                  <div key={u.id} className="glass rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-[var(--text)]">{u.name}</p>
                        <p className="text-sm text-[var(--text-muted)]">{u.email}</p>
                        {u.phone ? (
                          <a
                            href={`https://wa.me/91${u.phone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-green-400 hover:text-green-300 mt-1 flex items-center gap-1"
                          >
                            Phone: {u.phone} - WhatsApp
                          </a>
                        ) : (
                          <p className="text-xs text-[var(--text-muted)] mt-1 italic">No phone set</p>
                        )}
                        <p className="text-xs text-[var(--text-muted)] mt-1">
                          {u.address || 'No address set'}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${
                            u.role === 'admin'
                              ? 'bg-gold/20 text-gold'
                              : 'bg-white/10 text-[var(--text-muted)]'
                          }`}
                        >
                          {u.role}
                        </span>
                        <p className="text-xs text-[var(--text-muted)] mt-2">
                          {u.orders?.length || 0} orders
                        </p>
                        {u.phone && (
                          <a
                            href={`https://wa.me/91${u.phone}?text=Hi ${u.name}! Your Wildcore order is confirmed`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full mt-2 inline-block hover:bg-green-500/30 transition-all"
                          >
                            Message
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* PRODUCTS TAB */}
            {tab === 'products' && (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <button
                    onClick={openAddProduct}
                    className="flex items-center gap-2 bg-gold text-black font-semibold px-4 py-2 rounded-xl hover:bg-gold-light transition-all"
                  >
                    <Plus size={15} /> Add Product
                  </button>
                </div>
                {products.length === 0 ? (
                  <div className="text-center py-20">
                    <Boxes size={48} className="text-[var(--text-muted)] mx-auto mb-4 opacity-30" />
                    <p className="text-[var(--text-muted)] italic">No products found.</p>
                  </div>
                ) : (
                  products.map(product => (
                    <div key={product.id} className="glass rounded-2xl p-5">
                      <div className="flex flex-col md:flex-row md:items-center gap-5">
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          decoding="async"
                          className="w-24 h-24 rounded-xl object-cover bg-[var(--bg3)]"
                        />
                        <div className="flex-1">
                          <p className="font-serif text-xl font-bold text-[var(--text)]">
                            {product.name}
                          </p>
                          <p className="text-xs text-[var(--text-muted)] mt-1">ID: {product.id}</p>
                          <p className="text-sm text-[var(--text-muted)] mt-1">
                            {product.category} • {product.gender} • {product.type}
                          </p>
                          <p className="text-sm text-gold mt-2">
                            From ₹{product.volumes?.find(v => v.ml === 30)?.price || product.volumes?.[0]?.price || 0}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <button
                              onClick={() => toggleProductField(product, 'bestseller')}
                              className={`text-xs px-3 py-1 rounded-full ${
                                product.bestseller
                                  ? 'bg-gold text-black'
                                  : 'bg-white/10 text-[var(--text-muted)]'
                              }`}
                            >
                              Bestseller
                            </button>
                            <button
                              onClick={() => toggleProductField(product, 'newArrival')}
                              className={`text-xs px-3 py-1 rounded-full ${
                                product.newArrival
                                  ? 'bg-gold text-black'
                                  : 'bg-white/10 text-[var(--text-muted)]'
                              }`}
                            >
                              New Arrival
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col gap-3 md:w-40">
                          <label className="text-xs text-[var(--text-muted)] uppercase tracking-widest">
                            Stock
                          </label>
                          <input
                            type="number"
                            value={product.stock}
                            onChange={e =>
                              updateProductStock(product.id, Number(e.target.value))
                            }
                            className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-[var(--text)] focus:outline-none focus:border-gold"
                          />
                          <button
                            onClick={() => openEditProduct(product)}
                            className="flex items-center justify-center gap-2 text-sm bg-gold/10 text-gold px-4 py-2 rounded-xl hover:bg-gold/20 transition-all"
                          >
                            <Edit size={14} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="flex items-center justify-center gap-2 text-sm bg-red-500/10 text-red-400 px-4 py-2 rounded-xl hover:bg-red-500/20 transition-all"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* B2B TAB */}
            {tab === 'b2b' && (
              <div className="space-y-4">
                {b2bInquiries.length === 0 ? (
                  <div className="text-center py-20">
                    <Briefcase size={48} className="text-[var(--text-muted)] mx-auto mb-4 opacity-30" />
                    <p className="text-[var(--text-muted)] italic">No B2B inquiries yet.</p>
                  </div>
                ) : (
                  b2bInquiries.map(inquiry => (
                    <div key={inquiry.id} className="glass rounded-2xl p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
                        <div>
                          <p className="font-serif text-2xl font-bold text-[var(--text)]">
                            {inquiry.businessName}
                          </p>
                          <p className="text-sm text-gold mt-1">{inquiry.businessType}</p>
                          <div className="space-y-1 mt-4 text-sm text-[var(--text-muted)]">
                            <p>Phone: {inquiry.phone}</p>
                            <p>City: {inquiry.city}</p>
                            <p>Quantity: {inquiry.quantity}</p>
                            <p>Brand Name: {inquiry.brandName}</p>
                          </div>
                          {inquiry.message && (
                            <p className="text-sm text-[var(--text-muted)] mt-4">{inquiry.message}</p>
                          )}
                        </div>
                        <div className="flex flex-col gap-3 min-w-[180px]">
                          <select
                            value={inquiry.status}
                            onChange={async e => {
                              const status = e.target.value as 'new' | 'contacted' | 'closed';
                              await updateB2BInquiryStatus(inquiry.id, status);
                              setB2BInquiries(prev =>
                                prev.map(i =>
                                  i.id === inquiry.id ? { ...i, status } : i
                                )
                              );
                            }}
                            className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)]"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="closed">Closed</option>
                          </select>
                          <a
                            href={`https://wa.me/91${inquiry.phone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-500 text-white text-center font-medium px-4 py-3 rounded-xl hover:bg-green-600 transition-all"
                          >
                            WhatsApp
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* INVOICES TAB */}
            {tab === 'invoices' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* LEFT - Create Invoice */}
                <div className="glass rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="text-xs tracking-[0.3em] uppercase text-gold mb-1">Bill Generator</p>
                      <h2 className="font-serif text-2xl font-bold text-[var(--text)]">Create Invoice</h2>
                    </div>
                    <FileText size={28} className="text-gold" />
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        value={invoiceForm.invoiceNo}
                        onChange={e => setInvoiceForm(prev => ({ ...prev, invoiceNo: e.target.value }))}
                        placeholder="Invoice No"
                        className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)]"
                      />
                      <input
                        type="date"
                        value={invoiceForm.date}
                        onChange={e => setInvoiceForm(prev => ({ ...prev, date: e.target.value }))}
                        className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)]"
                      />
                    </div>

                    <input
                      value={invoiceForm.buyerName}
                      onChange={e => setInvoiceForm(prev => ({ ...prev, buyerName: e.target.value }))}
                      placeholder="Buyer name"
                      className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)]"
                    />
                    <input
                      value={invoiceForm.buyerPhone}
                      onChange={e => setInvoiceForm(prev => ({ ...prev, buyerPhone: e.target.value }))}
                      placeholder="Phone number"
                      className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)]"
                    />
                    <textarea
                      value={invoiceForm.buyerAddress}
                      onChange={e => setInvoiceForm(prev => ({ ...prev, buyerAddress: e.target.value }))}
                      placeholder="Buyer address"
                      rows={2}
                      className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)]"
                    />

                    {/* Products */}
                    <div className="space-y-3">
                      <p className="text-xs tracking-widest uppercase text-[var(--text-muted)]">Products</p>
                      <div className="grid grid-cols-12 gap-2 px-1 text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider border-b border-[var(--border)] pb-2">
                        <div className="col-span-5">Product Name</div>
                        <div className="col-span-2 text-center">Qty</div>
                        <div className="col-span-3 text-center">Price (₹)</div>
                        <div className="col-span-2 text-center">Action</div>
                      </div>
                      {invoiceForm.items.map((item, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 items-center bg-[var(--bg3)] rounded-xl p-2">
                          <input
                            value={item.productName}
                            onChange={e => updateInvoiceItem(index, 'productName', e.target.value)}
                            placeholder="e.g. Fresh Eros 100ml"
                            className="col-span-5 bg-transparent border-0 px-2 py-2 text-sm text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-gold rounded"
                          />
                          <input
                            type="number"
                            value={item.qty}
                            onChange={e => updateInvoiceItem(index, 'qty', Number(e.target.value))}
                            placeholder="1"
                            className="col-span-2 bg-transparent border-0 px-2 py-2 text-sm text-[var(--text)] text-center focus:outline-none focus:ring-1 focus:ring-gold rounded"
                          />
                          <input
                            type="number"
                            value={item.price}
                            onChange={e => updateInvoiceItem(index, 'price', Number(e.target.value))}
                            placeholder="0.00"
                            className="col-span-3 bg-transparent border-0 px-2 py-2 text-sm text-[var(--text)] text-center focus:outline-none focus:ring-1 focus:ring-gold rounded"
                          />
                          <div className="col-span-2 flex justify-center">
                            {invoiceForm.items.length > 1 ? (
                              <button
                                onClick={() => removeInvoiceItem(index)}
                                className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all text-xs flex items-center gap-1"
                              >
                                <Trash2 size={14} /> Delete
                              </button>
                            ) : (
                              <span className="text-xs text-[var(--text-muted)] opacity-30">-</span>
                            )}
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={addInvoiceItem}
                        className="text-sm text-gold hover:text-gold-light transition-colors flex items-center gap-1"
                      >
                        <Plus size={14} /> Add product
                      </button>
                    </div>

                    {/* Discount, Delivery, Advance */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs text-[var(--text-muted)] block mb-1">💳 Discount (₹)</label>
                        <input
                          type="number"
                          value={invoiceForm.discount}
                          onChange={e => setInvoiceForm(prev => ({ ...prev, discount: Number(e.target.value) }))}
                          placeholder="0"
                          className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)]"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[var(--text-muted)] block mb-1">📦 Delivery (₹)</label>
                        <input
                          type="number"
                          value={invoiceForm.deliveryCharge}
                          onChange={e => setInvoiceForm(prev => ({ ...prev, deliveryCharge: Number(e.target.value) }))}
                          placeholder="0"
                          className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)]"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[var(--text-muted)] block mb-1">💰 Advance (₹)</label>
                        <input
                          type="number"
                          value={invoiceForm.advanceReceived}
                          onChange={e => setInvoiceForm(prev => ({ ...prev, advanceReceived: Number(e.target.value) }))}
                          placeholder="0"
                          className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)]"
                        />
                      </div>
                    </div>

                    <textarea
                      value={invoiceForm.notes}
                      onChange={e => setInvoiceForm(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Notes / delivery details"
                      rows={2}
                      className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)]"
                    />

                    {/* Totals */}
                    <div className="glass rounded-xl p-4 space-y-2 text-sm">
                      <div className="flex justify-between text-[var(--text-muted)]">
                        <span>Subtotal</span>
                        <span>₹{invoiceSubtotal.toFixed(2)}</span>
                      </div>
                      {invoiceForm.discount > 0 && (
                        <div className="flex justify-between text-red-400">
                          <span>Discount</span>
                          <span>- ₹{Number(invoiceForm.discount).toFixed(2)}</span>
                        </div>
                      )}
                      {invoiceForm.deliveryCharge > 0 && (
                        <div className="flex justify-between text-[var(--text-muted)]">
                          <span>Delivery</span>
                          <span>₹{Number(invoiceForm.deliveryCharge).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg font-bold border-t border-[var(--border)] pt-2">
                        <span>Grand Total</span>
                        <span className="text-gold">₹{invoiceGrandTotal.toFixed(2)}</span>
                      </div>
                      {invoiceForm.advanceReceived > 0 && (
                        <>
                          <div className="flex justify-between text-blue-400">
                            <span>Advance Paid</span>
                            <span>₹{Number(invoiceForm.advanceReceived).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-lg font-bold border-t border-[var(--border)] pt-2">
                            <span>Balance Due</span>
                            <span className="text-red-400">₹{invoiceBalanceDue.toFixed(2)}</span>
                          </div>
                        </>
                      )}
                    </div>

                    <button
                      onClick={saveInvoice}
                      disabled={saving}
                      className="w-full bg-gold text-black font-semibold py-4 rounded-xl hover:bg-gold-light transition-all disabled:opacity-60"
                    >
                      {saving ? 'Saving...' : 'Save Invoice'}
                    </button>
                  </div>
                </div>

                {/* RIGHT - Invoice History */}
                <div className="space-y-4">
                  <div className="glass rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <p className="text-xs tracking-[0.3em] uppercase text-gold mb-1">History</p>
                        <h2 className="font-serif text-2xl font-bold text-[var(--text)]">Invoices</h2>
                      </div>
                      <p className="text-sm text-[var(--text-muted)]">{invoices.length} saved</p>
                    </div>

                    {invoices.length === 0 ? (
                      <p className="text-sm text-[var(--text-muted)] italic text-center py-10">No invoices generated yet.</p>
                    ) : (
                      <div className="space-y-3 max-h-[720px] overflow-y-auto pr-1">
                        {invoices.map(invoice => (
                          <div key={invoice.id} className="glass rounded-xl p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-[var(--text)]">{invoice.invoiceNo}</p>
                                <p className="text-xs text-[var(--text-muted)] mt-1">{invoice.buyerName} • {new Date(invoice.date).toLocaleDateString('en-IN')}</p>
                                <p className="text-sm text-gold font-semibold mt-1">₹{invoice.grandTotal.toFixed(2)}</p>
                                {invoice.advanceReceived > 0 && (
                                  <p className="text-xs text-blue-400 mt-0.5">Advance: ₹{invoice.advanceReceived.toFixed(2)} • Balance: ₹{invoice.balanceDue.toFixed(2)}</p>
                                )}
                              </div>
                              <span className={`text-[10px] px-2 py-1 rounded-full uppercase ${
                                invoice.paymentStatus === 'paid' ? 'bg-green-400/10 text-green-400' :
                                invoice.paymentStatus === 'partial' ? 'bg-yellow-400/10 text-yellow-400' :
                                'bg-red-400/10 text-red-400'
                              }`}>
                                {invoice.paymentStatus}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-4">
                              <button
                                onClick={() => setSelectedInvoice(invoice)}
                                className="flex items-center gap-1 text-xs bg-white/10 text-[var(--text)] px-3 py-2 rounded-lg hover:bg-white/15 transition-all"
                              >
                                <Eye size={13} /> View
                              </button>
                              <button
                                onClick={() => printInvoice(invoice)}
                                className="flex items-center gap-1 text-xs bg-gold/10 text-gold px-3 py-2 rounded-lg hover:bg-gold/20 transition-all"
                              >
                                <Download size={13} /> Print / PDF
                              </button>
                              <button
                                onClick={() => downloadInvoice(invoice)}
                                className="flex items-center gap-1 text-xs bg-white/10 text-[var(--text-muted)] px-3 py-2 rounded-lg hover:bg-white/15 transition-all"
                              >
                                HTML
                              </button>
                              <button
                                onClick={() => deleteInvoice(invoice.id)}
                                className="flex items-center gap-1 text-xs bg-red-500/10 text-red-400 px-3 py-2 rounded-lg hover:bg-red-500/20 transition-all"
                              >
                                <Trash2 size={13} /> Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {selectedInvoice && (
                    <div className="glass rounded-2xl p-6">
                      <div className="flex items-start justify-between gap-4 mb-5">
                        <div>
                          <p className="text-xs tracking-[0.3em] uppercase text-gold mb-1">Preview</p>
                          <h3 className="font-serif text-xl font-bold text-[var(--text)]">{selectedInvoice.invoiceNo}</h3>
                          <p className="text-xs text-[var(--text-muted)] mt-1">{selectedInvoice.buyerName}</p>
                        </div>
                        <button onClick={() => setSelectedInvoice(null)} className="text-[var(--text-muted)] hover:text-red-400"><X size={18} /></button>
                      </div>
                      <div className="space-y-2 text-sm border-t border-[var(--border)] pt-4">
                        {selectedInvoice.items.map((item, i) => (
                          <div key={i} className="flex justify-between gap-3">
                            <span className="text-[var(--text-muted)]">{item.productName} × {item.qty}</span>
                            <span className="text-[var(--text)]">₹{(item.qty * item.price).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-[var(--border)] mt-4 pt-4 space-y-2 text-sm">
                        <div className="flex justify-between text-[var(--text-muted)]">
                          <span>Subtotal</span>
                          <span>₹{selectedInvoice.subtotal.toFixed(2)}</span>
                        </div>
                        {selectedInvoice.discount > 0 && (
                          <div className="flex justify-between text-red-400">
                            <span>Discount</span>
                            <span>- ₹{selectedInvoice.discount.toFixed(2)}</span>
                          </div>
                        )}
                        {selectedInvoice.deliveryCharge > 0 && (
                          <div className="flex justify-between text-[var(--text-muted)]">
                            <span>Delivery</span>
                            <span>₹{selectedInvoice.deliveryCharge.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-lg font-bold">
                          <span>Grand Total</span>
                          <span className="text-gold">₹{selectedInvoice.grandTotal.toFixed(2)}</span>
                        </div>
                        {selectedInvoice.advanceReceived > 0 && (
                          <>
                            <div className="flex justify-between text-blue-400">
                              <span>Advance Paid</span>
                              <span>₹{selectedInvoice.advanceReceived.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t border-[var(--border)] pt-2">
                              <span>Balance Due</span>
                              <span className="text-red-400">₹{selectedInvoice.balanceDue.toFixed(2)}</span>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex gap-2 mt-5">
                        <button onClick={() => printInvoice(selectedInvoice)} className="flex-1 bg-gold text-black font-semibold py-3 rounded-xl hover:bg-gold-light transition-all">Print / Save PDF</button>
                        <button onClick={() => downloadInvoice(selectedInvoice)} className="flex-1 bg-white/10 text-[var(--text)] font-semibold py-3 rounded-xl hover:bg-white/15 transition-all">Download HTML</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SUBSCRIBERS TAB */}
            {tab === 'subscribers' && (
              <div className="space-y-4">
                <p className="text-sm text-[var(--text-muted)]">
                  Total Subscribers: <span className="text-gold font-semibold">{subscribers.length}</span>
                </p>
                {subscribers.length === 0 ? (
                  <div className="text-center py-20">
                    <Mail size={48} className="text-[var(--text-muted)] mx-auto mb-4 opacity-30" />
                    <p className="text-[var(--text-muted)] italic">No newsletter subscribers yet.</p>
                  </div>
                ) : (
                  subscribers.map(sub => (
                    <div key={sub.id} className="glass rounded-2xl p-5 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[var(--text)] font-medium">{sub.email}</p>
                        <p className="text-xs text-[var(--text-muted)] mt-1">Source: {sub.source || "newsletter"}</p>
                        <p className="text-xs text-[var(--text-muted)] mt-1">
                          Date: {sub.createdAt?.toDate ? sub.createdAt.toDate().toLocaleString("en-IN") : "Not available"}
                        </p>
                      </div>
                      <button onClick={() => deleteSubscriber(sub.id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* WHATSAPP LEADS TAB */}
{tab === 'whatsapp' && (
  <div className="space-y-4">
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div>
        <p className="text-sm text-[var(--text-muted)]">
          Total Leads: <span className="text-gold font-semibold">{whatsappClicks.length}</span>
        </p>
        <div className="flex gap-4 mt-1 text-xs flex-wrap">
          <span className="text-yellow-400">🟡 New: {whatsappClicks.filter(w => w.status === 'new').length}</span>
          <span className="text-blue-400">🔵 Contacted: {whatsappClicks.filter(w => w.status === 'contacted').length}</span>
          <span className="text-green-400">🟢 Ordered: {whatsappClicks.filter(w => w.status === 'ordered').length}</span>
          <span className="text-purple-400">🟣 Converted: {whatsappClicks.filter(w => w.status === 'converted').length}</span>
          <span className="text-red-400">🔴 Lost: {whatsappClicks.filter(w => w.status === 'lost').length}</span>
        </div>
      </div>
      <button
        onClick={() => window.open('/whatsapp-order', '_blank')}
        className="text-sm bg-green-500/10 text-green-400 px-4 py-2 rounded-xl hover:bg-green-500/20 transition-all"
      >
        ➕ New WhatsApp Order
      </button>
    </div>

    {whatsappClicks.length === 0 ? (
      <div className="text-center py-20">
        <Send size={48} className="text-[var(--text-muted)] mx-auto mb-4 opacity-30" />
        <p className="text-[var(--text-muted)] italic">No WhatsApp leads yet.</p>
      </div>
    ) : (
      whatsappClicks.map(click => (
        <div key={click.id} className="glass rounded-2xl p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            {/* LEFT - All Details */}
            <div className="flex-1 space-y-2">
              {/* Product Line */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-[var(--text)]">{click.productName}</span>
                {click.volume && (
                  <span className="text-xs bg-gold/10 text-gold px-2 py-0.5 rounded-full">
                    {click.volume}ml
                  </span>
                )}
                <span className="text-sm font-bold text-gold">₹{click.productPrice}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  click.source === 'product_page' ? 'bg-blue-400/10 text-blue-400' :
                  click.source === 'cart' ? 'bg-purple-400/10 text-purple-400' :
                  'bg-gray-400/10 text-gray-400'
                }`}>
                  {click.source}
                </span>
              </div>

              {/* Customer Name & Phone */}
              <div className="flex items-center gap-3 flex-wrap">
                {click.customerName && (
                  <span className="text-sm text-[var(--text)]">👤 {click.customerName}</span>
                )}
                {click.phone && (
                  <a
                    href={`https://wa.me/91${click.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-400 hover:text-green-300 flex items-center gap-1"
                  >
                    📞 {click.phone}
                  </a>
                )}
              </div>

              {/* Address */}
              {click.address && (
                <div className="bg-[var(--bg3)] rounded-lg p-2">
                  <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">📍 Delivery Address</p>
                  <p className="text-sm text-[var(--text)]">{click.address}</p>
                </div>
              )}

              {/* Message Preview */}
              {click.message && (
                <div className="bg-[var(--bg3)] rounded-lg p-2 max-h-20 overflow-y-auto">
                  <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">📝 Message</p>
                  <p className="text-xs text-[var(--text-muted)] whitespace-pre-line line-clamp-3">{click.message}</p>
                </div>
              )}

              {/* Timestamp & Notes */}
              <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                <span>📅 {new Date(click.createdAt).toLocaleString('en-IN')}</span>
                {click.notes && <span className="text-gold">📌 {click.notes}</span>}
              </div>
            </div>

            {/* RIGHT - Actions */}
            <div className="flex flex-col gap-2 min-w-[140px]">
              {/* Status */}
              <select
                value={click.status}
                onChange={async e => {
                  const newStatus = e.target.value as WhatsAppClick['status'];
                  await updateWhatsAppStatus(click.id, newStatus);
                }}
                className={`text-xs px-3 py-1.5 rounded-lg border ${
                  click.status === 'new' ? 'border-yellow-400/30 bg-yellow-400/10 text-yellow-400' :
                  click.status === 'contacted' ? 'border-blue-400/30 bg-blue-400/10 text-blue-400' :
                  click.status === 'ordered' ? 'border-green-400/30 bg-green-400/10 text-green-400' :
                  click.status === 'converted' ? 'border-purple-400/30 bg-purple-400/10 text-purple-400' :
                  'border-red-400/30 bg-red-400/10 text-red-400'
                }`}
              >
                <option value="new">🟡 New</option>
                <option value="contacted">🔵 Contacted</option>
                <option value="ordered">🟢 Ordered</option>
                <option value="converted">🟣 Converted</option>
                <option value="lost">🔴 Lost</option>
              </select>

              {/* Buttons */}
              <div className="flex gap-2">
                <a
                  href={click.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-xs bg-green-500/10 text-green-400 px-3 py-1.5 rounded-lg hover:bg-green-500/20 transition-all text-center"
                >
                  💬 Chat
                </a>
                <button
                  onClick={() => {
                    const notes = prompt('Add note:', click.notes || '');
                    if (notes !== null) {
                      updateWhatsAppStatus(click.id, click.status, notes);
                    }
                  }}
                  className="text-xs bg-gold/10 text-gold px-2 py-1.5 rounded-lg hover:bg-gold/20 transition-all"
                  title="Add Note"
                >
                  📝
                </button>
              </div>

              {/* Copy Details */}
              <button
                onClick={() => {
                  const details = `👤 Customer: ${click.customerName || 'N/A'}\n📞 Phone: ${click.phone || 'N/A'}\n📍 Address: ${click.address || 'N/A'}\n🛍️ Product: ${click.productName}\n💰 Total: ₹${click.productPrice}\n📅 Date: ${new Date(click.createdAt).toLocaleString('en-IN')}`;
                  navigator.clipboard.writeText(details);
                  alert('✅ Customer details copied to clipboard!');
                }}
                className="text-xs bg-white/5 text-[var(--text-muted)] px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all"
              >
                📋 Copy All
              </button>

              {/* 🗑️ DELETE BUTTON - NEW */}
              <button
                onClick={async () => {
                  const confirmDelete = confirm(`Delete this lead?\n\nCustomer: ${click.customerName || 'Unknown'}\nProduct: ${click.productName}\n\nThis action cannot be undone.`);
                  if (!confirmDelete) return;
                  
                  try {
                    await deleteDoc(doc(db, 'whatsappClicks', click.id));
                    setWhatsappClicks(prev => prev.filter(w => w.id !== click.id));
                    alert('✅ Lead deleted successfully!');
                  } catch (error) {
                    console.error('Error deleting lead:', error);
                    alert('❌ Failed to delete lead. Please try again.');
                  }
                }}
                className="text-xs bg-red-500/10 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/20 transition-all flex items-center justify-center gap-1"
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </div>
        </div>
      ))
    )}
  </div>
)}
          </>
        )}
      </div>

      {/* Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold text-[var(--text)]">Create New Order</h2>
              <button onClick={() => setShowOrderModal(false)} className="text-[var(--text-muted)] hover:text-red-400">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <select
                value={selectedUserId}
                onChange={e => setSelectedUserId(e.target.value)}
                className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)]"
              >
                <option value="">Select user</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} - {u.email}</option>
                ))}
              </select>

              {orderItems.map((item, index) => (
                <div key={index} className="glass rounded-xl p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                  <input
                    value={item.name}
                    onChange={e => updateItem(index, 'name', e.target.value)}
                    placeholder="Product name"
                    className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-[var(--text)]"
                  />
                  <input
                    type="number"
                    value={item.volume}
                    onChange={e => updateItem(index, 'volume', Number(e.target.value))}
                    placeholder="Volume"
                    className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-[var(--text)]"
                  />
                  <input
                    type="number"
                    value={item.qty}
                    onChange={e => updateItem(index, 'qty', Number(e.target.value))}
                    placeholder="Qty"
                    className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-[var(--text)]"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={item.price}
                      onChange={e => updateItem(index, 'price', Number(e.target.value))}
                      placeholder="Price"
                      className="flex-1 bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-[var(--text)]"
                    />
                    <button onClick={() => removeItem(index)} className="px-3 rounded-xl bg-red-500/10 text-red-400">
                      <X size={15} />
                    </button>
                  </div>
                </div>
              ))}

              <button onClick={addItem} className="text-sm text-gold hover:text-gold-light transition-colors">
                + Add item
              </button>

              <textarea
                value={orderNote}
                onChange={e => setOrderNote(e.target.value)}
                placeholder="Order note"
                rows={3}
                className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)]"
              />

              <select
                value={paymentStatus}
                onChange={e => setPaymentStatus(e.target.value as 'paid' | 'unpaid')}
                className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)]"
              >
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
              </select>

              <div className="flex justify-between text-lg font-semibold text-[var(--text)]">
                <span>Total</span>
                <span className="text-gold">₹{calculateTotal()}</span>
              </div>

              <button
                onClick={createOrder}
                disabled={saving}
                className="w-full bg-gold text-black font-semibold py-4 rounded-xl hover:bg-gold-light transition-all disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Create Order'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass rounded-3xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold text-[var(--text)]">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <button onClick={() => setShowProductModal(false)} className="text-[var(--text-muted)] hover:text-red-400">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                value={productId}
                onChange={e => setProductId(e.target.value)}
                disabled={!!editingProduct}
                placeholder="product-id e.g. aqua-storm"
                className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)] disabled:opacity-60"
              />
              <input
                value={productForm.name}
                onChange={e => setProductForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Product Name"
                className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)]"
              />
              <input
                value={productForm.tagline}
                onChange={e => setProductForm(p => ({ ...p, tagline: e.target.value }))}
                placeholder="Tagline"
                className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)]"
              />
              <input
                value={productForm.category}
                onChange={e => setProductForm(p => ({ ...p, category: e.target.value }))}
                placeholder="Category"
                className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)]"
              />
              <input
                value={productForm.gender}
                onChange={e => setProductForm(p => ({ ...p, gender: e.target.value }))}
                placeholder="Gender"
                className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)]"
              />
              <input
                value={productForm.type}
                onChange={e => setProductForm(p => ({ ...p, type: e.target.value }))}
                placeholder="Type"
                className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)]"
              />
              <input
                value={productForm.image}
                onChange={e => setProductForm(p => ({ ...p, image: e.target.value }))}
                placeholder="/images/AquaStorm.jpeg"
                className="md:col-span-2 bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)]"
              />
              <textarea
                value={productForm.description}
                onChange={e => setProductForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Description"
                rows={3}
                className="md:col-span-2 bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)]"
              />
              <input
                value={productForm.notes.top.join(', ')}
                onChange={e => updateNotes('top', e.target.value)}
                placeholder="Top notes comma separated"
                className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)]"
              />
              <input
                value={productForm.notes.middle.join(', ')}
                onChange={e => updateNotes('middle', e.target.value)}
                placeholder="Middle notes comma separated"
                className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)]"
              />
              <input
                value={productForm.notes.base.join(', ')}
                onChange={e => updateNotes('base', e.target.value)}
                placeholder="Base notes comma separated"
                className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)]"
              />
              <input
                type="number"
                value={productForm.stock}
                onChange={e => setProductForm(p => ({ ...p, stock: Number(e.target.value) }))}
                placeholder="Stock"
                className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)]"
              />
            </div>

            <div className="mt-6">
              <p className="text-xs tracking-widest uppercase text-[var(--text-muted)] mb-3">Volumes</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {productForm.volumes.map((v, i) => (
                  <div key={i} className="glass rounded-xl p-4 space-y-3">
                    <input
                      type="number"
                      value={v.ml}
                      onChange={e => updateVolume(i, 'ml', Number(e.target.value))}
                      placeholder={productForm.type === 'Solid Perfume' ? 'GM' : 'ML'}
                      className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-[var(--text)]"
                    />
                    <input
                      type="number"
                      value={v.price}
                      onChange={e => updateVolume(i, 'price', Number(e.target.value))}
                      placeholder="Price"
                      className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-[var(--text)]"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <label className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                <input
                  type="checkbox"
                  checked={productForm.bestseller}
                  onChange={e => setProductForm(p => ({ ...p, bestseller: e.target.checked }))}
                />
                Bestseller
              </label>
              <label className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                <input
                  type="checkbox"
                  checked={productForm.newArrival}
                  onChange={e => setProductForm(p => ({ ...p, newArrival: e.target.checked }))}
                />
                New Arrival
              </label>
            </div>

            <button
              onClick={handleSaveProduct}
              disabled={saving}
              className="w-full mt-6 bg-gold text-black font-semibold py-4 rounded-xl hover:bg-gold-light transition-all disabled:opacity-60"
            >
              {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
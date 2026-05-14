import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
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

type Tab = 'orders' | 'users' | 'products' | 'b2b';
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
    { ml: 50, price: 0 },
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

  const [tab, setTab] = useState<Tab>('orders');
  const [users, setUsers] = useState<FirestoreUser[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [b2bInquiries, setB2BInquiries] = useState<B2BInquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { name: '', volume: 50, qty: 1, price: 0 },
  ]);
  const [orderNote, setOrderNote] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'unpaid'>('unpaid');

  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productId, setProductId] = useState('');
  const [productForm, setProductForm] = useState<ProductForm>(emptyProductForm);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'admin') navigate('/');
  }, [user, navigate]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const usersSnap = await getDocs(collection(db, 'users'));
    const usersData = usersSnap.docs.map(d => ({
      id: d.id,
      ...d.data(),
    })) as FirestoreUser[];

    setUsers(usersData);

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

const productsData = await getProducts();
setProducts(productsData);

const inquiriesData = await getB2BInquiries();
setB2BInquiries(inquiriesData);

setLoading(false);
  };

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
      volumes: product.volumes || [
        { ml: 30, price: 0 },
        { ml: 50, price: 0 },
        { ml: 100, price: 0 },
      ],
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

  const statusColors = {
    delivered: 'text-green-400 bg-green-400/10',
    shipped: 'text-blue-400 bg-blue-400/10',
    processing: 'text-yellow-400 bg-yellow-400/10',
  };

  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'processing').length;
  const lowStockProducts = products.filter(p => p.stock <= 5).length;

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
            <p className="font-serif text-3xl font-bold text-gold">{pendingOrders}</p>
          </div>

          <div className="glass rounded-2xl p-5">
            <p className="text-xs tracking-widest text-[var(--text-muted)] uppercase mb-2">Low Stock</p>
            <p className="font-serif text-3xl font-bold text-gold">{lowStockProducts}</p>
          </div>
        </div>

        <div className="flex glass rounded-xl p-1 mb-8 w-fit flex-wrap">
{([
  { key: 'orders', label: 'Orders', icon: Package },
  { key: 'users', label: 'Users', icon: Users },
  { key: 'products', label: 'Products', icon: Boxes },
  { key: 'b2b', label: 'B2B', icon: Briefcase },
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

                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              order.paymentStatus === 'paid'
                                ? 'bg-green-400/10 text-green-400'
                                : 'bg-red-400/10 text-red-400'
                            }`}
                          >
                            {order.paymentStatus || 'unpaid'}
                          </span>
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
                          className="w-24 h-24 rounded-xl object-cover bg-[var(--bg3)]"
                        />

                        <div className="flex-1">
                          <p className="font-serif text-xl font-bold text-[var(--text)]">
                            {product.name}
                          </p>

                          <p className="text-xs text-[var(--text-muted)] mt-1">
                            ID: {product.id}
                          </p>

                          <p className="text-sm text-[var(--text-muted)] mt-1">
                            {product.category} • {product.gender} • {product.type}
                          </p>

                          <p className="text-sm text-gold mt-2">
                            From ₹{product.volumes?.[0]?.price || 0}
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
                            <Edit size={14} />
                            Edit
                          </button>

                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="flex items-center justify-center gap-2 text-sm bg-red-500/10 text-red-400 px-4 py-2 rounded-xl hover:bg-red-500/20 transition-all"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
            {tab === 'b2b' && (
  <div className="space-y-4">
    {b2bInquiries.length === 0 ? (
      <div className="text-center py-20">
        <Briefcase size={48} className="text-[var(--text-muted)] mx-auto mb-4 opacity-30" />
        <p className="text-[var(--text-muted)] italic">
          No B2B inquiries yet.
        </p>
      </div>
    ) : (
      b2bInquiries.map(inquiry => (
        <div key={inquiry.id} className="glass rounded-2xl p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
            <div>
              <p className="font-serif text-2xl font-bold text-[var(--text)]">
                {inquiry.businessName}
              </p>

              <p className="text-sm text-gold mt-1">
                {inquiry.businessType}
              </p>

              <div className="space-y-1 mt-4 text-sm text-[var(--text-muted)]">
                <p>Phone: {inquiry.phone}</p>
                <p>City: {inquiry.city}</p>
                <p>Quantity: {inquiry.quantity}</p>
                <p>Brand Name: {inquiry.brandName}</p>
              </div>

              {inquiry.message && (
                <p className="text-sm text-[var(--text-muted)] mt-4">
                  {inquiry.message}
                </p>
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
          </>
        )}
      </div>

      {showOrderModal && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold text-[var(--text)]">Create New Order</h2>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-[var(--text-muted)] hover:text-red-400"
              >
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
                  <option key={u.id} value={u.id}>
                    {u.name} - {u.email}
                  </option>
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
                    <button
                      onClick={() => removeItem(index)}
                      className="px-3 rounded-xl bg-red-500/10 text-red-400"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={addItem}
                className="text-sm text-gold hover:text-gold-light transition-colors"
              >
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

      {showProductModal && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass rounded-3xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold text-[var(--text)]">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>

              <button
                onClick={() => setShowProductModal(false)}
                className="text-[var(--text-muted)] hover:text-red-400"
              >
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
              <p className="text-xs tracking-widest uppercase text-[var(--text-muted)] mb-3">
                Volumes
              </p>

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

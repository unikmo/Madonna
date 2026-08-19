'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface ProductOption {
  id: string;
  title: string;
  variantId: string | null;
  quantity: 1 | 4 | 7;
}

interface AdminOrder {
  _id: string;
  shopifyOrderId: string;
  shopifyOrderName: string;
  email: string;
  customerName: string;
  totalPrice: number;
  currency: string;
  source: 'admin' | 'webhook';
  tags: string[];
  createdAt: string;
  totalCodes: number;
  claimedCodes: number;
  mediaCodes: number;
}

const PRESET_QUANTITIES: Array<1 | 4 | 7> = [1, 4, 7];

export default function AdminOrdersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'admin' | 'webhook'>('all');
  const [form, setForm] = useState({
    email: '',
    customerName: '',
    productId: '',
    variantId: '',
    momentQuantity: '1',
    deliveryType: 'digital',
    customTag: '',
  });
  const [productOpen, setProductOpen] = useState(false);
  const [productQuery, setProductQuery] = useState('');
  const productWrapRef = useRef<HTMLDivElement | null>(null);

  const loadProducts = async () => {
    try {
      const res = await fetch('/api/products', { credentials: 'include' });
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      const mapped: ProductOption[] = (data.products || []).slice(0, 3).map((p: any, index: number) => ({
        id: p.id,
        title: p.title,
        variantId: p.variantId,
        quantity: PRESET_QUANTITIES[index] || 1,
      }));
      setProducts(mapped);
      if (mapped.length > 0) {
        const initial = mapped[0];
        setForm((prev) => ({
          ...prev,
          productId: initial.id,
          variantId: initial.variantId || '',
          momentQuantity: String(initial.quantity),
        }));
      }
    } catch (error) {
      console.error('Failed to load products:', error);
      toast.error('Failed to load Shopify products');
    }
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (sourceFilter !== 'all') params.set('source', sourceFilter);

      const res = await fetch(`/api/admin/orders?${params.toString()}`, { credentials: 'include' });
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to load orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handle = setTimeout(() => {
      loadOrders();
    }, 200);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sourceFilter]);

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === form.productId),
    [products, form.productId]
  );
  const filteredProducts = useMemo(() => {
    const query = productQuery.trim().toLowerCase();
    if (!query) return products;
    return products.filter((p) => {
      const title = p.title.toLowerCase();
      return title.includes(query) || `${p.quantity}`.includes(query);
    });
  }, [products, productQuery]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const el = productWrapRef.current;
      if (!el) return;
      if (!el.contains(event.target as Node)) {
        setProductOpen(false);
      }
    };
    window.addEventListener('pointerdown', onPointerDown);
    return () => window.removeEventListener('pointerdown', onPointerDown);
  }, []);

  const handleProductChange = (productId: string) => {
    const selected = products.find((p) => p.id === productId);
    if (!selected) return;
    setForm((prev) => ({
      ...prev,
      productId: selected.id,
      variantId: selected.variantId || '',
      momentQuantity: String(selected.quantity),
    }));
    setProductQuery('');
    setProductOpen(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.productId || !form.variantId) {
      toast.error('Email and product are required');
      return;
    }

    try {
      setCreating(true);
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: form.email,
          customerName: form.customerName || undefined,
          productId: form.productId,
          variantId: form.variantId,
          momentQuantity: Number(form.momentQuantity),
          deliveryType: form.deliveryType,
          customTag: form.customTag || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Failed to create order');
        return;
      }

      toast.success(`Order created. ${data.generatedCodes?.length || 0} code(s) generated.`);
      setForm((prev) => ({ ...prev, email: '', customerName: '', customTag: '' }));
      await loadOrders();
      if (data.orderId) router.push(`/admin/orders/${data.orderId}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create order');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-[#2D2926] text-lg">Loading…</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="rounded-2xl p-6 border border-[#E3DAD0] bg-white shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-[#2D2926]">Create admin order</h2>
          <p className="text-sm text-[#2D2926]/60 mt-1">
            Create a paid Shopify order instantly and generate Moment Codes.
          </p>
        </div>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-[#2D2926]/60">Buyer email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="name@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-[#D3C7BB] bg-white text-[#2D2926] placeholder-[#2D2926]/35 focus:outline-none focus:ring-2 focus:ring-[#2D2926]/20"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-[#2D2926]/60">Customer name</label>
            <input
              type="text"
              value={form.customerName}
              onChange={(e) => setForm((prev) => ({ ...prev, customerName: e.target.value }))}
              placeholder="Optional"
              className="w-full px-4 py-2.5 rounded-xl border border-[#D3C7BB] bg-white text-[#2D2926] placeholder-[#2D2926]/35 focus:outline-none focus:ring-2 focus:ring-[#2D2926]/20"
            />
          </div>
          <div className="space-y-1.5 md:col-span-2" ref={productWrapRef}>
            <label className="text-xs font-medium uppercase tracking-wide text-[#2D2926]/60">Product</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setProductOpen((v) => !v)}
                className="w-full group flex items-center justify-between gap-3 rounded-2xl border border-[#D3C7BB] bg-white px-4 py-3 text-left shadow-sm hover:shadow transition-shadow focus:outline-none focus:ring-2 focus:ring-[#2D2926]/20"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-[#2D2926]">
                    {selectedProduct ? selectedProduct.title : 'Select a product'}
                  </div>
                  <div className="text-xs text-[#2D2926]/55">
                    {selectedProduct ? `${selectedProduct.quantity} key` : 'Click to search'}
                  </div>
                </div>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`shrink-0 text-[#2D2926]/60 transition-transform ${productOpen ? 'rotate-180' : ''}`}
                >
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {productOpen && (
                <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-[#E3DAD0] bg-white shadow-xl">
                  <div className="p-3 border-b border-[#EFE3D8] bg-[#FCFAF8]">
                    <input
                      value={productQuery}
                      onChange={(e) => setProductQuery(e.target.value)}
                      placeholder="Type to search…"
                      className="w-full px-3 py-2 rounded-xl border border-[#D3C7BB] bg-white text-[#2D2926] placeholder-[#2D2926]/35 focus:outline-none focus:ring-2 focus:ring-[#2D2926]/20"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-64 overflow-auto p-2">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => {
                        const active = product.id === form.productId;
                        return (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => handleProductChange(product.id)}
                            className={`w-full rounded-xl px-3 py-2.5 text-left transition-colors ${
                              active ? 'bg-[#2D2926] text-[#FDF9F5]' : 'hover:bg-[#F5ECE3] text-[#2D2926]'
                            }`}
                          >
                            <div className="text-sm font-medium">{product.title}</div>
                            <div className={`text-xs ${active ? 'text-[#FDF9F5]/75' : 'text-[#2D2926]/55'}`}>
                              {product.quantity} key
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="px-3 py-6 text-sm text-center text-[#2D2926]/55">No matching products</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-[#2D2926]/60">Delivery type</label>
            <select
              value={form.deliveryType}
              onChange={(e) => setForm((prev) => ({ ...prev, deliveryType: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-[#D3C7BB] bg-white text-[#2D2926] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D2926]/20"
            >
              <option value="digital">Digital</option>
              <option value="physical">Physical</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-[#2D2926]/60">Custom tag</label>
            <input
              type="text"
              value={form.customTag}
              onChange={(e) => setForm((prev) => ({ ...prev, customTag: e.target.value }))}
              placeholder="Optional"
              className="w-full px-4 py-2.5 rounded-xl border border-[#D3C7BB] bg-white text-[#2D2926] placeholder-[#2D2926]/35 focus:outline-none focus:ring-2 focus:ring-[#2D2926]/20"
            />
          </div>
          <div className="md:col-span-2 flex items-center justify-between rounded-xl border border-[#E9DED3] bg-[#FCFAF8] px-4 py-3 text-sm text-[#2D2926]/75">
            <span>Generated keys per order</span>
            <span className="rounded-full bg-[#2D2926] px-3 py-1 text-xs font-semibold text-[#FDF9F5]">
              {selectedProduct?.quantity || form.momentQuantity}
            </span>
          </div>
          <div className="md:col-span-2 flex items-center justify-end pt-1">
            <button
              type="submit"
              disabled={creating}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2D2926] px-5 py-2.5 text-sm font-medium text-[#FDF9F5] shadow-sm hover:bg-[#1E1B18] disabled:opacity-50 transition-colors"
            >
              {creating ? 'Creating…' : 'Place order'}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="opacity-90"
              >
                <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13 6L19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-2xl p-6 border border-[#E3DAD0] bg-white shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-[#2D2926]">Orders</h3>
          <span className="text-xs text-[#2D2926]/55">{orders.length} result(s)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email/order/name..."
            className="px-4 py-2.5 rounded-xl border border-[#D3C7BB] bg-white text-[#2D2926] placeholder-[#2D2926]/35 focus:outline-none focus:ring-2 focus:ring-[#2D2926]/20"
          />
          <select
            value={sourceFilter}
            onChange={(e) =>
              setSourceFilter(e.target.value as 'all' | 'admin' | 'webhook')
            }
            className="px-4 py-2.5 rounded-xl border border-[#D3C7BB] bg-white text-[#2D2926] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D2926]/20"
          >
            <option value="all">All sources</option>
            <option value="admin">Admin-created</option>
            <option value="webhook">Webhook</option>
          </select>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setSourceFilter('all');
            }}
            className="px-4 py-2 rounded-xl border border-[#D3C7BB] bg-white text-[#2D2926] hover:bg-[#F5ECE3] transition-colors text-sm"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E3DAD0] bg-white overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-[#F5ECE3]">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#2D2926]/85">Order</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#2D2926]/85">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#2D2926]/85">Source</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#2D2926]/85">Codes</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#2D2926]/85">Total</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#2D2926]/85">Created</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#2D2926]/85">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <motion.tr
                key={order._id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                className="border-t border-[#EFE3D8] hover:bg-[#FDF7F0] transition-colors"
              >
                <td className="px-6 py-4">
                  <Link href={`/admin/orders/${order._id}`} className="text-[#2D2926] hover:underline font-mono text-sm">
                    {order.shopifyOrderName || order.shopifyOrderId}
                  </Link>
                </td>
                <td className="px-6 py-4 text-[#2D2926]/80">{order.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[11px] ${order.source === 'admin' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
                    {order.source}
                  </span>
                </td>
                <td className="px-6 py-4 text-[#2D2926]/80">
                  {order.claimedCodes}/{order.totalCodes} claimed · {order.mediaCodes} media
                </td>
                <td className="px-6 py-4 text-[#2D2926]/80">
                  {order.currency} {order.totalPrice.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-[#2D2926]/65">{new Date(order.createdAt).toLocaleString()}</td>
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/orders/${order._id}`}
                    className="inline-flex items-center rounded-full border border-[#D3C7BB] bg-white px-3 py-1.5 text-xs font-medium text-[#2D2926] hover:bg-[#F5ECE3] transition-colors"
                  >
                    View order
                  </Link>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <div className="p-12 text-center text-[#2D2926]/50">No orders found</div>}
      </div>
    </div>
  );
}


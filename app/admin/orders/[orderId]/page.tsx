'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface OrderDetail {
  _id: string;
  shopifyOrderId: string;
  shopifyOrderName: string;
  email: string;
  customerName: string;
  source: 'admin' | 'webhook' | 'waitlist';
  tags: string[];
  totalPrice: number;
  currency: string;
  paymentStatus: 'paid';
  orderQuantity: number;
  lineItems: Array<{ productId: string; variantId: string; quantity: number }>;
  createdAt: string;
}

interface CodeDetail {
  _id: string;
  code: string;
  quantity: number;
  deliveryType: 'digital' | 'physical' | 'split';
  status: 'new' | 'claimed';
  claimedAt: string | null;
  mediaCount: number;
  media: Array<{ type: 'image' | 'video' | 'audio' | 'text'; url: string; createdAt: string }>;
  createdAt: string;
}

export default function AdminOrderDetailPage() {
  const router = useRouter();
  const params = useParams<{ orderId: string }>();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [codes, setCodes] = useState<CodeDetail[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/admin/orders/${params.orderId}`, { credentials: 'include' });
        if (res.status === 401) {
          router.push('/admin/login');
          return;
        }
        if (!res.ok) {
          throw new Error('Failed to load order');
        }
        const data = await res.json();
        setOrder(data.order || null);
        setCodes(data.codes || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (params.orderId) {
      load();
    }
  }, [params.orderId, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-[#2D2926] text-lg">Loading…</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-5xl mx-auto">
        <p className="text-[#2D2926]/70">Order not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin/orders" className="text-sm text-[#2D2926]/70 hover:text-[#2D2926] transition-colors">
          ← Back to orders
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 border border-[#E3DAD0] bg-white shadow-sm"
      >
        <h2 className="text-xl font-semibold text-[#2D2926] mb-4">Order info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#2D2926]/80">
          <p><span className="font-semibold text-[#2D2926]">Order:</span> {order.shopifyOrderName || order.shopifyOrderId}</p>
          <p><span className="font-semibold text-[#2D2926]">Source:</span> {order.source}</p>
          <p><span className="font-semibold text-[#2D2926]">Email:</span> {order.email}</p>
          <p><span className="font-semibold text-[#2D2926]">Customer name:</span> {order.customerName || '—'}</p>
          <p><span className="font-semibold text-[#2D2926]">Payment status:</span> {order.paymentStatus}</p>
          <p><span className="font-semibold text-[#2D2926]">Total:</span> {order.currency} {order.totalPrice.toFixed(2)}</p>
          <p><span className="font-semibold text-[#2D2926]">Line items:</span> {order.lineItems.length}</p>
          <p><span className="font-semibold text-[#2D2926]">Created:</span> {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        {order.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {order.tags.map((tag) => (
              <span key={tag} className="px-2 py-1 rounded-full text-[11px] bg-[#F5ECE3] text-[#2D2926]/80">
                {tag}
              </span>
            ))}
          </div>
        )}
      </motion.div>

      <div className="rounded-2xl border border-[#E3DAD0] bg-white overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-[#F5ECE3]">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#2D2926]/85">Code</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#2D2926]/85">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#2D2926]/85">Type</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#2D2926]/85">Uploaded</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#2D2926]/85">Media preview</th>
            </tr>
          </thead>
          <tbody>
            {codes.map((code, index) => (
              <motion.tr
                key={code._id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                className="border-t border-[#EFE3D8] hover:bg-[#FDF7F0] transition-colors"
              >
                <td className="px-6 py-4 text-[#2D2926] font-mono text-sm">{code.code}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[11px] ${code.status === 'claimed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {code.status}
                  </span>
                  {code.claimedAt && (
                    <p className="mt-1 text-xs text-[#2D2926]/60">{new Date(code.claimedAt).toLocaleString()}</p>
                  )}
                </td>
                <td className="px-6 py-4 text-[#2D2926]/80 capitalize">{code.deliveryType}</td>
                <td className="px-6 py-4 text-[#2D2926]/80">{code.mediaCount > 0 ? 'Yes' : 'No'}</td>
                <td className="px-6 py-4">
                  {code.mediaCount === 0 ? (
                    <span className="text-[#2D2926]/45 text-sm">—</span>
                  ) : (
                    <div className="flex gap-2 flex-wrap">
                      {code.media.slice(0, 2).map((media, idx) => (
                        <a
                          key={`${code._id}-${idx}`}
                          href={media.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs px-2 py-1 rounded-full border border-[#D3C7BB] text-[#2D2926]/75 hover:bg-[#F5ECE3]"
                        >
                          {media.type}
                        </a>
                      ))}
                    </div>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {codes.length === 0 && <div className="p-12 text-center text-[#2D2926]/50">No codes found for this order</div>}
      </div>
    </div>
  );
}


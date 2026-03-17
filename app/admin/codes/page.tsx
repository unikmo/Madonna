'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Code {
  _id: string;
  code: string;
  user: { email: string };
  order: { shopifyOrderId: string; email: string };
  quantity: number;
  deliveryType: string;
  status: string;
  claimedAt?: string;
  mediaCount: number;
  createdAt: string;
}

export default function CodesPage() {
  const router = useRouter();
  const [codes, setCodes] = useState<Code[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [quantityFilter, setQuantityFilter] = useState('');
  const [deliveryTypeFilter, setDeliveryTypeFilter] = useState('');

  useEffect(() => {
    fetchCodes();
  }, [search, statusFilter, quantityFilter, deliveryTypeFilter]);

  const fetchCodes = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      if (quantityFilter) params.append('quantity', quantityFilter);
      if (deliveryTypeFilter) params.append('deliveryType', deliveryTypeFilter);

      const response = await fetch(`/api/admin/codes?${params}`);
      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await response.json();
      setCodes(data.codes || []);
    } catch (error) {
      console.error('Failed to fetch codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (codeId: string, action: 'revoke' | 'reset') => {
    try {
      const response = await fetch('/api/admin/codes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codeId, action }),
      });
      if (response.ok) {
        fetchCodes();
      }
    } catch (error) {
      console.error('Failed to update code:', error);
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
      {/* Filters */}
      <div className="rounded-2xl p-6 border border-[#E3DAD0] bg-white shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by code..."
            className="px-4 py-2 rounded-xl border border-[#D3C7BB] bg-white text-[#2D2926] placeholder-[#2D2926]/35 focus:outline-none focus:ring-2 focus:ring-[#2D2926]/20"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-[#D3C7BB] bg-white text-[#2D2926] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D2926]/20"
          >
            <option value="">All status</option>
            <option value="new">New</option>
            <option value="claimed">Claimed</option>
          </select>
          <select
            value={quantityFilter}
            onChange={(e) => setQuantityFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-[#D3C7BB] bg-white text-[#2D2926] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D2926]/20"
          >
            <option value="">All quantities</option>
            <option value="1">1</option>
            <option value="4">4</option>
            <option value="7">7</option>
          </select>
          <select
            value={deliveryTypeFilter}
            onChange={(e) => setDeliveryTypeFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-[#D3C7BB] bg-white text-[#2D2926] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D2926]/20"
          >
            <option value="">All types</option>
            <option value="digital">Digital</option>
            <option value="physical">Physical</option>
            <option value="split">Split</option>
          </select>
          <button
            onClick={() => {
              setSearch('');
              setStatusFilter('');
              setQuantityFilter('');
              setDeliveryTypeFilter('');
            }}
            className="px-4 py-2 rounded-xl border border-[#D3C7BB] bg-white text-[#2D2926] hover:bg-[#F5ECE3] transition-colors text-sm"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[#E3DAD0] bg-white overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-[#F5ECE3]">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#2D2926]">Code</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#2D2926]">Buyer</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#2D2926]">Order</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#2D2926]">Quantity</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#2D2926]">Type</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#2D2926]">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#2D2926]">Media</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#2D2926]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {codes.map((code, index) => (
              <motion.tr
                key={code._id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="border-t border-[#EFE3D8] hover:bg-[#FDF7F0] transition-colors"
              >
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/codes/${code._id}`}
                    className="text-[#2D2926] hover:underline font-mono text-sm"
                  >
                      {code.code}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-[#2D2926]">{code.user?.email}</td>
                  <td className="px-6 py-4 text-[#2D2926]/75">{code.order?.shopifyOrderId}</td>
                  <td className="px-6 py-4 text-[#2D2926]/75">{code.quantity}</td>
                  <td className="px-6 py-4 text-[#2D2926]/75 capitalize">{code.deliveryType}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-[11px] ${
                        code.status === 'claimed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {code.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#2D2926]/75">{code.mediaCount}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(code._id, 'revoke')}
                        className="px-3 py-1 rounded-full border border-blue-300 bg-blue-50 text-blue-700 text-xs hover:bg-blue-100 transition-colors"
                      >
                        Revoke
                      </button>
                      <button
                        onClick={() => handleAction(code._id, 'reset')}
                        className="px-3 py-1 rounded-full border border-red-300 bg-red-50 text-red-700 text-xs hover:bg-red-100 transition-colors"
                      >
                        Reset
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {codes.length === 0 && (
            <div className="p-12 text-center text-[#2D2926]/50">No codes found</div>
          )}
        </div>
    </div>
  );
}

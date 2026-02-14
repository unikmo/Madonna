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

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Codes Management
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 hover:bg-red-500/30 transition-all"
          >
            Logout
          </button>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 mb-8">
          <Link
            href="/admin/dashboard"
            className="px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-all"
          >
            Overview
          </Link>
          <Link
            href="/admin/buyers"
            className="px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-all"
          >
            Buyers
          </Link>
          <Link
            href="/admin/codes"
            className="px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-xl text-purple-300"
          >
            Codes
          </Link>
        </div>

        {/* Filters */}
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by code..."
              className="px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="claimed">Claimed</option>
            </select>
            <select
              value={quantityFilter}
              onChange={(e) => setQuantityFilter(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Quantities</option>
              <option value="1">1</option>
              <option value="4">4</option>
              <option value="7">7</option>
            </select>
            <select
              value={deliveryTypeFilter}
              onChange={(e) => setDeliveryTypeFilter(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Types</option>
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
              className="px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-all"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Code</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Buyer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Order</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Quantity</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Media</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {codes.map((code, index) => (
                <motion.tr
                  key={code._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-t border-white/10 hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/codes/${code._id}`}
                      className="text-purple-400 hover:text-purple-300 font-mono"
                    >
                      {code.code}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-white">{code.user?.email}</td>
                  <td className="px-6 py-4 text-gray-300">{code.order?.shopifyOrderId}</td>
                  <td className="px-6 py-4 text-gray-300">{code.quantity}</td>
                  <td className="px-6 py-4 text-gray-300 capitalize">{code.deliveryType}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs ${
                        code.status === 'claimed'
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-yellow-500/20 text-yellow-300'
                      }`}
                    >
                      {code.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{code.mediaCount}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(code._id, 'revoke')}
                        className="px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded-lg text-blue-300 text-xs hover:bg-blue-500/30"
                      >
                        Revoke
                      </button>
                      <button
                        onClick={() => handleAction(code._id, 'reset')}
                        className="px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-xs hover:bg-red-500/30"
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
            <div className="p-12 text-center text-gray-400">No codes found</div>
          )}
        </div>
      </div>
    </div>
  );
}

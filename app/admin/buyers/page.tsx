'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Buyer {
  _id: string;
  email: string;
  ordersCount: number;
  codesCount: number;
  createdAt: string;
}

export default function BuyersPage() {
  const router = useRouter();
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchBuyers();
  }, [search, sortBy, sortOrder]);

  const fetchBuyers = async () => {
    try {
      const params = new URLSearchParams({
        search,
        sortBy,
        sortOrder,
      });
      const response = await fetch(`/api/admin/buyers?${params}`);
      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await response.json();
      setBuyers(data.buyers || []);
    } catch (error) {
      console.error('Failed to fetch buyers:', error);
    } finally {
      setLoading(false);
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
            Buyers
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
            className="px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-xl text-purple-300"
          >
            Buyers
          </Link>
          <Link
            href="/admin/codes"
            className="px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-all"
          >
            Codes
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email..."
              className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="createdAt">Sort by Date</option>
              <option value="email">Sort by Email</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-all"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Orders</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Codes</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Created</th>
              </tr>
            </thead>
            <tbody>
              {buyers.map((buyer, index) => (
                <motion.tr
                  key={buyer._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-t border-white/10 hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 text-white">{buyer.email}</td>
                  <td className="px-6 py-4 text-gray-300">{buyer.ordersCount}</td>
                  <td className="px-6 py-4 text-gray-300">{buyer.codesCount}</td>
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(buyer.createdAt).toLocaleDateString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {buyers.length === 0 && (
            <div className="p-12 text-center text-gray-400">No buyers found</div>
          )}
        </div>
      </div>
    </div>
  );
}

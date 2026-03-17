'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-[#2D2926] text-lg">Loading…</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Search and Filters */}
      <div className="rounded-2xl p-6 border border-[#E3DAD0] bg-white shadow-sm">
          <div className="flex gap-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email..."
              className="flex-1 px-4 py-2 rounded-xl border border-[#D3C7BB] bg-white text-[#2D2926] placeholder-[#2D2926]/35 focus:outline-none focus:ring-2 focus:ring-[#2D2926]/20"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-xl border border-[#D3C7BB] bg-white text-[#2D2926] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D2926]/20"
            >
              <option value="createdAt">Sort by Date</option>
              <option value="email">Sort by Email</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-2 rounded-xl border border-[#D3C7BB] bg-white text-[#2D2926] hover:bg-[#F5ECE3] transition-colors"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-[#E3DAD0] bg-white overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-[#F5ECE3]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#2D2926]/80">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#2D2926]/80">Orders</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#2D2926]/80">Codes</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#2D2926]/80">Created</th>
              </tr>
            </thead>
            <tbody>
              {buyers.map((buyer, index) => (
                <motion.tr
                  key={buyer._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-t border-[#EFE3D8] hover:bg-[#FDF7F0] transition-colors"
                >
                  <td className="px-6 py-4 text-[#2D2926]">{buyer.email}</td>
                  <td className="px-6 py-4 text-[#2D2926]/75">{buyer.ordersCount}</td>
                  <td className="px-6 py-4 text-[#2D2926]/75">{buyer.codesCount}</td>
                  <td className="px-6 py-4 text-[#2D2926]/60">
                    {new Date(buyer.createdAt).toLocaleDateString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {buyers.length === 0 && (
            <div className="p-12 text-center text-[#2D2926]/50">No buyers found</div>
          )}
        </div>
    </div>
  );
}

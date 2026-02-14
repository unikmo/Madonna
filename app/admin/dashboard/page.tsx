'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ShopifyConnectionStatus } from '@/components/ShopifyConnectionStatus';
import toast from 'react-hot-toast';

interface Stats {
  totalBuyers: number;
  totalOrders: number;
  totalCodes: number;
  claimedCodes: number;
  unclaimedCodes: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTestEmail, setShowTestEmail] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testingEmail, setTestingEmail] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats', {
        credentials: 'include', // Important: include cookies
      });
      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      // Don't redirect on error - let middleware handle it
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const handleTestEmail = async () => {
    if (!testEmail || !testEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setTestingEmail(true);
    try {
      const response = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ testEmail }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.error || 'Failed to send test email');
        if (data.details) {
          console.error('Email test error details:', data.details);
        }
        return;
      }

      toast.success(data.message || 'Test email sent successfully!');
      setTestEmail('');
      setShowTestEmail(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to send test email');
      console.error('Test email error:', error);
    } finally {
      setTestingEmail(false);
    }
  };

  const statCards = [
    {
      title: 'Total Buyers',
      value: stats?.totalBuyers || 0,
      color: 'from-purple-500 to-purple-600',
      icon: '👥',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      color: 'from-blue-500 to-blue-600',
      icon: '📦',
    },
    {
      title: 'Total Codes',
      value: stats?.totalCodes || 0,
      color: 'from-pink-500 to-pink-600',
      icon: '🎁',
    },
    {
      title: 'Claimed Codes',
      value: stats?.claimedCodes || 0,
      color: 'from-green-500 to-green-600',
      icon: '✅',
    },
    {
      title: 'Unclaimed Codes',
      value: stats?.unclaimedCodes || 0,
      color: 'from-yellow-500 to-yellow-600',
      icon: '⏳',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <ShopifyConnectionStatus />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Admin Dashboard
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
            className="px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-xl text-purple-300"
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
            className="px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-all"
          >
            Codes
          </Link>
          <Link
            href="/admin/shopify"
            className="px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-all"
          >
            Shopify
          </Link>
        </div>

        {/* Test Email Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-2">Email Configuration</h2>
              <p className="text-gray-400 text-sm">Test your SMTP email connection</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowTestEmail(!showTestEmail)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold hover:from-purple-500 hover:to-pink-500 transition-all"
            >
              {showTestEmail ? 'Cancel' : '📧 Test Email'}
            </motion.button>
          </div>

          <AnimatePresence>
            {showTestEmail && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-white/10"
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Test Email Address
                    </label>
                    <input
                      type="email"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="your-email@example.com"
                      className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !testingEmail) {
                          handleTestEmail();
                        }
                      }}
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleTestEmail}
                    disabled={testingEmail || !testEmail}
                    className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-500 hover:to-emerald-500 transition-all flex items-center justify-center gap-2"
                  >
                    {testingEmail ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Testing Connection...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        Send Test Email
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">{card.icon}</span>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} opacity-20`} />
              </div>
              <h3 className="text-gray-400 text-sm mb-2">{card.title}</h3>
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                className="text-3xl font-bold text-white"
              >
                {card.value.toLocaleString()}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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

  const handleTestEmail = async () => {
    if (!testEmail || !testEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setTestingEmail(true);
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    try {
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), 20000);
      const response = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ testEmail }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      timeoutId = null;

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
      const message = error?.name === 'AbortError'
        ? 'Email test timed out. Please verify SMTP host/port and try again.'
        : (error.message || 'Failed to send test email');
      toast.error(message);
      console.error('Test email error:', error);
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
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
      <div className="flex items-center justify-center py-12">
        <div className="text-[#2D2926] text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <ShopifyConnectionStatus />
      {/* Test Email Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 border border-[#E3DAD0] bg-white shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-[#2D2926] mb-1">Email configuration</h2>
            <p className="text-sm text-[#2D2926]/60">Test your SMTP email connection</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowTestEmail(!showTestEmail)}
            className="px-4 py-2 rounded-full bg-[#2D2926] text-[#FDF9F5] text-xs font-medium tracking-wide uppercase hover:bg-[#1E1B18] transition-colors"
          >
            {showTestEmail ? 'Cancel' : 'Test email'}
          </motion.button>
        </div>

        <AnimatePresence>
          {showTestEmail && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-[#E3DAD0]"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#2D2926] mb-2">
                    Test email address
                  </label>
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="your-email@example.com"
                    className="w-full px-4 py-2 rounded-xl border border-[#D3C7BB] bg-white text-[#2D2926] placeholder-[#2D2926]/40 focus:outline-none focus:ring-2 focus:ring-[#2D2926]/20"
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
                  className="w-full py-3 rounded-full bg-[#2D2926] text-[#FDF9F5] text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1E1B18] transition-colors flex items-center justify-center gap-2"
                >
                    {testingEmail ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending…
                      </>
                    ) : (
                      'Send test email'
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-2xl p-6 border border-[#E3DAD0] bg-white shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl" aria-hidden>{card.icon}</span>
            </div>
            <h3 className="text-sm font-medium text-[#2D2926]/70 mb-1">{card.title}</h3>
            <p className="text-2xl font-semibold text-[#2D2926]">{card.value.toLocaleString()}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

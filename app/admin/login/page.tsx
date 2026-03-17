'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important: include cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || 'Login failed';
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      // Login successful - cookie should be set by server
      console.log('✅ Login response received:', data);
      console.log('Response headers:', response.headers);
      
      // Check if cookie is in response
      const setCookieHeader = response.headers.get('set-cookie');
      console.log('Set-Cookie header:', setCookieHeader);
      
      toast.success('Login successful! Redirecting...');
      
      // Force a full page reload to ensure cookie is available to middleware
      // Use a longer delay to ensure the cookie is fully set
      setTimeout(() => {
        console.log('Redirecting to dashboard...');
        window.location.href = '/admin/dashboard';
      }, 500);
    } catch (err: any) {
      const errorMsg = err.message || 'Login failed';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF9F5] flex items-center justify-center p-6 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-2xl bg-white shadow-[0_18px_45px_rgba(0,0,0,0.08)] border border-[#E3DAD0] px-6 sm:px-8 py-8"
      >
        <h1 className="text-center font-serif text-[24px] sm:text-[28px] text-[#2D2926] mb-2">Admin Login</h1>
        <p className="text-center text-sm text-[#2D2926]/60 mb-8">Access the admin dashboard</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#2D2926] mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-[#D3C7BB] bg-white text-[#2D2926] placeholder-[#2D2926]/35 focus:outline-none focus:ring-2 focus:ring-[#2D2926]/20"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2D2926] mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-[#D3C7BB] bg-white text-[#2D2926] placeholder-[#2D2926]/35 focus:outline-none focus:ring-2 focus:ring-[#2D2926]/20"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl border border-red-300 bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-[#2D2926] text-[#FDF9F5] text-[11px] tracking-[0.2em] uppercase font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1E1B18] transition-colors"
          >
            {loading ? 'Logging in...' : 'Login'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

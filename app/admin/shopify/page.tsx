'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface CredentialsStatus {
  hasCredentials: boolean;
  storeDomain: string;
  baseUrl: string;
  apiVersion: string;
  hasAccessToken: boolean;
  hasWebhookSecret: boolean;
}

interface DecryptedCredentials {
  storeDomain: string;
  accessToken: string;
  webhookSecret: string;
  baseUrl: string;
  apiVersion: string;
  source: 'db' | 'env';
}

export default function ShopifyCredentialsPage() {
  const router = useRouter();
  const [status, setStatus] = useState<CredentialsStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordForView, setPasswordForView] = useState('');
  const [decryptedCredentials, setDecryptedCredentials] = useState<DecryptedCredentials | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    storeDomain: '',
    accessToken: '',
    webhookSecret: '',
    baseUrl: '',
    apiVersion: '2024-10',
    password: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/admin/shopify-credentials', {
        credentials: 'include',
      });
      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }
      if (!response.ok) {
        throw new Error('Failed to fetch credentials status');
      }
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Failed to fetch credentials status:', error);
      toast.error('Failed to load credentials status');
    } finally {
      setLoading(false);
    }
  };

  const handleViewCredentials = () => {
    setShowPasswordModal(true);
    setPasswordForView('');
    setDecryptedCredentials(null);
  };

  const handleDecryptCredentials = async () => {
    if (!passwordForView) {
      toast.error('Please enter a password');
      return;
    }

    try {
      const response = await fetch('/api/admin/shopify-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'decrypt',
          password: passwordForView,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Failed to decrypt credentials');
        return;
      }

      setDecryptedCredentials(data.credentials);
      toast.success('Credentials decrypted successfully');
      // Close the modal after successful decryption
      setShowPasswordModal(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to decrypt credentials');
    }
  };

  const handleEdit = () => {
    if (decryptedCredentials) {
      setFormData({
        storeDomain: decryptedCredentials.storeDomain,
        accessToken: decryptedCredentials.accessToken,
        webhookSecret: decryptedCredentials.webhookSecret,
        baseUrl: decryptedCredentials.baseUrl,
        apiVersion: decryptedCredentials.apiVersion,
        password: '',
      });
      setShowEditForm(true);
    } else {
      // If no decrypted credentials, start fresh
      setFormData({
        storeDomain: status?.storeDomain || '',
        accessToken: '',
        webhookSecret: '',
        baseUrl: status?.baseUrl || (typeof window !== 'undefined' ? window.location.origin : ''),
        apiVersion: status?.apiVersion || '2024-10',
        password: '',
      });
      setShowEditForm(true);
    }
  };

  const handleSave = async () => {
    if (!formData.storeDomain || !formData.accessToken || !formData.webhookSecret || !formData.password) {
      toast.error('Please fill all fields including password');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/admin/shopify-credentials', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Failed to save credentials');
        return;
      }

      toast.success('Credentials saved successfully');
      setShowEditForm(false);
      setFormData({
        storeDomain: '',
        accessToken: '',
        webhookSecret: '',
        baseUrl: '',
        apiVersion: '2024-10',
        password: '',
      });
      setDecryptedCredentials(null);
      setPasswordForView('');
      fetchStatus();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save credentials');
    } finally {
      setSaving(false);
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Shopify Connection
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
            className="px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-all"
          >
            Codes
          </Link>
          <Link
            href="/admin/shopify"
            className="px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-xl text-purple-300"
          >
            Shopify
          </Link>
        </div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 mb-6"
        >
          <h2 className="text-2xl font-semibold text-white mb-4">Connection Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Credentials Stored:</span>
              <span className={`font-semibold ${status?.hasCredentials ? 'text-green-400' : 'text-yellow-400'}`}>
                {status?.hasCredentials ? 'Yes (Database)' : 'No (Using Env Variables)'}
              </span>
            </div>
            {status?.storeDomain && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Store Domain:</span>
                <span className="text-white font-mono text-sm">{status.storeDomain}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-gray-400">API Version:</span>
              <span className="text-white">{status?.apiVersion || '2024-10'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Access Token:</span>
              <span className={`font-semibold ${status?.hasAccessToken ? 'text-green-400' : 'text-red-400'}`}>
                {status?.hasAccessToken ? '✓ Set' : '✗ Not Set'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Webhook Secret:</span>
              <span className={`font-semibold ${status?.hasWebhookSecret ? 'text-green-400' : 'text-red-400'}`}>
                {status?.hasWebhookSecret ? '✓ Set' : '✗ Not Set'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Base URL:</span>
              <span className="text-white font-mono text-sm break-all text-right max-w-[60%]">
                {status?.baseUrl || (typeof window !== 'undefined' ? window.location.origin : '')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Webhook URL:</span>
              <span className="text-white font-mono text-sm break-all text-right max-w-[60%]">
                {status?.baseUrl 
                  ? `${status.baseUrl.replace(/\/$/, '')}/api/webhooks/shopify/orders-paid`
                  : typeof window !== 'undefined' 
                    ? `${window.location.origin}/api/webhooks/shopify/orders-paid`
                    : '/api/webhooks/shopify/orders-paid'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleViewCredentials}
            className="px-6 py-3 bg-purple-500/20 border border-purple-500/50 rounded-xl text-purple-300 hover:bg-purple-500/30 transition-all"
          >
            View Credentials
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleEdit}
            className="px-6 py-3 bg-blue-500/20 border border-blue-500/50 rounded-xl text-blue-300 hover:bg-blue-500/30 transition-all"
          >
            {status?.hasCredentials ? 'Edit Credentials' : 'Set Credentials'}
          </motion.button>
        </div>

        {/* Decrypted Credentials Display */}
        {decryptedCredentials && !showEditForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 mb-6"
          >
            <h2 className="text-2xl font-semibold text-white mb-4">Decrypted Credentials</h2>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm">Store Domain</label>
                <div className="mt-1 px-4 py-2 bg-black/20 rounded-lg text-white font-mono text-sm">
                  {decryptedCredentials.storeDomain}
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Access Token</label>
                <div className="mt-1 px-4 py-2 bg-black/20 rounded-lg text-white font-mono text-sm break-all">
                  {decryptedCredentials.accessToken}
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Webhook Secret</label>
                <div className="mt-1 px-4 py-2 bg-black/20 rounded-lg text-white font-mono text-sm break-all">
                  {decryptedCredentials.webhookSecret}
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Base URL</label>
                <div className="mt-1 px-4 py-2 bg-black/20 rounded-lg text-white font-mono text-sm break-all">
                  {decryptedCredentials.baseUrl}
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-sm">API Version</label>
                <div className="mt-1 px-4 py-2 bg-black/20 rounded-lg text-white">
                  {decryptedCredentials.apiVersion}
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Source</label>
                <div className="mt-1 px-4 py-2 bg-black/20 rounded-lg text-white">
                  {decryptedCredentials.source === 'db' ? 'Database' : 'Environment Variables'}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Edit Form */}
        <AnimatePresence>
          {showEditForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20"
            >
              <h2 className="text-2xl font-semibold text-white mb-4">
                {status?.hasCredentials ? 'Edit Credentials' : 'Set Credentials'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Store Domain</label>
                  <input
                    type="text"
                    value={formData.storeDomain}
                    onChange={(e) => setFormData({ ...formData, storeDomain: e.target.value })}
                    placeholder="your-store.myshopify.com"
                    className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Access Token</label>
                  <input
                    type="password"
                    value={formData.accessToken}
                    onChange={(e) => setFormData({ ...formData, accessToken: e.target.value })}
                    placeholder="Enter Shopify Access Token"
                    className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Webhook Secret</label>
                  <input
                    type="password"
                    value={formData.webhookSecret}
                    onChange={(e) => setFormData({ ...formData, webhookSecret: e.target.value })}
                    placeholder="Enter Webhook Secret"
                    className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Base URL</label>
                  <input
                    type="text"
                    value={formData.baseUrl}
                    onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
                    placeholder="https://yourdomain.com"
                    className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    Base URL for webhook callbacks (e.g., https://yourdomain.com)
                  </p>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">API Version</label>
                  <input
                    type="text"
                    value={formData.apiVersion}
                    onChange={(e) => setFormData({ ...formData, apiVersion: e.target.value })}
                    placeholder="2024-10"
                    className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Encryption Password <span className="text-yellow-400">*</span>
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter password to encrypt credentials"
                    className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    This password will be used to encrypt your credentials. Remember it - you&apos;ll need it to view/edit later.
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 bg-green-500/20 border border-green-500/50 rounded-xl text-green-300 hover:bg-green-500/30 transition-all disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => {
                      setShowEditForm(false);
                      setFormData({
                        storeDomain: '',
                        accessToken: '',
                        webhookSecret: '',
                        baseUrl: '',
                        apiVersion: '2024-10',
                        password: '',
                      });
                    }}
                    className="px-6 py-2 bg-gray-500/20 border border-gray-500/50 rounded-xl text-gray-300 hover:bg-gray-500/30 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Password Modal */}
        <AnimatePresence>
          {showPasswordModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setShowPasswordModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="backdrop-blur-xl bg-slate-800/90 rounded-2xl p-8 border border-white/20 max-w-md w-full mx-4"
              >
                <h2 className="text-2xl font-semibold text-white mb-4">Enter Password</h2>
                <p className="text-gray-400 mb-6">
                  Enter the password used to encrypt the credentials to view them.
                </p>
                <div className="space-y-4">
                  <input
                    type="password"
                    value={passwordForView}
                    onChange={(e) => setPasswordForView(e.target.value)}
                    placeholder="Enter encryption password"
                    className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleDecryptCredentials();
                      }
                    }}
                  />
                  <div className="flex gap-4">
                    <button
                      onClick={handleDecryptCredentials}
                      className="flex-1 px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-xl text-purple-300 hover:bg-purple-500/30 transition-all"
                    >
                      Decrypt
                    </button>
                    <button
                      onClick={() => {
                        setShowPasswordModal(false);
                        setPasswordForView('');
                        setDecryptedCredentials(null);
                      }}
                      className="flex-1 px-4 py-2 bg-gray-500/20 border border-gray-500/50 rounded-xl text-gray-300 hover:bg-gray-500/30 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [testModeEffective, setTestModeEffective] = useState<boolean | null>(null);
  const [testModeOverride, setTestModeOverride] = useState<boolean | null>(null);
  const [testModeEnvDefault, setTestModeEnvDefault] = useState<boolean | null>(null);
  const [savingTestMode, setSavingTestMode] = useState(false);
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
  const [subscribingWebhook, setSubscribingWebhook] = useState(false);

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

      const testModeRes = await fetch('/api/admin/settings/shopify-test-mode', {
        credentials: 'include',
      });
      if (testModeRes.ok) {
        const tm = await testModeRes.json();
        setTestModeEffective(tm.effective);
        setTestModeOverride(tm.override);
        setTestModeEnvDefault(tm.envDefault);
      }
    } catch (error) {
      console.error('Failed to fetch credentials status:', error);
      toast.error('Failed to load credentials status');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTestMode = async (value: boolean | null) => {
    try {
      setSavingTestMode(true);
      const response = await fetch('/api/admin/settings/shopify-test-mode', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ override: value }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || 'Failed to update test mode');
        return;
      }
      setTestModeOverride(data.override);
      setTestModeEffective(data.effective);
      setTestModeEnvDefault(data.envDefault);
      toast.success(`Shopify test mode ${data.effective ? 'enabled' : 'disabled'}`);
    } catch (error: any) {
      console.error('Failed to update test mode:', error);
      toast.error(error.message || 'Failed to update test mode');
    } finally {
      setSavingTestMode(false);
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

  const handleSubscribeWebhook = async () => {
    try {
      setSubscribingWebhook(true);
      const response = await fetch('/api/admin/shopify-webhooks/subscribe', {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Failed to subscribe webhook');
        return;
      }

      if (data.alreadySubscribed) {
        toast.success('Webhook is already subscribed for orders/paid');
      } else {
        toast.success('Webhook subscribed successfully');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to subscribe webhook');
    } finally {
      setSubscribingWebhook(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-[#2D2926] text-lg">Loading…</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 border border-[#E3DAD0] bg-white shadow-sm"
      >
        <h2 className="text-lg font-semibold text-[#2D2926] mb-4">Connection status</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[#2D2926]/70 text-sm">Credentials stored</span>
            <span className={`font-semibold text-sm ${status?.hasCredentials ? 'text-emerald-600' : 'text-amber-600'}`}>
              {status?.hasCredentials ? 'Yes (database)' : 'No (env)'}
            </span>
          </div>
          {status?.storeDomain && (
            <div className="flex items-center justify-between">
              <span className="text-[#2D2926]/70 text-sm">Store domain</span>
              <span className="text-[#2D2926] font-mono text-sm">{status.storeDomain}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-[#2D2926]/70 text-sm">API version</span>
            <span className="text-[#2D2926]">{status?.apiVersion || '2024-10'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#2D2926]/70 text-sm">Access token</span>
            <span className={`font-semibold text-sm ${status?.hasAccessToken ? 'text-emerald-600' : 'text-red-600'}`}>
              {status?.hasAccessToken ? '✓ Set' : '✗ Not set'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#2D2926]/70 text-sm">Webhook secret</span>
            <span className={`font-semibold text-sm ${status?.hasWebhookSecret ? 'text-emerald-600' : 'text-red-600'}`}>
              {status?.hasWebhookSecret ? '✓ Set' : '✗ Not set'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#2D2926]/70 text-sm">Base URL</span>
            <span className="text-[#2D2926] font-mono text-sm break-all text-right max-w-[60%]">
              {status?.baseUrl || (typeof window !== 'undefined' ? window.location.origin : '')}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#2D2926]/70 text-sm">Webhook URL</span>
            <span className="text-[#2D2926] font-mono text-sm break-all text-right max-w-[60%]">
              {status?.baseUrl
                ? `${status.baseUrl.replace(/\/$/, '')}/api/webhooks/shopify/orders-paid`
                : typeof window !== 'undefined'
                  ? `${window.location.origin}/api/webhooks/shopify/orders-paid`
                  : '/api/webhooks/shopify/orders-paid'}
            </span>
          </div>
          <div className="mt-4 pt-4 border-t border-[#E3DAD0]">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="block text-[#2D2926] text-sm font-medium">Shopify test mode</span>
                <span className="block text-xs text-[#2D2926]/55">
                  {testModeOverride === null
                    ? `Following env (SHOPIFY_TEST_MODE=${String(testModeEnvDefault)})`
                    : 'Overridden in admin'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleTestMode(false)}
                  className={`px-3 py-1 text-xs rounded-full border ${
                    testModeEffective === false ? 'bg-[#2D2926] text-[#FDF9F5] border-[#2D2926]' : 'border-[#D3C7BB] text-[#2D2926]/70'
                  }`}
                  disabled={savingTestMode}
                >
                  Live
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleTestMode(true)}
                  className={`px-3 py-1 text-xs rounded-full border ${
                    testModeEffective === true ? 'bg-[#2D2926] text-[#FDF9F5] border-[#2D2926]' : 'border-[#D3C7BB] text-[#2D2926]/70'
                  }`}
                  disabled={savingTestMode}
                >
                  Test
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleTestMode(null)}
                  className="px-3 py-1 text-xs rounded-full border border-dashed border-[#D3C7BB] text-[#2D2926]/55"
                  disabled={savingTestMode}
                >
                  Use env
                </button>
              </div>
            </div>
            {typeof testModeEffective === 'boolean' && (
              <p className="text-xs text-[#2D2926]/60 mt-1">
                Using <span className="font-semibold text-[#2D2926]">{testModeEffective ? 'TEST' : 'LIVE'}</span> store & products.
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleViewCredentials}
          className="px-4 py-2 rounded-full border border-[#2D2926]/20 text-[#2D2926] text-sm font-medium hover:bg-[#2D2926] hover:text-[#FDF9F5] transition-colors"
        >
          View credentials
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleEdit}
          className="px-4 py-2 rounded-full bg-[#2D2926] text-[#FDF9F5] text-sm font-medium hover:bg-[#1E1B18] transition-colors"
        >
          {status?.hasCredentials ? 'Edit credentials' : 'Set credentials'}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubscribeWebhook}
          disabled={subscribingWebhook}
          className="px-4 py-2 rounded-full border border-[#2D2926]/20 text-[#2D2926] text-sm font-medium hover:bg-[#2D2926] hover:text-[#FDF9F5] disabled:opacity-50 transition-colors"
        >
          {subscribingWebhook ? 'Subscribing…' : 'Subscribe orders/paid webhook'}
        </motion.button>
      </div>

      {/* Decrypted Credentials Display */}
      {decryptedCredentials && !showEditForm && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 border border-[#E3DAD0] bg-white shadow-sm"
        >
          <h2 className="text-lg font-semibold text-[#2D2926] mb-4">Decrypted credentials</h2>
          <div className="space-y-4">
            <div>
              <label className="text-[#2D2926]/70 text-sm">Store domain</label>
              <div className="mt-1 px-4 py-2 rounded-xl bg-[#F5ECE3] text-[#2D2926] font-mono text-sm">
                {decryptedCredentials.storeDomain}
              </div>
            </div>
            <div>
              <label className="text-[#2D2926]/70 text-sm">Access token</label>
              <div className="mt-1 px-4 py-2 rounded-xl bg-[#F5ECE3] text-[#2D2926] font-mono text-sm break-all">
                {decryptedCredentials.accessToken}
              </div>
            </div>
            <div>
              <label className="text-[#2D2926]/70 text-sm">Webhook secret</label>
              <div className="mt-1 px-4 py-2 rounded-xl bg-[#F5ECE3] text-[#2D2926] font-mono text-sm break-all">
                {decryptedCredentials.webhookSecret}
              </div>
            </div>
            <div>
              <label className="text-[#2D2926]/70 text-sm">Base URL</label>
              <div className="mt-1 px-4 py-2 rounded-xl bg-[#F5ECE3] text-[#2D2926] font-mono text-sm break-all">
                {decryptedCredentials.baseUrl}
              </div>
            </div>
            <div>
              <label className="text-[#2D2926]/70 text-sm">API version</label>
              <div className="mt-1 px-4 py-2 rounded-xl bg-[#F5ECE3] text-[#2D2926]">
                {decryptedCredentials.apiVersion}
              </div>
            </div>
            <div>
              <label className="text-[#2D2926]/70 text-sm">Source</label>
              <div className="mt-1 px-4 py-2 rounded-xl bg-[#F5ECE3] text-[#2D2926]">
                {decryptedCredentials.source === 'db' ? 'Database' : 'Environment'}
              </div>
            </div>
          </div>
        </motion.div>
        )}

      {/* Edit Form */}
        <AnimatePresence>
          {showEditForm && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="rounded-2xl p-6 border border-[#E3DAD0] bg-white shadow-sm"
            >
              <h2 className="text-lg font-semibold text-[#2D2926] mb-4">
                {status?.hasCredentials ? 'Edit credentials' : 'Set credentials'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[#2D2926] text-sm mb-2">Store domain</label>
                  <input
                    type="text"
                    value={formData.storeDomain}
                    onChange={(e) => setFormData({ ...formData, storeDomain: e.target.value })}
                    placeholder="your-store.myshopify.com"
                    className="w-full px-4 py-2 rounded-xl border border-[#D3C7BB] bg-white text-[#2D2926] placeholder-[#2D2926]/40 focus:outline-none focus:ring-2 focus:ring-[#2D2926]/20"
                  />
                </div>
                <div>
                  <label className="block text-[#2D2926] text-sm mb-2">Access token</label>
                  <input
                    type="password"
                    value={formData.accessToken}
                    onChange={(e) => setFormData({ ...formData, accessToken: e.target.value })}
                    placeholder="Shopify access token"
                    className="w-full px-4 py-2 rounded-xl border border-[#D3C7BB] bg-white text-[#2D2926] placeholder-[#2D2926]/40 focus:outline-none focus:ring-2 focus:ring-[#2D2926]/20"
                  />
                </div>
                <div>
                  <label className="block text-[#2D2926] text-sm mb-2">Webhook secret</label>
                  <input
                    type="password"
                    value={formData.webhookSecret}
                    onChange={(e) => setFormData({ ...formData, webhookSecret: e.target.value })}
                    placeholder="Webhook secret"
                    className="w-full px-4 py-2 rounded-xl border border-[#D3C7BB] bg-white text-[#2D2926] placeholder-[#2D2926]/40 focus:outline-none focus:ring-2 focus:ring-[#2D2926]/20"
                  />
                </div>
                <div>
                  <label className="block text-[#2D2926] text-sm mb-2">Base URL</label>
                  <input
                    type="text"
                    value={formData.baseUrl}
                    onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
                    placeholder="https://yourdomain.com"
                    className="w-full px-4 py-2 rounded-xl border border-[#D3C7BB] bg-white text-[#2D2926] placeholder-[#2D2926]/40 focus:outline-none focus:ring-2 focus:ring-[#2D2926]/20"
                  />
                  <p className="text-[#2D2926]/55 text-xs mt-1">Webhook callbacks base URL</p>
                </div>
                <div>
                  <label className="block text-[#2D2926] text-sm mb-2">API version</label>
                  <input
                    type="text"
                    value={formData.apiVersion}
                    onChange={(e) => setFormData({ ...formData, apiVersion: e.target.value })}
                    placeholder="2024-10"
                    className="w-full px-4 py-2 rounded-xl border border-[#D3C7BB] bg-white text-[#2D2926] focus:outline-none focus:ring-2 focus:ring-[#2D2926]/20"
                  />
                </div>
                <div>
                  <label className="block text-[#2D2926] text-sm mb-2">Encryption password <span className="text-amber-600">*</span></label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Password to encrypt credentials"
                    className="w-full px-4 py-2 rounded-xl border border-[#D3C7BB] bg-white text-[#2D2926] placeholder-[#2D2926]/40 focus:outline-none focus:ring-2 focus:ring-[#2D2926]/20"
                  />
                  <p className="text-[#2D2926]/55 text-xs mt-1">Required to view or edit later.</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 rounded-full bg-[#2D2926] text-[#FDF9F5] text-sm font-medium hover:bg-[#1E1B18] disabled:opacity-50 transition-colors"
                  >
                    {saving ? 'Saving…' : 'Save'}
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
                    className="px-4 py-2 rounded-full border border-[#D3C7BB] text-[#2D2926] text-sm hover:bg-[#F5ECE3] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      {/* Password modal */}
        <AnimatePresence>
          {showPasswordModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowPasswordModal(false)}
            >
              <motion.div
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="rounded-2xl p-6 sm:p-8 bg-white border border-[#E3DAD0] shadow-xl max-w-md w-full"
              >
                <h2 className="text-lg font-semibold text-[#2D2926] mb-2">Enter password</h2>
                <p className="text-[#2D2926]/60 text-sm mb-4">
                  Password used to encrypt credentials.
                </p>
                <div className="space-y-4">
                  <input
                    type="password"
                    value={passwordForView}
                    onChange={(e) => setPasswordForView(e.target.value)}
                    placeholder="Encryption password"
                    className="w-full px-4 py-2 rounded-xl border border-[#D3C7BB] bg-white text-[#2D2926] placeholder-[#2D2926]/40 focus:outline-none focus:ring-2 focus:ring-[#2D2926]/20"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleDecryptCredentials();
                    }}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleDecryptCredentials}
                      className="flex-1 px-4 py-2 rounded-full bg-[#2D2926] text-[#FDF9F5] text-sm font-medium hover:bg-[#1E1B18] transition-colors"
                    >
                      Decrypt
                    </button>
                    <button
                      onClick={() => {
                        setShowPasswordModal(false);
                        setPasswordForView('');
                        setDecryptedCredentials(null);
                      }}
                      className="flex-1 px-4 py-2 rounded-full border border-[#D3C7BB] text-[#2D2926] text-sm hover:bg-[#F5ECE3] transition-colors"
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
  );
}

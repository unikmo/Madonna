'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { WAITLIST_COPY_DEFAULTS, type WaitlistCopyFields } from '@/lib/waitlist-copy-defaults';

type WaitlistRow = {
  _id: string;
  email: string;
  name: string;
  deliveryType: 'physical' | 'digital' | null;
  productId: string | null;
  productTitle: string | null;
  quantity: 1 | 4 | 7 | null;
  status: 'pending' | 'invited' | 'code_sent';
  order: string | null;
  generatedCodes: string[];
  createdAt: string;
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  invited: 'Invited',
  code_sent: 'Code sent',
};

export default function AdminConfigsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sellingEnabled, setSellingEnabled] = useState(true);
  const [copyFields, setCopyFields] = useState<WaitlistCopyFields>({ ...WAITLIST_COPY_DEFAULTS });

  const [waitlistLoading, setWaitlistLoading] = useState(true);
  const [entries, setEntries] = useState<WaitlistRow[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'invited' | 'code_sent'>('all');
  const [genModal, setGenModal] = useState<WaitlistRow | null>(null);
  const [genQty, setGenQty] = useState<'1' | '4' | '7'>('1');
  const [genDelivery, setGenDelivery] = useState<'digital' | 'physical'>('digital');
  const [genBusy, setGenBusy] = useState(false);

  const loadConfig = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/configs', { credentials: 'include' });
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      setSellingEnabled(data.sellingEnabled !== false);
      setCopyFields({
        waitlistHeadline: data.waitlistHeadline ?? WAITLIST_COPY_DEFAULTS.waitlistHeadline,
        waitlistSubline1: data.waitlistSubline1 ?? WAITLIST_COPY_DEFAULTS.waitlistSubline1,
        waitlistSubline2: data.waitlistSubline2 ?? WAITLIST_COPY_DEFAULTS.waitlistSubline2,
        waitlistSupportingLine:
          data.waitlistSupportingLine ?? WAITLIST_COPY_DEFAULTS.waitlistSupportingLine,
        waitlistEmailPlaceholder:
          data.waitlistEmailPlaceholder ?? WAITLIST_COPY_DEFAULTS.waitlistEmailPlaceholder,
        waitlistNamePlaceholder:
          data.waitlistNamePlaceholder ?? WAITLIST_COPY_DEFAULTS.waitlistNamePlaceholder,
        waitlistCtaLabel: data.waitlistCtaLabel ?? WAITLIST_COPY_DEFAULTS.waitlistCtaLabel,
      });
    } catch (e) {
      console.error(e);
      toast.error('Failed to load config');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const loadWaitlist = useCallback(async () => {
    try {
      setWaitlistLoading(true);
      const q = statusFilter === 'all' ? '' : `?status=${statusFilter}`;
      const res = await fetch(`/api/admin/waitlist${q}`, { credentials: 'include' });
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      setEntries(data.entries || []);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load waitlist');
    } finally {
      setWaitlistLoading(false);
    }
  }, [router, statusFilter]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  useEffect(() => {
    loadWaitlist();
  }, [loadWaitlist]);

  const saveConfig = async () => {
    try {
      setSaving(true);
      const res = await fetch('/api/admin/configs', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sellingEnabled,
          ...copyFields,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Save failed');
      }
      toast.success('Configuration saved');
      await loadConfig();
    } catch (e: any) {
      toast.error(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const updateEntryStatus = async (id: string, status: WaitlistRow['status']) => {
    try {
      const res = await fetch(`/api/admin/waitlist/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Update failed');
      }
      toast.success('Status updated');
      loadWaitlist();
    } catch (e: any) {
      toast.error(e.message || 'Update failed');
    }
  };

  const runGenerate = async () => {
    if (!genModal) return;
    try {
      setGenBusy(true);
      const res = await fetch(`/api/admin/waitlist/${genModal._id}/generate-code`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          momentQuantity: Number(genQty),
          deliveryType: genDelivery,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      toast.success(`Sent ${data.generatedCodes?.length || 0} code(s) to ${genModal.email}`);
      setGenModal(null);
      loadWaitlist();
    } catch (e: any) {
      toast.error(e.message || 'Generation failed');
    } finally {
      setGenBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="text-[#2D2926]/60 text-sm py-12 text-center">Loading configuration…</div>
    );
  }

  return (
    <div className="space-y-10 max-w-5xl">
      <section className="rounded-2xl border border-[#E3DAD0] bg-white p-6 sm:p-8 shadow-sm">
        <h2 className="font-serif text-xl text-[#2D2926] mb-2">Selling &amp; waitlist</h2>
        <p className="text-sm text-[#2D2926]/65 mb-6">
          When <strong>selling is off</strong>, the storefront collects waitlist signups (name + email) instead of
          checkout. Toggle below to start or stop saving waitlist data.
        </p>

        <div className="flex items-center justify-between gap-4 rounded-xl border border-[#E3DAD0] px-4 py-4 bg-[#FDF9F5]">
          <div>
            <p className="font-medium text-[#2D2926]">Selling enabled</p>
            <p className="text-xs text-[#2D2926]/55 mt-0.5">
              Turn off to show the waitlist popup and disable purchases on the landing page.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={sellingEnabled}
            onClick={() => setSellingEnabled((v) => !v)}
            className={`relative h-8 w-14 flex-shrink-0 rounded-full transition-colors ${
              sellingEnabled ? 'bg-[#2D2926]' : 'bg-[#C4B8AD]'
            }`}
          >
            <span
              className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                sellingEnabled ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-semibold text-[#2D2926] uppercase tracking-wider">Waitlist popup copy</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Headline"
              value={copyFields.waitlistHeadline}
              onChange={(v) => setCopyFields((c) => ({ ...c, waitlistHeadline: v }))}
            />
            <Field
              label="Supporting line"
              value={copyFields.waitlistSupportingLine}
              onChange={(v) => setCopyFields((c) => ({ ...c, waitlistSupportingLine: v }))}
            />
            <Field
              label="Subline 1"
              value={copyFields.waitlistSubline1}
              onChange={(v) => setCopyFields((c) => ({ ...c, waitlistSubline1: v }))}
            />
            <Field
              label="Subline 2"
              value={copyFields.waitlistSubline2}
              onChange={(v) => setCopyFields((c) => ({ ...c, waitlistSubline2: v }))}
            />
            <Field
              label="Email placeholder"
              value={copyFields.waitlistEmailPlaceholder}
              onChange={(v) => setCopyFields((c) => ({ ...c, waitlistEmailPlaceholder: v }))}
            />
            <Field
              label="Name placeholder"
              value={copyFields.waitlistNamePlaceholder}
              onChange={(v) => setCopyFields((c) => ({ ...c, waitlistNamePlaceholder: v }))}
            />
            <Field
              label="CTA button"
              value={copyFields.waitlistCtaLabel}
              onChange={(v) => setCopyFields((c) => ({ ...c, waitlistCtaLabel: v }))}
            />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={saveConfig}
            disabled={saving}
            className="rounded-xl bg-[#2D2926] text-[#FDF9F5] px-5 py-2.5 text-sm font-medium disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save configuration'}
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-[#E3DAD0] bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="font-serif text-xl text-[#2D2926]">Waitlist signups</h2>
            <p className="text-sm text-[#2D2926]/60 mt-1">
              Status: <strong>Pending</strong> (new), <strong>Invited</strong> (contacted),{' '}
              <strong>Code sent</strong> (moment codes emailed).
            </p>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="rounded-xl border border-[#E3DAD0] bg-white px-3 py-2 text-sm text-[#2D2926]"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="invited">Invited</option>
            <option value="code_sent">Code sent</option>
          </select>
        </div>

        {waitlistLoading ? (
          <p className="text-sm text-[#2D2926]/50 py-8 text-center">Loading…</p>
        ) : entries.length === 0 ? (
          <p className="text-sm text-[#2D2926]/50 py-8 text-center">No entries yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-[#E3DAD0] text-[#2D2926]/55 uppercase text-[10px] tracking-wider">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Product</th>
                  <th className="py-2 pr-4">Delivery</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Codes</th>
                  <th className="py-2 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((row) => (
                  <tr key={row._id} className="border-b border-[#E3DAD0]/60 align-top">
                    <td className="py-3 pr-4 text-[#2D2926]">{row.name}</td>
                    <td className="py-3 pr-4 text-[#2D2926]/80">{row.email}</td>
                    <td className="py-3 pr-4 text-[#2D2926]/80 text-xs">
                      {row.productTitle || '—'}
                      {row.quantity ? ` (${row.quantity})` : ''}
                    </td>
                    <td className="py-3 pr-4 text-[#2D2926]/80 text-xs">
                      {row.deliveryType ? row.deliveryType : '—'}
                    </td>
                    <td className="py-3 pr-4">
                      <select
                        value={row.status}
                        onChange={(e) =>
                          updateEntryStatus(row._id, e.target.value as WaitlistRow['status'])
                        }
                        className="rounded-lg border border-[#E3DAD0] bg-[#FDF9F5] px-2 py-1 text-xs"
                      >
                        <option value="pending">{STATUS_LABELS.pending}</option>
                        <option value="invited">{STATUS_LABELS.invited}</option>
                        <option value="code_sent">{STATUS_LABELS.code_sent}</option>
                      </select>
                    </td>
                    <td className="py-3 pr-4 text-xs text-[#2D2926]/70 max-w-[180px]">
                      {row.generatedCodes?.length ? row.generatedCodes.join(', ') : '—'}
                      {row.order && (
                        <div className="mt-1">
                          <Link
                            href={`/admin/orders/${row.order}`}
                            className="text-[#2D2926] underline hover:no-underline"
                          >
                            View order
                          </Link>
                        </div>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <button
                        type="button"
                        onClick={() => {
                          setGenQty('1');
                          setGenDelivery('digital');
                          setGenModal(row);
                        }}
                        className="text-xs font-medium text-[#2D2926] underline"
                      >
                        Generate code
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {genModal && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40"
          onClick={() => !genBusy && setGenModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-serif text-lg text-[#2D2926] mb-1">Generate moment codes</h3>
            <p className="text-sm text-[#2D2926]/65 mb-4">
              {genModal.name} — {genModal.email}
            </p>
            <div className="space-y-3 mb-6">
              <div>
                <label className="block text-xs font-medium text-[#2D2926] mb-1">Key quantity</label>
                <select
                  value={genQty}
                  onChange={(e) => setGenQty(e.target.value as '1' | '4' | '7')}
                  className="w-full rounded-xl border border-[#E3DAD0] px-3 py-2 text-sm"
                >
                  <option value="1">1 key</option>
                  <option value="4">4 keys</option>
                  <option value="7">7 keys</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#2D2926] mb-1">Delivery</label>
                <select
                  value={genDelivery}
                  onChange={(e) => setGenDelivery(e.target.value as 'digital' | 'physical')}
                  className="w-full rounded-xl border border-[#E3DAD0] px-3 py-2 text-sm"
                >
                  <option value="digital">Digital</option>
                  <option value="physical">Physical</option>
                </select>
              </div>
            </div>
            <p className="text-xs text-[#2D2926]/55 mb-4">
              Creates an internal order and emails codes (same flow as admin orders, without Shopify checkout).
            </p>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setGenModal(null)}
                disabled={genBusy}
                className="px-4 py-2 text-sm rounded-xl border border-[#E3DAD0]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={runGenerate}
                disabled={genBusy}
                className="px-4 py-2 text-sm rounded-xl bg-[#2D2926] text-white disabled:opacity-50"
              >
                {genBusy ? 'Working…' : 'Generate & email'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-[#2D2926]/70">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-[#E3DAD0] px-3 py-2 text-sm text-[#2D2926]"
      />
    </label>
  );
}

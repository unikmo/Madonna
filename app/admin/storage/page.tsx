'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type CheckRow = {
  id: string;
  label: string;
  ok: boolean;
  detail?: string;
  durationMs?: number;
};

type Result = {
  ok: boolean;
  summary: string;
  checks: CheckRow[];
  bucket?: string;
  region?: string;
  publicBaseUrl?: string;
  durationMs?: number;
};

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className ?? ''}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export default function AdminStoragePage() {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const runCheck = async () => {
    setRunning(true);
    setResult(null);
    try {
      const res = await fetch('/api/admin/s3-check', {
        method: 'POST',
        credentials: 'include',
      });
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = (await res.json()) as Result & { error?: string };
      if (!res.ok) {
        toast.error(data.error || 'Check failed');
        setResult({
          ok: false,
          summary: data.error || 'Request failed',
          checks: [],
        });
        return;
      }
      setResult(data);
      if (data.ok) {
        toast.success(data.summary);
      } else {
        toast.error(data.summary);
      }
    } catch (e: any) {
      toast.error(e.message || 'Network error');
      setResult({
        ok: false,
        summary: e.message || 'Network error',
        checks: [],
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-2xl border border-[#E3DAD0] bg-white p-6 shadow-sm">
        <h2 className="font-serif text-xl text-[#2D2926]">Amazon S3 connectivity</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#2D2926]/80">
          Runs a safe health check against your configured bucket: list, upload a tiny probe file, read it
          back, verify a public URL (if your bucket allows anonymous GET), presigned PUT (same path as
          browser uploads), then delete the probes. Nothing touches real moment media except under{' '}
          <code className="rounded bg-[#F5ECE3] px-1 py-0.5 text-xs">unikmo-moments/_admin_healthcheck/</code>
          .
        </p>
        <button
          type="button"
          onClick={runCheck}
          disabled={running}
          aria-busy={running}
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2D2926] px-5 py-2.5 text-sm font-medium text-[#FDF9F5] transition-opacity disabled:pointer-events-none disabled:opacity-55 min-w-[200px]"
        >
          {running ? (
            <>
              <Spinner className="h-4 w-4 text-[#FDF9F5]" />
              Checking bucket…
            </>
          ) : (
            'Run S3 check'
          )}
        </button>
        {running && (
          <p className="mt-3 text-xs text-[#2D2926]/55">
            This can take 10–30 seconds while the server talks to S3 (list, put, get, presign, delete).
          </p>
        )}
      </div>

      {result && (
        <div
          className={`rounded-2xl border p-6 shadow-sm ${
            result.ok
              ? 'border-emerald-200/80 bg-emerald-50/50'
              : 'border-amber-200/80 bg-amber-50/40'
          }`}
        >
          <p className="font-medium text-[#2D2926]">{result.summary}</p>
          {(result.bucket || result.region) && (
            <p className="mt-2 text-xs text-[#2D2926]/65">
              {result.bucket && (
                <>
                  Bucket: <span className="font-mono">{result.bucket}</span>
                </>
              )}
              {result.bucket && result.region ? ' · ' : null}
              {result.region && (
                <>
                  Region: <span className="font-mono">{result.region}</span>
                </>
              )}
              {result.publicBaseUrl && (
                <>
                  <br />
                  Public base: <span className="break-all font-mono">{result.publicBaseUrl}</span>
                </>
              )}
              {typeof result.durationMs === 'number' && (
                <>
                  <br />
                  Total time: {result.durationMs} ms
                </>
              )}
            </p>
          )}

          {result.checks.length > 0 && (
            <ul className="mt-4 space-y-2 border-t border-[#E3DAD0]/80 pt-4">
              {result.checks.map((c) => (
                <li
                  key={c.id}
                  className="flex flex-col gap-0.5 rounded-lg bg-white/70 px-3 py-2 text-sm sm:flex-row sm:items-start sm:justify-between"
                >
                  <span className="text-[#2D2926]">
                    <span className={c.ok ? 'text-emerald-700' : 'text-red-700'}>
                      {c.ok ? '✓' : '✗'}
                    </span>{' '}
                    {c.label}
                  </span>
                  <span className="text-xs text-[#2D2926]/70 sm:max-w-[55%] sm:text-right">
                    {c.detail}
                    {typeof c.durationMs === 'number' ? ` (${c.durationMs} ms)` : ''}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface MediaItem {
  type: 'image' | 'video' | 'audio' | 'text';
  url: string;
  createdAt: string;
}

interface CodeDetail {
  _id: string;
  code: string;
  user: { email: string };
  order: { shopifyOrderId: string; email: string; totalPrice: number };
  quantity: number;
  deliveryType: string;
  status: string;
  claimedAt?: string;
  media: MediaItem[];
  createdAt: string;
  updatedAt: string;
}

export default function CodeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const codeId = params.codeId as string;
  const [code, setCode] = useState<CodeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  useEffect(() => {
    fetchCode();
  }, [codeId]);

  const fetchCode = async () => {
    try {
      const response = await fetch(`/api/admin/codes/${codeId}`);
      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await response.json();
      setCode(data.code);
    } catch (error) {
      console.error('Failed to fetch code:', error);
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

  if (!code) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-[#2D2926] text-lg">Code not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Link
        href="/admin/codes"
        className="inline-flex items-center gap-1 text-[#2D2926]/80 hover:text-[#2D2926] text-sm font-medium"
      >
        ← Back to Codes
      </Link>

      <div className="rounded-2xl p-6 border border-[#E3DAD0] bg-white shadow-sm">
        <h1 className="font-mono text-xl sm:text-2xl font-semibold text-[#2D2926] mb-4">{code.code}</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-[#2D2926]/60 text-xs uppercase tracking-wide">Buyer</p>
            <p className="text-[#2D2926] mt-0.5">{code.user.email}</p>
          </div>
          <div>
            <p className="text-[#2D2926]/60 text-xs uppercase tracking-wide">Order</p>
            <p className="text-[#2D2926] mt-0.5 font-mono">{code.order.shopifyOrderId}</p>
          </div>
          <div>
            <p className="text-[#2D2926]/60 text-xs uppercase tracking-wide">Status</p>
            <span
              className={`inline-block mt-0.5 px-2 py-1 rounded-full text-xs font-medium ${
                code.status === 'claimed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
              }`}
            >
              {code.status}
            </span>
          </div>
          <div>
            <p className="text-[#2D2926]/60 text-xs uppercase tracking-wide">Media</p>
            <p className="text-[#2D2926] mt-0.5">{code.media.length}</p>
          </div>
        </div>
      </div>

      {code.media.length === 0 ? (
        <div className="rounded-2xl p-12 border border-[#E3DAD0] bg-white text-center text-[#2D2926]/50">
          No media uploaded yet
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {code.media.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedMedia(item)}
              className="rounded-xl overflow-hidden border border-[#E3DAD0] bg-white shadow-sm cursor-pointer hover:border-[#2D2926]/30 transition-colors"
            >
              {item.type === 'image' && (
                <img src={item.url} alt={`Media ${index + 1}`} className="w-full h-48 object-cover" />
              )}
              {item.type === 'video' && (
                <video src={item.url} className="w-full h-48 object-cover" muted />
              )}
              {item.type === 'audio' && (
                <div className="p-8 bg-[#F5ECE3] flex items-center justify-center h-48">
                  <svg className="w-12 h-12 text-[#2D2926]/50" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                  </svg>
                </div>
              )}
              {item.type === 'text' && (
                <div className="p-8 bg-[#F5ECE3] flex items-center justify-center h-48">
                  <svg className="w-12 h-12 text-[#2D2926]/50" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              <div className="p-3 border-t border-[#EFE3D8]">
                <p className="text-[#2D2926] font-medium capitalize text-sm">{item.type}</p>
                <p className="text-[#2D2926]/55 text-xs mt-0.5">{new Date(item.createdAt).toLocaleDateString()}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {selectedMedia && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <motion.div
            initial={{ scale: 0.96 }}
            animate={{ scale: 1 }}
            className="max-w-4xl w-full rounded-2xl bg-white border border-[#E3DAD0] shadow-xl p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedMedia.type === 'image' && (
              <img src={selectedMedia.url} alt="Media" className="w-full rounded-xl" />
            )}
            {selectedMedia.type === 'video' && (
              <video src={selectedMedia.url} controls className="w-full rounded-xl" />
            )}
            {selectedMedia.type === 'audio' && (
              <div className="p-8">
                <audio src={selectedMedia.url} controls className="w-full" />
              </div>
            )}
            {selectedMedia.type === 'text' && (
              <div className="p-8">
                <a
                  href={selectedMedia.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2D2926] underline hover:no-underline"
                >
                  Open text content
                </a>
              </div>
            )}
            <button
              onClick={() => setSelectedMedia(null)}
              className="mt-4 px-4 py-2 rounded-full border border-[#D3C7BB] text-[#2D2926] text-sm hover:bg-[#F5ECE3] transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

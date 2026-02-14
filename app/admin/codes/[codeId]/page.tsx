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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!code) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Code not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/admin/codes"
          className="text-purple-400 hover:text-purple-300 mb-4 inline-block"
        >
          ← Back to Codes
        </Link>

        <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20 mb-6">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {code.code}
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Buyer</p>
              <p className="text-white">{code.user.email}</p>
            </div>
            <div>
              <p className="text-gray-400">Order</p>
              <p className="text-white">{code.order.shopifyOrderId}</p>
            </div>
            <div>
              <p className="text-gray-400">Status</p>
              <span
                className={`px-2 py-1 rounded-lg text-xs inline-block ${
                  code.status === 'claimed'
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-yellow-500/20 text-yellow-300'
                }`}
              >
                {code.status}
              </span>
            </div>
            <div>
              <p className="text-gray-400">Media Count</p>
              <p className="text-white">{code.media.length}</p>
            </div>
          </div>
        </div>

        {code.media.length === 0 ? (
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-12 border border-white/20 text-center text-gray-400">
            No media uploaded yet
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {code.media.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedMedia(item)}
                className="backdrop-blur-xl bg-white/10 rounded-xl overflow-hidden border border-white/20 cursor-pointer hover:border-purple-500/50 transition-all"
              >
                {item.type === 'image' && (
                  <img
                    src={item.url}
                    alt={`Media ${index + 1}`}
                    className="w-full h-64 object-cover"
                  />
                )}
                {item.type === 'video' && (
                  <video
                    src={item.url}
                    className="w-full h-64 object-cover"
                    muted
                  />
                )}
                {item.type === 'audio' && (
                  <div className="p-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center h-64">
                    <svg className="w-16 h-16 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                    </svg>
                  </div>
                )}
                {item.type === 'text' && (
                  <div className="p-8 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center h-64">
                    <svg className="w-16 h-16 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
                <div className="p-4">
                  <p className="text-white font-medium capitalize">{item.type}</p>
                  <p className="text-gray-400 text-xs">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal */}
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            onClick={() => setSelectedMedia(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="max-w-4xl w-full backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedMedia.type === 'image' && (
                <img
                  src={selectedMedia.url}
                  alt="Media"
                  className="w-full rounded-xl"
                />
              )}
              {selectedMedia.type === 'video' && (
                <video
                  src={selectedMedia.url}
                  controls
                  className="w-full rounded-xl"
                />
              )}
              {selectedMedia.type === 'audio' && (
                <div className="p-12">
                  <audio src={selectedMedia.url} controls className="w-full" />
                </div>
              )}
              {selectedMedia.type === 'text' && (
                <div className="p-12">
                  <a
                    href={selectedMedia.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 underline"
                  >
                    Open Text Content
                  </a>
                </div>
              )}
              <button
                onClick={() => setSelectedMedia(null)}
                className="mt-4 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

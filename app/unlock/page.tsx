'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  AnimatedMomentModal,
  type AnimatedMomentModalVariant,
} from '@/components/AnimatedMomentModal';
import {
  MAX_VIDEO_UPLOAD_BYTES,
  MAX_AUDIO_UPLOAD_BYTES,
  MAX_IMAGE_UPLOAD_BYTES,
  MAX_VIDEO_UPLOAD_LABEL,
} from '@/lib/media-upload-limits';
import { uploadFileViaPresignedPut } from '@/lib/s3-browser-upload';

interface MediaItem {
  type: 'image' | 'video' | 'audio' | 'text';
  url: string;
  createdAt: string;
}

// Icons matching landing How It Works
function IconKey() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6 mx-auto" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14.5 10.5a4.5 4.5 0 1 0-2.2 3.9L14 16h2l1-1h2v-2h-2l-1-1h-2l-1.2-1.2c.45-.15.87-.37 1.2-.66Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 10.5h.01" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}
function IconUpload() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6 mx-auto" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3v10" strokeLinecap="round" />
      <path d="M8.5 6.5 12 3l3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 14v4a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-4" strokeLinecap="round" />
    </svg>
  );
}
function IconHeart() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6 mx-auto" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 20s-7-4.4-9.2-9A5.4 5.4 0 0 1 12 6.2 5.4 5.4 0 0 1 21.2 11c-2.2 4.6-9.2 9-9.2 9Z" strokeLinejoin="round" />
    </svg>
  );
}

function UnlockPageContent() {
  const searchParams = useSearchParams();
  const codeParam = searchParams.get('code') || '';

  // --- Upload state ---
  const [uploadCode, setUploadCode] = useState(codeParam);
  const [uploadValidating, setUploadValidating] = useState(false);
  const [uploadValid, setUploadValid] = useState<boolean | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [media, setMedia] = useState<MediaItem | null>(null);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [deletingMedia, setDeletingMedia] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // --- Unlock state ---
  const [unlockCode, setUnlockCode] = useState('');
  const [unlockLoading, setUnlockLoading] = useState(false);
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [unlockMomentModal, setUnlockMomentModal] = useState<{
    open: boolean;
    variant: AnimatedMomentModalVariant;
    title: string;
    message: string;
    emoji: string;
    confirmLabel?: string;
  }>({
    open: false,
    variant: 'gentle',
    title: '',
    message: '',
    emoji: '',
  });
  const [unlockMedia, setUnlockMedia] = useState<MediaItem[]>([]);
  const [unlocked, setUnlocked] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<number | null>(null);
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = async () => {
    if (typeof window === 'undefined') return null;
    if (!audioContextRef.current) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      if (!Ctx) return null;
      audioContextRef.current = new Ctx();
    }
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
    return audioContextRef.current;
  };

  const playCelebrationSound = async () => {
    if (!soundEnabled) return;
    try {
      const ctx = await getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const playTone = (freq: number, start: number, duration: number, volume: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(volume, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        osc.start(start);
        osc.stop(start + duration + 0.03);
      };

      const playPop = (start: number, volume: number) => {
        const size = Math.floor(ctx.sampleRate * 0.12);
        const buffer = ctx.createBuffer(1, size, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < size; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / size, 2.2);
        }
        const source = ctx.createBufferSource();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        source.buffer = buffer;
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(520, start);
        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(volume, start + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.12);
        source.start(start);
      };

      [523.25, 659.25, 783.99, 1046.5].forEach((n, i) => {
        playTone(n, now + i * 0.11, 0.32, 0.055);
      });
      for (let i = 0; i < 14; i++) {
        playPop(now + 0.35 + i * 0.13, 0.03 + (i % 3) * 0.01);
      }
    } catch {
      // Ignore audio failures; visual celebration still runs.
    }
  };


  const parseResponseSafely = async (response: Response) => {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return response.json();
    }
    const text = await response.text();
    const preview = text.slice(0, 120).replace(/\s+/g, ' ').trim();
    throw new Error(
      `Server returned non-JSON response (status ${response.status}). If this works locally but fails live, the upload body is likely too large for hosted API limits. Response starts with: ${preview}`
    );
  };

  // Upload: validate code when it changes
  useEffect(() => {
    if (uploadCode && uploadCode.length >= 10) {
      setUploadValidating(true);
      setUploadError(null);
      fetch(`/api/media/validate-code?code=${encodeURIComponent(uploadCode.toUpperCase())}`)
        .then((r) => parseResponseSafely(r))
        .then((data) => {
          setUploadValid(!!data.valid);
          if (!data.valid) setUploadError(data.error || 'Invalid code');
        })
        .catch(() => {
          setUploadValid(false);
          setUploadError('Failed to validate');
        })
        .finally(() => setUploadValidating(false));
    } else {
      setUploadValid(null);
      setUploadError(null);
    }
  }, [uploadCode]);

  // Upload: load media when valid
  useEffect(() => {
    if (!uploadValid || !uploadCode || uploadCode.length < 10) return;
    setLoadingMedia(true);
    fetch(`/api/media/list?code=${encodeURIComponent(uploadCode.toUpperCase())}`)
      .then((r) => parseResponseSafely(r))
      .then((data) => {
        if (data.media && data.media.length > 0) setMedia(data.media[0]);
        else setMedia(null);
      })
      .catch(() => setMedia(null))
      .finally(() => setLoadingMedia(false));
  }, [uploadValid, uploadCode]);

  const uploadFile = useCallback(
    async (file: File) => {
      if (!uploadCode || !uploadValid || uploading) return;
      const fileType = file.type || '';
      const isVideo = fileType.startsWith('video/');
      const isAudio = fileType.startsWith('audio/');
      const isImage = fileType.startsWith('image/');
      if (isVideo && file.size > MAX_VIDEO_UPLOAD_BYTES) {
        toast.error(`Video max ${MAX_VIDEO_UPLOAD_LABEL}`);
        return;
      }
      if ((isAudio || isImage) && file.size > (isAudio ? MAX_AUDIO_UPLOAD_BYTES : MAX_IMAGE_UPLOAD_BYTES)) {
        toast.error(isAudio ? 'Audio max 40 MB' : 'Photo max 40 MB');
        return;
      }
      if (!isImage && !isVideo && !isAudio) {
        toast.error('Please use an image, video, or audio file.');
        return;
      }
      setUploading(true);
      setUploadProgress(0);
      try {
        const contentType =
          file.type ||
          (isVideo ? 'video/mp4' : isAudio ? 'audio/mpeg' : 'image/jpeg');

        const signRes = await fetch('/api/media/presign-upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: uploadCode.toUpperCase(),
            fileName: file.name,
            contentType,
            fileSize: file.size,
          }),
        });
        const signData = await parseResponseSafely(signRes);
        if (!signRes.ok) {
          throw new Error(signData.error || 'Failed to initialize upload');
        }

        const { uploadUrl, objectKey } = signData;
        if (!uploadUrl || !objectKey) {
          throw new Error('Server did not return an upload URL');
        }

        setUploadProgress(0);
        await uploadFileViaPresignedPut(
          file,
          uploadUrl,
          contentType,
          (pct) => setUploadProgress(pct)
        );

        const mediaType: MediaItem['type'] =
          isImage ? 'image' : isVideo ? 'video' : isAudio ? 'audio' : 'text';
        const res = await fetch('/api/media/complete-upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: uploadCode.toUpperCase(),
            mediaType,
            objectKey,
          }),
        });
        setUploadProgress(100);
        if (!res.ok) {
          const data = await parseResponseSafely(res);
          throw new Error(data.error || 'Upload failed');
        }
        const data = await parseResponseSafely(res);
        setMedia({ type: data.media.type, url: data.media.url, createdAt: new Date().toISOString() });
        toast.success('Uploaded successfully');
      } catch (err: any) {
        toast.error(err.message || 'Upload failed');
      } finally {
        setUploading(false);
        setTimeout(() => setUploadProgress(0), 1000);
      }
    },
    [uploadCode, uploadValid, uploading]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (uploadValid && !uploading && e.dataTransfer.files.length) uploadFile(e.dataTransfer.files[0]);
    },
    [uploadValid, uploading, uploadFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files?.[0] || !uploadValid || uploading) return;
      uploadFile(e.target.files[0]);
      e.target.value = '';
    },
    [uploadValid, uploading, uploadFile]
  );

  const handleDeleteMedia = async () => {
    if (!uploadCode || !media || deletingMedia) return;
    setDeletingMedia(true);
    try {
      const payload = { code: uploadCode.toUpperCase(), mediaUrl: media.url };
      let res: Response;
      try {
        res = await fetch('/api/media/delete', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch {
        res = await fetch('/api/media/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) throw new Error('Delete failed');
      setMedia(null);
      toast.success('Media deleted');
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeletingMedia(false);
    }
  };

  const handleUnlock = async () => {
    if (!unlockCode || unlockCode.length < 10) {
      setUnlockError('Please enter a valid code');
      setUnlockMomentModal({
        open: true,
        variant: 'gentle',
        title: 'Almost there',
        message: 'Please enter your full Moment Key in the format UNIKMO-XXXX-XXXX-XXX.',
        emoji: '🔑✨',
      });
      return;
    }
    setUnlockLoading(true);
    setUnlockError(null);
    try {
      const res = await fetch('/api/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: unlockCode.toUpperCase().trim() }),
      });
      const data = await parseResponseSafely(res);
      if (!res.ok) {
        if (data.reason === 'not_unlockable') {
          const blockedMessage =
            data.message ||
            'This moment cannot be unlocked because the owner has not uploaded media yet.';
          setUnlockError(data.error || 'This moment cannot be unlocked yet.');
          setUnlockMomentModal({
            open: true,
            variant: 'gentle',
            title: 'Moment Not Ready Yet',
            message: blockedMessage,
            emoji: '🔒✨',
          });
        } else if (data.reason === 'revoked') {
          const blockedMessage =
            data.message ||
            'This code is not available from UNIKMO. Please contact the UNIKMO team — we will be happy to help.';
          setUnlockError(data.error || 'This code is unavailable.');
          setUnlockMomentModal({
            open: true,
            variant: 'alert',
            title: 'Code Unavailable',
            message: blockedMessage,
            emoji: '🚫✨',
          });
        } else {
          const errMsg = data.error || data.message || 'Failed to unlock';
          setUnlockError(errMsg);
          setUnlockMomentModal({
            open: true,
            variant: 'alert',
            title: 'Could not unlock',
            message:
              data.message ||
              errMsg ||
              'Something went wrong. Please contact the UNIKMO team if this keeps happening.',
            emoji: '🔑✨',
          });
        }
        return;
      }
      setUnlockMedia(data.media || []);
      setUnlocked(true);
      setUnlockMomentModal((m) => ({ ...m, open: false }));
    } catch {
      setUnlockError('Failed to unlock');
      setUnlockMomentModal({
        open: true,
        variant: 'alert',
        title: 'Connection issue',
        message: 'We could not reach the server. Check your connection and try again.',
        emoji: '📡✨',
      });
    } finally {
      setUnlockLoading(false);
    }
  };

  const navigateMedia = (dir: 'prev' | 'next') => {
    if (selectedMedia === null) return;
    if (dir === 'prev') setSelectedMedia(selectedMedia > 0 ? selectedMedia - 1 : unlockMedia.length - 1);
    else setSelectedMedia(selectedMedia < unlockMedia.length - 1 ? selectedMedia + 1 : 0);
  };

  useEffect(() => {
    if (selectedMedia === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedMedia(null);
      else if (e.key === 'ArrowLeft') navigateMedia('prev');
      else if (e.key === 'ArrowRight') navigateMedia('next');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedMedia, unlockMedia.length]);

  useEffect(() => {
    const t = window.setTimeout(() => setShowWelcomeAnimation(false), 1800);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!unlocked) return;
    setShowCelebration(true);
    const t = window.setTimeout(() => setShowCelebration(false), 2600);
    return () => window.clearTimeout(t);
  }, [unlocked]);

  useEffect(() => {
    if (!showCelebration || !soundEnabled) return;
    // Keep playing gentle celebration sound while visual animation is active.
    playCelebrationSound();
    const interval = window.setInterval(() => {
      playCelebrationSound();
    }, 1200);
    return () => window.clearInterval(interval);
  }, [showCelebration, soundEnabled]);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => undefined);
      }
    };
  }, []);

  return (
    <motion.div
      className="min-h-screen bg-[#FDF9F5] text-[#2D2926]"
      animate={
        showCelebration
          ? { x: [0, -2, 2, -1, 1, 0], y: [0, 1, -1, 1, -1, 0] }
          : { x: 0, y: 0 }
      }
      transition={{
        duration: 0.32,
        repeat: showCelebration ? 6 : 0,
        ease: 'easeInOut',
      }}
    >
      <header className="border-b border-[#2D2926]/10 bg-[#FDF9F5]/95 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-serif text-lg tracking-wide text-[#2D2926]/80 hover:text-[#2D2926]">
            UNIKMO
          </Link>
          <Link href="/" className="text-xs sm:text-sm text-[#2D2926]/60 hover:text-[#2D2926]">
            ← Home
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {!unlocked && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl bg-[#FBF7F2]/95 px-5 sm:px-8 py-8 sm:py-10 ring-1 ring-black/10 shadow-[0_10px_26px_rgba(0,0,0,0.06)] mb-10 text-center relative overflow-hidden"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0.4 }}
              animate={{ scale: [0.95, 1.08, 1], opacity: [0.35, 0.2, 0.12] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#D9C8B4]"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0.4 }}
              animate={{ scale: [0.95, 1.08, 1], opacity: [0.35, 0.2, 0.12] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
              className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-[#E9DCCF]"
            />

            <div className="relative z-10">
              <p className="font-serif text-[11px] sm:text-[12px] text-[#2D2926]/70 uppercase tracking-wide">
                Unlock Your Moment
              </p>
              <h1 className="font-serif text-2xl sm:text-4xl text-[#2D2926] mt-2">
                A private memory is waiting for you
              </h1>
              <p className="text-sm sm:text-base text-[#2D2926]/65 mt-3 max-w-2xl mx-auto">
                Enter your Moment Key to unlock it.
              </p>
            </div>
          </motion.div>
        )}

        {/* Unlock a moment */}
        <section>
          <div className="rounded-xl bg-white/60 border border-[#2D2926]/10 p-4 sm:p-6 shadow-sm">
            {!unlocked ? (
              <>
                <label className="block text-sm font-medium text-[#2D2926] mb-2">Moment Code</label>
                <input
                  type="text"
                  value={unlockCode}
                  onChange={(e) => setUnlockCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                  placeholder="UNIKMO-XXXX-XXXX-XXX"
                  className="w-full px-4 py-3 rounded-lg border border-[#2D2926]/20 bg-white text-[#2D2926] placeholder-[#2D2926]/40 focus:outline-none focus:ring-2 focus:ring-[#2D2926]/20"
                  disabled={unlockLoading}
                />
                {unlockError && <p className="mt-2 text-sm text-red-600">{unlockError}</p>}
                <button
                  type="button"
                  onClick={handleUnlock}
                  disabled={unlockLoading || !unlockCode}
                  className="mt-4 w-full py-3 rounded-full bg-[#2D2926] text-white font-medium text-sm uppercase tracking-wide hover:bg-[#1E1B18] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {unlockLoading ? 'Unlocking…' : 'Unlock Moment'}
                </button>
              </>
            ) : (
              <div>
                <p className="text-green-700 font-medium mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-700 text-xs">✓</span>
                  Moment unlocked
                </p>
                {unlockMedia.length === 0 ? (
                  <p className="text-[#2D2926]/60">No media for this moment yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {unlockMedia.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-xl overflow-hidden border border-[#2D2926]/10 hover:border-[#2D2926]/30 transition-colors"
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedMedia(index)}
                          className="w-full text-left"
                        >
                          {item.type === 'image' && <img src={item.url} alt="" className="w-full h-48 object-cover" />}
                          {item.type === 'video' && (
                            <div className="relative w-full h-48 bg-black/10">
                              <video src={item.url} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center text-[#2D2926]">▶</span>
                              </div>
                            </div>
                          )}
                          {item.type === 'audio' && (
                            <div className="p-6 bg-[#2D2926]/5 flex items-center justify-center h-48">
                              <audio src={item.url} controls className="w-full max-w-xs" />
                            </div>
                          )}
                          {item.type === 'text' && (
                            <div className="p-6 bg-[#2D2926]/5 h-48 flex items-center justify-center text-[#2D2926]/60">Text content</div>
                          )}
                        </button>
                        <div className="p-3 border-t border-[#2D2926]/10">
                          <p className="text-xs text-[#2D2926]/60 capitalize">{item.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setUnlocked(false);
                    setUnlockMedia([]);
                    setUnlockCode('');
                    setUnlockError(null);
                    setUnlockMomentModal((m) => ({ ...m, open: false }));
                  }}
                  className="mt-6 text-sm text-[#2D2926]/60 hover:text-[#2D2926] underline"
                >
                  Unlock another code
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <AnimatedMomentModal
        open={unlockMomentModal.open && !unlocked}
        onClose={() => setUnlockMomentModal((m) => ({ ...m, open: false }))}
        variant={unlockMomentModal.variant}
        title={unlockMomentModal.title}
        message={unlockMomentModal.message}
        emoji={unlockMomentModal.emoji}
        confirmLabel={unlockMomentModal.confirmLabel}
      />

      <AnimatePresence>
        {showWelcomeAnimation && (
          <motion.div
            initial={{ opacity: 0.45 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8 }}
            className="pointer-events-none fixed inset-0 z-40 bg-[#F5ECE3]"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
          >
            {/* Soft glow backdrop */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: [0.95, 1.08, 1.02], opacity: [0, 0.2, 0.12] }}
              transition={{ duration: 1.25, repeat: 1, ease: 'easeOut' }}
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at 50% 58%, rgba(191,162,128,0.32) 0%, rgba(233,220,207,0.15) 28%, rgba(253,249,245,0) 68%)',
              }}
            />

            {/* Burst rings */}
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.span
                key={`ring-${i}`}
                initial={{ scale: 0.2, opacity: 0.5 }}
                animate={{ scale: [0.3, 1.8, 2.5], opacity: [0.35, 0.22, 0] }}
                transition={{
                  duration: 1.05,
                  delay: i * 0.14,
                  repeat: 1,
                  repeatDelay: 0.08,
                  ease: 'easeOut',
                }}
                className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full border"
                style={{
                  width: 120 + i * 10,
                  height: 120 + i * 10,
                  borderColor: i % 2 ? 'rgba(191,162,128,0.48)' : 'rgba(45,41,38,0.26)',
                }}
              />
            ))}

            {/* Firework sparks */}
            {Array.from({ length: 84 }).map((_, i) => {
              const angle = ((i * 137.5) % 360) * (Math.PI / 180);
              const radius = 16 + (i % 12) * 7;
              const dx = Math.cos(angle) * radius;
              const dy = Math.sin(angle) * radius;
              return (
                <motion.span
                  key={`spark-${i}`}
                  initial={{ x: '50vw', y: '58vh', scale: 0.2, opacity: 0 }}
                  animate={{
                    x: [`50vw`, `calc(50vw + ${dx}vw)`],
                    y: [`58vh`, `calc(58vh + ${dy}vh)`],
                    scale: [0.35, 1, 0.7],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 0.8 + (i % 7) * 0.09,
                    delay: (i % 14) * 0.06,
                    repeat: 1,
                    repeatType: 'loop',
                    ease: 'easeOut',
                  }}
                  style={{
                    position: 'absolute',
                    width: i % 3 === 0 ? 9 : 7,
                    height: i % 3 === 0 ? 9 : 7,
                    borderRadius: 9999,
                    background:
                      i % 3 === 0 ? '#2D2926' : i % 3 === 1 ? '#BFA280' : '#E9DCCF',
                    boxShadow: '0 0 16px rgba(191,162,128,0.72)',
                  }}
                />
              );
            })}

            {/* Streak particles */}
            {Array.from({ length: 30 }).map((_, i) => {
              const angle = ((i * 29) % 360) * (Math.PI / 180);
              const dx = Math.cos(angle) * (24 + (i % 8) * 6);
              const dy = Math.sin(angle) * (16 + (i % 9) * 5);
              return (
                <motion.span
                  key={`streak-${i}`}
                  initial={{ x: '50vw', y: '58vh', opacity: 0, rotate: `${(angle * 180) / Math.PI}deg` }}
                  animate={{
                    x: [`50vw`, `calc(50vw + ${dx}vw)`],
                    y: [`58vh`, `calc(58vh + ${dy}vh)`],
                    opacity: [0, 0.9, 0],
                  }}
                  transition={{
                    duration: 0.95,
                    delay: (i % 10) * 0.1,
                    repeat: 1,
                    ease: 'easeOut',
                  }}
                  className="absolute block"
                  style={{
                    width: 2,
                    height: 24 + (i % 4) * 7,
                    borderRadius: 9999,
                    background:
                      i % 2 ? 'linear-gradient(to bottom, #BFA280, rgba(191,162,128,0))' : 'linear-gradient(to bottom, #2D2926, rgba(45,41,38,0))',
                  }}
                />
              );
            })}

            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -8], scale: [0.95, 1, 1.02, 1] }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="absolute left-1/2 top-[27%] -translate-x-1/2 text-center"
            >
              <p className="font-serif text-2xl sm:text-4xl text-[#2D2926] tracking-wide">Moment Unlocked</p>
              <p className="text-sm sm:text-base text-[#2D2926]/65 mt-2">A memory worth celebrating</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Media viewer modal */}
      <AnimatePresence>
        {selectedMedia !== null && unlockMedia[selectedMedia] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
            onClick={() => setSelectedMedia(null)}
          >
            <button
              type="button"
              onClick={() => setSelectedMedia(null)}
              className="absolute top-4 right-4 z-[60] w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            {unlockMedia.length > 1 && (
              <>
                <button type="button" onClick={(e) => { e.stopPropagation(); navigateMedia('prev'); }} className="absolute left-4 z-[60] w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">←</button>
                <button type="button" onClick={(e) => { e.stopPropagation(); navigateMedia('next'); }} className="absolute right-4 z-[60] w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">→</button>
              </>
            )}
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="relative max-w-4xl w-full">
              {unlockMedia[selectedMedia].type === 'image' && (
                <img src={unlockMedia[selectedMedia].url} alt="" className="max-w-full max-h-[85vh] object-contain rounded-lg mx-auto" />
              )}
              {unlockMedia[selectedMedia].type === 'video' && (
                <video src={unlockMedia[selectedMedia].url} controls autoPlay className="max-w-full max-h-[85vh] rounded-lg mx-auto" />
              )}
              {unlockMedia[selectedMedia].type === 'audio' && (
                <div className="bg-white/10 rounded-xl p-8">
                  <audio src={unlockMedia[selectedMedia].url} controls className="w-full" />
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function UnlockPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDF9F5] flex items-center justify-center">
          <p className="text-[#2D2926]/60">Loading…</p>
        </div>
      }
    >
      <UnlockPageContent />
    </Suspense>
  );
}

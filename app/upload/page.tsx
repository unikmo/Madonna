'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface MediaItem {
  type: 'image' | 'video' | 'audio' | 'text';
  url: string;
  createdAt: string;
}

function UploadPageContent() {
  const searchParams = useSearchParams();
  const codeParam = searchParams.get('code') || '';
  const [code, setCode] = useState(codeParam);
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [media, setMedia] = useState<MediaItem | null>(null);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [deletingMedia, setDeletingMedia] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing media when code is validated
  useEffect(() => {
    if (code && code.length > 0) {
      validateCode(code);
    }
  }, [code]);

  // Load media when code is valid
  useEffect(() => {
    if (isValid) {
      loadMedia();
    }
  }, [isValid, code]);

  const loadMedia = async () => {
    if (!code || code.length < 10) return;

    setLoadingMedia(true);
    try {
      const response = await fetch(`/api/media/list?code=${encodeURIComponent(code.toUpperCase())}`);
      const data = await response.json();

      if (response.ok && data.media && data.media.length > 0) {
        // Only show the first (main) media file
        setMedia(data.media[0]);
      } else {
        setMedia(null);
      }
    } catch (err) {
      console.error('Failed to load media:', err);
      setMedia(null);
    } finally {
      setLoadingMedia(false);
    }
  };

  const validateCode = async (codeToValidate: string) => {
    if (!codeToValidate || codeToValidate.length < 10) {
      setIsValid(null);
      return;
    }

    setIsValidating(true);
    setError(null);

    try {
      const response = await fetch(`/api/media/validate-code?code=${encodeURIComponent(codeToValidate.toUpperCase())}`);
      const data = await response.json();

      if (data.valid) {
        setIsValid(true);
      } else {
        setIsValid(false);
        setError(data.error || 'Invalid code');
      }
    } catch (err: any) {
      setIsValid(false);
      setError('Failed to validate code');
    } finally {
      setIsValidating(false);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (!isValid || uploading) return;

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        await uploadFile(files[0]);
      }
    },
    [isValid, uploading]
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || !isValid || uploading) return;
      const file = e.target.files[0];
      if (file) {
        await uploadFile(file);
      }
      // Reset input
      e.target.value = '';
    },
    [isValid, uploading]
  );

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      video.onerror = () => {
        window.URL.revokeObjectURL(video.src);
        reject(new Error('Failed to load video metadata'));
      };
      video.src = URL.createObjectURL(file);
    });
  };

  const uploadFile = async (file: File) => {
    if (!code || !isValid) return;

    setError(null);

    // Determine file type
    const fileType = file.type || '';
    const isImage = fileType.startsWith('image/');
    const isVideo = fileType.startsWith('video/');
    const isAudio = fileType.startsWith('audio/');

    // Validate file size based on type
    const maxVideoSize = 350 * 1024 * 1024; // 350 MB
    const maxAudioSize = 40 * 1024 * 1024; // 40 MB
    const maxImageSize = 40 * 1024 * 1024; // 40 MB

    if (isVideo && file.size > maxVideoSize) {
      const errorMsg = `Video file exceeds 350 MB limit. Current size: ${(file.size / (1024 * 1024)).toFixed(2)} MB`;
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    if (isAudio && file.size > maxAudioSize) {
      const errorMsg = `Audio file exceeds 40 MB limit. Current size: ${(file.size / (1024 * 1024)).toFixed(2)} MB`;
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    if (isImage && file.size > maxImageSize) {
      const errorMsg = `Image file exceeds 40 MB limit. Current size: ${(file.size / (1024 * 1024)).toFixed(2)} MB`;
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    // Check video duration (3 minutes = 180 seconds)
    if (isVideo) {
      try {
        const duration = await getVideoDuration(file);
        if (duration > 180) {
          const errorMsg = `Video duration exceeds 3 minutes limit. Current duration: ${Math.ceil(duration)} seconds`;
          setError(errorMsg);
          toast.error(errorMsg);
          return;
        }
      } catch (err: any) {
        console.warn('Could not check video duration:', err);
        // Continue with upload if duration check fails
      }
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('code', code.toUpperCase());

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await response.json();
      
      // Replace existing media (only one file allowed)
      const newMedia: MediaItem = {
        type: data.media.type,
        url: data.media.url,
        createdAt: new Date().toISOString(),
      };
      
      setMedia(newMedia);
      toast.success(`Successfully uploaded ${file.name}`);

      // Reset progress after a moment
      setTimeout(() => setUploadProgress(0), 1000);
    } catch (err: any) {
      const errorMsg = err.message || 'Upload failed';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMedia = async () => {
    if (!code || !media || deletingMedia) return;

    setDeletingMedia(true);
    try {
      const response = await fetch('/api/media/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code.toUpperCase(),
          mediaUrl: media.url,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Delete failed');
      }

      // Clear media
      setMedia(null);
      toast.success('Media deleted successfully');
    } catch (err: any) {
      const errorMsg = err.message || 'Delete failed';
      toast.error(errorMsg);
    } finally {
      setDeletingMedia(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 shadow-2xl border border-white/20"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Upload Your Moment
          </h1>
          <p className="text-gray-300 mb-8">Share your special moment with a secure code</p>

          {/* Code Input */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-300 mb-2">Moment Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="UNIKMO-XXXX-XXXX-XXX"
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {isValidating && (
              <p className="mt-2 text-sm text-gray-400">Validating...</p>
            )}
            {isValid === false && !isValidating && (
              <p className="mt-2 text-sm text-red-400">{error || 'Invalid code'}</p>
            )}
            {isValid === true && !isValidating && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-sm text-green-400 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Code validated successfully
              </motion.p>
            )}
          </div>

          {/* Upload Area */}
          {isValid && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all mb-8 ${
                  isDragging
                    ? 'border-purple-400 bg-purple-500/20'
                    : 'border-white/30 bg-white/5'
                } ${uploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
              >
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={uploading || !isValid}
                  accept="image/*,video/*,audio/*"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="space-y-4"
                  >
                    <svg
                      className="w-16 h-16 mx-auto text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <div>
                      <p className="text-xl font-semibold text-white mb-2">
                        Drag and drop your file here
                      </p>
                      <p className="text-gray-400">or click to browse</p>
                      <div className="text-sm text-gray-500 mt-2 space-y-1">
                        <p>Video: max 350 MB, 3 minutes</p>
                        <p>Audio: max 40 MB</p>
                        <p>Photo: max 40 MB</p>
                      </div>
                    </div>
                  </motion.div>
                </label>

                {/* Upload Progress */}
                <AnimatePresence>
                  {uploading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="mt-8"
                    >
                      <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                        <motion.div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <p className="text-sm text-gray-400">Uploading... {uploadProgress}%</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300"
                >
                  {error}
                </motion.div>
              )}

              {/* Uploaded Media */}
              {loadingMedia ? (
                <div className="text-center py-12 text-gray-400">Loading media...</div>
              ) : media ? (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Uploaded Media</h3>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group backdrop-blur-xl bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all"
                  >
                    {/* Delete Button */}
                    <button
                      onClick={handleDeleteMedia}
                      disabled={deletingMedia}
                      className="absolute top-2 right-2 z-10 w-8 h-8 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                    >
                      {deletingMedia ? (
                        <svg
                          className="animate-spin h-4 w-4 text-white"
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
                      ) : (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )}
                    </button>

                    {/* Media Preview */}
                    {media.type === 'image' && (
                      <img
                        src={media.url}
                        alt="Uploaded media"
                        className="w-full h-64 object-cover"
                      />
                    )}
                    {media.type === 'video' && (
                      <video
                        src={media.url}
                        className="w-full h-64 object-cover"
                        controls
                      />
                    )}
                    {media.type === 'audio' && (
                      <div className="p-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center h-64">
                        <div className="text-center">
                          <svg className="w-16 h-16 text-purple-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                          </svg>
                          <audio src={media.url} controls className="w-full max-w-md" />
                        </div>
                      </div>
                    )}
                    {media.type === 'text' && (
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

                    {/* Media Info */}
                    <div className="p-4">
                      <p className="text-white font-medium capitalize text-sm">{media.type}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(media.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <p>No media uploaded yet. Upload your file above.</p>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function UploadPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <UploadPageContent />
    </Suspense>
  );
}

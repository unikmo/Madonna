'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { checkShopifyConnection, reconnectShopify, type ShopifyConnectionStatus } from '@/lib/shopify-connection';
import toast from 'react-hot-toast';

export function ShopifyConnectionStatus() {
  const [status, setStatus] = useState<ShopifyConnectionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [reconnecting, setReconnecting] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed this warning in this session
    const dismissedKey = 'shopify-warning-dismissed';
    const wasDismissed = sessionStorage.getItem(dismissedKey) === 'true';
    setDismissed(wasDismissed);
    
    checkConnection();
  }, []);

  // Auto-subscribe webhook if connected but not subscribed (only once per session)
  useEffect(() => {
    if (
      status && 
      status.connected && 
      !status.webhookSubscribed && 
      !dismissed && 
      !reconnecting &&
      !loading
    ) {
      // Check if we've already tried to auto-subscribe in this session
      const autoSubscribedKey = 'shopify-auto-subscribed';
      const alreadyTried = sessionStorage.getItem(autoSubscribedKey) === 'true';
      
      if (!alreadyTried) {
        // Mark as tried immediately
        sessionStorage.setItem(autoSubscribedKey, 'true');
        
        // Auto-subscribe immediately (no delay)
        const subscribe = async () => {
          setReconnecting(true);
          try {
            const result = await reconnectShopify();
            setStatus(result);
            
            // If reconnect was successful, clear flags
            if (result.connected && result.webhookSubscribed) {
              sessionStorage.removeItem('shopify-warning-dismissed');
              sessionStorage.removeItem('shopify-auto-subscribed');
              setDismissed(false);
            }
          } catch (error: any) {
            setStatus({
              connected: false,
              webhookSubscribed: false,
              error: error.message || 'Reconnection failed',
            });
          } finally {
            setReconnecting(false);
          }
        };
        
        subscribe();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status?.connected, status?.webhookSubscribed, dismissed, reconnecting, loading]);

  const checkConnection = async () => {
    setLoading(true);
    try {
      const result = await checkShopifyConnection();
      setStatus(result);
      // Don't show toast notifications - just update status silently
    } catch (error: any) {
      setStatus({
        connected: false,
        webhookSubscribed: false,
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReconnect = async () => {
    setReconnecting(true);
    try {
      const result = await reconnectShopify();
      setStatus(result);
      
      // If reconnect was successful, clear dismissal and auto-subscribe flag
      if (result.connected && result.webhookSubscribed) {
        sessionStorage.removeItem('shopify-warning-dismissed');
        sessionStorage.removeItem('shopify-auto-subscribed');
        setDismissed(false);
      }
    } catch (error: any) {
      setStatus({
        connected: false,
        webhookSubscribed: false,
        error: error.message || 'Reconnection failed',
      });
    } finally {
      setReconnecting(false);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('shopify-warning-dismissed', 'true');
  };

  // Auto-dismiss after 10 seconds if user doesn't interact
  useEffect(() => {
    if (status && (!status.connected || !status.webhookSubscribed) && !dismissed) {
      const autoDismissTimer = setTimeout(() => {
        setDismissed(true);
        sessionStorage.setItem('shopify-warning-dismissed', 'true');
      }, 10000); // Auto-dismiss after 10 seconds
      
      return () => clearTimeout(autoDismissTimer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status?.connected, status?.webhookSubscribed, dismissed]);

  if (loading) {
    return null;
  }

  // Only show warning if there's an issue, hide success state
  if (status?.connected && status?.webhookSubscribed) {
    // Success - don't show anything
    return null;
  }

  // Don't show if dismissed
  if (dismissed) {
    return null;
  }

  // Only show warning/error state
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        className="fixed top-4 right-4 z-50"
      >
        <div className="rounded-2xl p-5 border border-amber-200 bg-amber-50 shadow-lg max-w-md relative">
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-[#2D2926]/50 hover:text-[#2D2926] transition-colors"
            aria-label="Dismiss"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-start gap-3 pr-8">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-[#2D2926] mb-1">Shopify connection issue</h3>
              <p className="text-[#2D2926]/75 text-sm mb-4">
                {status?.error ||
                  (status?.connected && !status?.webhookSubscribed
                    ? 'Webhook not subscribed. Reconnect to fix.'
                    : 'Connection problem. Check status or reconnect.')}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleReconnect}
                  disabled={reconnecting}
                  className="px-3 py-1.5 rounded-full bg-[#2D2926] text-[#FDF9F5] text-xs font-medium hover:bg-[#1E1B18] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {reconnecting ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Reconnecting…
                    </>
                  ) : (
                    'Reconnect'
                  )}
                </button>
                <button
                  onClick={checkConnection}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-full border border-[#2D2926]/20 text-[#2D2926] text-xs font-medium hover:bg-[#2D2926]/5 disabled:opacity-50"
                >
                  Check status
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

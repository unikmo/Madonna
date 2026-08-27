'use client';

import { useEffect } from 'react';

export default function HashAlias() {
  useEffect(() => {
    const resolveLegacyHash = () => {
      if (window.location.hash !== '#how-it-works') return;
      window.requestAnimationFrame(() => {
        document.getElementById('how')?.scrollIntoView({ block: 'start' });
      });
    };

    resolveLegacyHash();
    window.addEventListener('hashchange', resolveLegacyHash);
    return () => window.removeEventListener('hashchange', resolveLegacyHash);
  }, []);

  return null;
}

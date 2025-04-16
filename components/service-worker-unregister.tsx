'use client';

import { useEffect } from 'react';

export default function ServiceWorkerUnregister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations: readonly ServiceWorkerRegistration[]) => {
        for (const registration of registrations) {
          registration.unregister();
        }
      });
    }
  }, []);

  return null;
}
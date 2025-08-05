import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'cookie-consent';

const enableAnalytics = () => {
  if (typeof window === 'undefined') return;
  // Example: update Google Analytics consent if gtag is available
  const gtag = (window as any).gtag;
  if (gtag) {
    gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'granted',
    });
  }
};

const disableAnalytics = () => {
  if (typeof window === 'undefined') return;
  const gtag = (window as any).gtag;
  if (gtag) {
    gtag('consent', 'update', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
    });
  }
};

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    enableAnalytics();
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem(STORAGE_KEY, 'rejected');
    disableAnalytics();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[95%] -translate-x-1/2 transform sm:w-[480px]">
      <div className="flex flex-col gap-3 rounded-xl border border-tech-gray-200 bg-white/90 p-4 shadow-card backdrop-blur">
        <p className="text-sm text-tech-gray-700">
          We use cookies to enhance your browsing experience and to analyze our traffic.{' '}
          <Link to="/privacy" className="underline text-tech-electric hover:text-tech-electric">
            Learn more
          </Link>
          .
        </p>
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="outline" onClick={handleReject}>
            Reject
          </Button>
          <Button size="sm" onClick={handleAccept}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;

"use client";

import { useEffect, useState, useRef } from "react";
import PrimaryButton from "@/components/button/primary-button";
import { CheckCircle, AlertCircle, Copy, Loader2 } from "lucide-react";

export default function TransakRefreshPage() {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [result, setResult] = useState<null | { accessToken: string; expiresAt: number }>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState<string>("");
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        setInitialLoading(true);
        const res = await fetch("/api/admin/transak/token");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch token");
        setResult(JSON.parse(data.token));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch token");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchToken();
  }, []);

  // Countdown effect
  useEffect(() => {
    if (result?.expiresAt) {
      if (countdownInterval.current) clearInterval(countdownInterval.current);
      const updateCountdown = () => {
        const now = Date.now() / 1000;
        let diff = result.expiresAt - now;
        if (diff <= 0) {
          setCountdown("Expired");
          if (countdownInterval.current) clearInterval(countdownInterval.current);
        } else {
          const days = Math.floor(diff / (60 * 60 * 24));
          diff -= days * 60 * 60 * 24;
          const hours = Math.floor(diff / (60 * 60));
          diff -= hours * 60 * 60;
          const mins = Math.floor(diff / 60);
          // Only show relevant units
          let str = "";
          if (days > 0) str += `${days}d `;
          if (hours > 0 || days > 0) str += `${hours}h `;
          str += `${mins}m`;
          setCountdown(str.trim());
        }
      };
      updateCountdown();
      countdownInterval.current = setInterval(updateCountdown, 1000);
      return () => {
        if (countdownInterval.current) clearInterval(countdownInterval.current);
      };
    } else {
      setCountdown("");
    }
  }, [result?.expiresAt]);

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    setCopied(false);

    try {
      const res = await fetch("/api/admin/transak/refresh-token", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to refresh token");
      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!result?.accessToken) return;
    try {
      await navigator.clipboard.writeText(result.accessToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Retry fetch
  const retryFetch = () => {
    setError(null);
    setInitialLoading(true);
    setResult(null);
    setCopied(false);
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  const LoadingSkeleton = () => (
    <div className="space-y-8 animate-pulse">
      <div className="h-10 w-2/3 bg-gray-200 rounded mb-2 shimmer" />
      <div className="h-5 w-32 bg-gray-200 rounded mb-6 shimmer" />
      <div className="h-4 w-1/2 bg-gray-200 rounded mb-8 shimmer" />
      <div className="h-12 w-full sm:w-60 bg-gray-300 rounded-full mb-10 shimmer" />
      <div className="h-1 w-full bg-gray-100 rounded mb-10 shimmer" />
      <div className="space-y-6">
        <div>
          <div className="h-4 w-24 bg-gray-200 rounded mb-2 shimmer" />
          <div className="h-10 w-full bg-gray-100 rounded shimmer" />
        </div>
        <div>
          <div className="h-4 w-20 bg-gray-200 rounded mb-2 shimmer" />
          <div className="h-6 w-32 bg-gray-100 rounded shimmer" />
        </div>
      </div>
    </div>
  );

  if (initialLoading) {
    return (
      <div className="min-h-[calc(100vh-130px)] w-full md:min-h-[calc(100vh-70px)] bg-gray-50 p-4 py-12">
        <div className="w-full max-w-2xl p-6">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-130px)] md:min-h-[calc(100vh-70px)] flex px-2 sm:px-4">
      <div className="w-full max-w-2xl mx-auto p-6 py-8 sm:py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 sticky top-0 z-10 pb-2">Refresh Transak Access Token</h1>
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {loading && (
            <span className="text-sm text-blue-600 flex items-center gap-1">
              <Loader2 className="w-4 h-4 animate-spin" />
              Refreshing...
            </span>
          )}
          {result && !loading && (
            <span className="text-sm text-green-600 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Token Active
            </span>
          )}
          {error && !loading && (
            <span className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              Error
            </span>
          )}
          {countdown && result && !loading && (
            <span className="text-xs text-gray-500 ml-2">Expires in: <span className="font-semibold">{countdown}</span></span>
          )}
        </div>
        <p className="text-gray-600 mb-8 max-w-xl">
          Click the button below to refresh the Transak access token. The new token will be displayed below.
        </p>
        <PrimaryButton
          onClick={handleRefresh}
          disabled={loading}
          className="mb-10 px-8 py-3 text-lg font-semibold rounded-full shadow-none bg-blue-600 hover:bg-blue-700 transition-colors duration-150 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Refreshing...
            </>
          ) : (
            "Refresh Token"
          )}
        </PrimaryButton>
        <hr className="my-10 border-gray-200" />
        {error && (
          <div className="flex flex-col items-start gap-2 text-red-700 mb-8">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
            <button
              onClick={retryFetch}
              className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              Retry
            </button>
          </div>
        )}
        {loading ? (
          <LoadingSkeleton />
        ) : result && (
          <form className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Access Token</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={result.accessToken}
                  readOnly
                  className="flex-1 bg-gray-100 text-xs font-mono px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                  style={{ minWidth: 0 }}
                  aria-label="Access Token"
                />
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className={`text-sm flex items-center gap-1 px-2 py-1 rounded border border-blue-100 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${copied ? 'text-green-600 border-green-200 bg-green-50' : 'text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'}`}
                  disabled={loading}
                  aria-label="Copy Access Token"
                >
                  {copied ? <CheckCircle className="w-4 h-4 animate-bounce" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expires At</label>
              <div className="text-sm text-gray-900">
                {new Date(result.expiresAt * 1000).toLocaleString()}
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* Add shimmer effect via global style if not already present */
// You can add this to your global CSS:
// .shimmer {
//   background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
//   background-size: 200% 100%;
//   animation: shimmer 1.5s infinite linear;
// }
// @keyframes shimmer {
//   0% { background-position: 200% 0; }
//   100% { background-position: -200% 0; }
// }
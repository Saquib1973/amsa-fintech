import { useEffect, useState, useCallback } from 'react';

type UseApiResult<T> = {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  refetch: () => void;
}

export const useApi = <T>(url: string, options: RequestInit = {}): UseApiResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setData(data);
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, isLoading: loading, refetch: fetchData };
}
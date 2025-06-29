import { useEffect, useRef, useState } from "react";

export const useDebounce = <T>(value: T, delay: number): [T, () => void] => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const cancel = () => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
  }
  useEffect(() => {
    timer.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      cancel();
    };
  }, [value, delay]);

  return [debouncedValue, cancel] as const;
}
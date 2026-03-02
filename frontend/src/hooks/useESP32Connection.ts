import { useState, useEffect, useRef, useCallback } from 'react';

export type ConnectionStatus = 'ONLINE' | 'OFFLINE' | 'CONNECTING';

export interface SensorData {
  steps: number;
  power: number;
  battery: number;
  totalEnergy: number;
  usedEnergy: number;
  voltage: number;
  current: number;
}

const DEFAULT_URL = 'http://192.168.43.148/data';
const STORAGE_KEY = 'esp32_url';
const POLL_INTERVAL = 1000;

export function useESP32Connection() {
  const [esp32Url, setEsp32UrlState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_URL;
  });
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('CONNECTING');
  const [sensorData, setSensorData] = useState<SensorData | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const retryCountRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async (url: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(url, {
        signal: abortControllerRef.current.signal,
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data: SensorData = await response.json();
      setSensorData(data);
      setConnectionStatus('ONLINE');
      retryCountRef.current = 0;
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      retryCountRef.current += 1;
      setConnectionStatus('OFFLINE');
    }
  }, []);

  const setEsp32Url = useCallback((url: string) => {
    localStorage.setItem(STORAGE_KEY, url);
    setEsp32UrlState(url);
    setConnectionStatus('CONNECTING');
    retryCountRef.current = 0;
  }, []);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Immediate first fetch
    fetchData(esp32Url);

    intervalRef.current = setInterval(() => {
      fetchData(esp32Url);
    }, POLL_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [esp32Url, fetchData]);

  return { connectionStatus, sensorData, esp32Url, setEsp32Url };
}

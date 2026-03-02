import { useState, useEffect, useRef, useCallback } from 'react';
import { useActor } from './useActor';
import type { SensorData } from './useESP32Connection';

export interface LifetimeStats {
  totalFootsteps: number;
  totalEnergyGenerated: number;
  totalRuntime: number;
}

const LS_KEY = 'esp32_lifetime_stats';
const SYNC_INTERVAL = 30000;

function loadFromStorage(): LifetimeStats {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw) as LifetimeStats;
  } catch {
    // ignore
  }
  return { totalFootsteps: 0, totalEnergyGenerated: 0, totalRuntime: 0 };
}

function saveToStorage(stats: LifetimeStats) {
  localStorage.setItem(LS_KEY, JSON.stringify(stats));
}

export function useLifetimeStats(sensorData: SensorData | null) {
  const { actor } = useActor();
  const [lifetimeStats, setLifetimeStats] = useState<LifetimeStats>(loadFromStorage);

  const pendingDeltaRef = useRef<LifetimeStats>({ totalFootsteps: 0, totalEnergyGenerated: 0, totalRuntime: 0 });
  const prevSensorRef = useRef<SensorData | null>(null);
  const runtimeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const syncIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isSyncingRef = useRef(false);

  // Load from backend on mount
  useEffect(() => {
    if (!actor) return;
    (async () => {
      try {
        const [steps, energy, runtime] = await Promise.all([
          actor.getTotalFootsteps(),
          actor.getTotalEnergy(),
          actor.getTotalRuntime(),
        ]);
        setLifetimeStats(prev => {
          const merged: LifetimeStats = {
            totalFootsteps: Math.max(prev.totalFootsteps, Number(steps)),
            totalEnergyGenerated: Math.max(prev.totalEnergyGenerated, energy),
            totalRuntime: Math.max(prev.totalRuntime, Number(runtime)),
          };
          saveToStorage(merged);
          return merged;
        });
      } catch {
        // Use localStorage values if backend unavailable
      }
    })();
  }, [actor]);

  // Track step deltas
  useEffect(() => {
    if (!sensorData) return;
    const prev = prevSensorRef.current;
    if (prev) {
      const stepDelta = Math.max(0, sensorData.steps - prev.steps);
      const energyDelta = Math.max(0, sensorData.totalEnergy - prev.totalEnergy);
      if (stepDelta > 0 || energyDelta > 0) {
        pendingDeltaRef.current.totalFootsteps += stepDelta;
        pendingDeltaRef.current.totalEnergyGenerated += energyDelta;
        setLifetimeStats(prev => {
          const updated: LifetimeStats = {
            ...prev,
            totalFootsteps: prev.totalFootsteps + stepDelta,
            totalEnergyGenerated: prev.totalEnergyGenerated + energyDelta,
          };
          saveToStorage(updated);
          return updated;
        });
      }
    }
    prevSensorRef.current = sensorData;
  }, [sensorData]);

  // Track runtime (increment every second when online)
  const incrementRuntime = useCallback(() => {
    pendingDeltaRef.current.totalRuntime += 1;
    setLifetimeStats(prev => {
      const updated = { ...prev, totalRuntime: prev.totalRuntime + 1 };
      saveToStorage(updated);
      return updated;
    });
  }, []);

  useEffect(() => {
    runtimeIntervalRef.current = setInterval(incrementRuntime, 1000);
    return () => {
      if (runtimeIntervalRef.current) clearInterval(runtimeIntervalRef.current);
    };
  }, [incrementRuntime]);

  // Sync to backend every 30 seconds
  useEffect(() => {
    syncIntervalRef.current = setInterval(async () => {
      if (!actor || isSyncingRef.current) return;
      const delta = { ...pendingDeltaRef.current };
      if (delta.totalFootsteps === 0 && delta.totalEnergyGenerated === 0 && delta.totalRuntime === 0) return;

      isSyncingRef.current = true;
      try {
        const promises: Promise<void>[] = [];
        if (delta.totalFootsteps > 0) {
          promises.push(actor.addFootsteps(BigInt(Math.floor(delta.totalFootsteps))));
        }
        if (delta.totalEnergyGenerated > 0) {
          promises.push(actor.addEnergy(delta.totalEnergyGenerated));
        }
        if (delta.totalRuntime > 0) {
          promises.push(actor.addRuntime(BigInt(Math.floor(delta.totalRuntime))));
        }
        await Promise.all(promises);
        pendingDeltaRef.current = { totalFootsteps: 0, totalEnergyGenerated: 0, totalRuntime: 0 };
      } catch {
        // Will retry next interval
      } finally {
        isSyncingRef.current = false;
      }
    }, SYNC_INTERVAL);

    return () => {
      if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
    };
  }, [actor]);

  return { lifetimeStats };
}

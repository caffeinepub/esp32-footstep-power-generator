import { useState, useCallback } from 'react';
import type { SensorData } from './useESP32Connection';

export interface ChartPoint {
  time: string;
  value: number;
}

export interface ChartData {
  power: ChartPoint[];
  steps: ChartPoint[];
  battery: ChartPoint[];
  energy: ChartPoint[];
}

const MAX_POINTS = 60;

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function useChartData() {
  const [chartData, setChartData] = useState<ChartData>({
    power: [],
    steps: [],
    battery: [],
    energy: [],
  });

  const addDataPoint = useCallback((data: SensorData) => {
    const time = formatTime(new Date());

    setChartData(prev => {
      const append = (arr: ChartPoint[], value: number): ChartPoint[] => {
        const next = [...arr, { time, value }];
        return next.length > MAX_POINTS ? next.slice(next.length - MAX_POINTS) : next;
      };

      return {
        power: append(prev.power, data.power),
        steps: append(prev.steps, data.steps),
        battery: append(prev.battery, data.battery),
        energy: append(prev.energy, data.totalEnergy),
      };
    });
  }, []);

  return { chartData, addDataPoint };
}

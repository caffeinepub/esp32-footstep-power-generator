import MetricCard from './MetricCard';
import type { SensorData, ConnectionStatus } from '../hooks/useESP32Connection';
import type { LifetimeStats } from '../hooks/useLifetimeStats';
import { Footprints, WifiOff } from 'lucide-react';

interface DashboardProps {
  sensorData: SensorData | null;
  connectionStatus: ConnectionStatus;
  lifetimeStats: LifetimeStats;
  stepAnimating: boolean;
}

function formatRuntime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export default function Dashboard({ sensorData, connectionStatus, lifetimeStats, stepAnimating }: DashboardProps) {
  const isOffline = connectionStatus === 'OFFLINE';
  const isPowerFlowing = (sensorData?.power ?? 0) > 0;
  const isCharging = (sensorData?.battery ?? 100) < 100 && isPowerFlowing;

  return (
    <div className="dashboard">
      {isOffline && (
        <div className="offline-banner">
          <WifiOff size={18} />
          <span>Device Offline — Retrying…</span>
        </div>
      )}

      {/* Primary metrics */}
      <div className="metrics-grid metrics-grid--primary">
        <MetricCard
          label="Footsteps"
          value={sensorData?.steps ?? 0}
          icon="/assets/generated/foot-icon.dim_128x128.png"
          accentColor="cyan"
          animating={stepAnimating}
          animationType="step"
          large
        />
        <MetricCard
          label="Power"
          value={(sensorData?.power ?? 0).toFixed(1)}
          unit="W"
          icon="/assets/generated/power-icon.dim_128x128.png"
          accentColor="blue"
          animating={isPowerFlowing}
          animationType="power"
          large
        />
        <MetricCard
          label="Battery"
          value={sensorData?.battery ?? 0}
          unit="%"
          icon="/assets/generated/battery-icon.dim_128x128.png"
          accentColor="green"
          animating={isCharging}
          animationType="charge"
          large
        />
      </div>

      {/* Secondary metrics */}
      <div className="metrics-grid metrics-grid--secondary">
        <MetricCard
          label="Voltage"
          value={(sensorData?.voltage ?? 0).toFixed(1)}
          unit="V"
          accentColor="blue"
        />
        <MetricCard
          label="Current"
          value={(sensorData?.current ?? 0).toFixed(2)}
          unit="A"
          accentColor="cyan"
        />
        <MetricCard
          label="Energy Generated"
          value={(sensorData?.totalEnergy ?? 0).toFixed(1)}
          unit="Wh"
          accentColor="green"
        />
        <MetricCard
          label="Energy Used"
          value={(sensorData?.usedEnergy ?? 0).toFixed(1)}
          unit="Wh"
          accentColor="yellow"
        />
      </div>

      {/* Power flow animation */}
      {isPowerFlowing && (
        <div className="power-flow-bar">
          <div className="power-flow-label">
            <span className="power-flow-dot" />
            Power Flow Active
          </div>
          <div className="power-flow-track">
            <div className="power-flow-stream" />
          </div>
        </div>
      )}

      {/* Lifetime stats */}
      <div className="lifetime-section">
        <h3 className="section-title">
          <Footprints size={16} />
          Lifetime Stats
        </h3>
        <div className="lifetime-grid">
          <div className="lifetime-stat">
            <span className="lifetime-value">{lifetimeStats.totalFootsteps.toLocaleString()}</span>
            <span className="lifetime-label">Total Steps</span>
          </div>
          <div className="lifetime-stat">
            <span className="lifetime-value">{lifetimeStats.totalEnergyGenerated.toFixed(2)}</span>
            <span className="lifetime-label">Total Energy (Wh)</span>
          </div>
          <div className="lifetime-stat">
            <span className="lifetime-value">{formatRuntime(lifetimeStats.totalRuntime)}</span>
            <span className="lifetime-label">Runtime</span>
          </div>
        </div>
      </div>
    </div>
  );
}

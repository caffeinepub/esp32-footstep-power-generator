import { useState } from 'react';
import { Settings, Zap } from 'lucide-react';
import SettingsPanel from './SettingsPanel';
import type { ConnectionStatus } from '../hooks/useESP32Connection';

interface HeaderProps {
  connectionStatus: ConnectionStatus;
  esp32Url: string;
  setEsp32Url: (url: string) => void;
}

export default function Header({ connectionStatus, esp32Url, setEsp32Url }: HeaderProps) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="header-brand">
          <Zap className="header-logo-icon" size={22} />
          <span className="header-title">Footstep Power</span>
        </div>

        <div className="header-right">
          <div className={`status-badge status-badge--${connectionStatus.toLowerCase()}`}>
            <span className="status-dot" />
            {connectionStatus}
          </div>
          <button
            className="icon-btn"
            onClick={() => setShowSettings(v => !v)}
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {showSettings && (
        <SettingsPanel
          esp32Url={esp32Url}
          setEsp32Url={setEsp32Url}
          onClose={() => setShowSettings(false)}
        />
      )}
    </header>
  );
}

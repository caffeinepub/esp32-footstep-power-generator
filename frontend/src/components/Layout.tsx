import type { ReactNode } from 'react';
import Header from './Header';
import BottomNavigation from './BottomNavigation';
import type { ActiveTab } from '../App';
import type { ConnectionStatus } from '../hooks/useESP32Connection';

interface LayoutProps {
  children: ReactNode;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  connectionStatus: ConnectionStatus;
  esp32Url: string;
  setEsp32Url: (url: string) => void;
}

export default function Layout({
  children,
  activeTab,
  setActiveTab,
  connectionStatus,
  esp32Url,
  setEsp32Url,
}: LayoutProps) {
  return (
    <div className="app-shell">
      <Header
        connectionStatus={connectionStatus}
        esp32Url={esp32Url}
        setEsp32Url={setEsp32Url}
      />
      <main className="app-main">
        {children}
      </main>
      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <footer className="app-footer">
        <span>
          Built with{' '}
          <span className="footer-heart" aria-label="love">⚡</span>
          {' '}using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'esp32-footstep-power')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            caffeine.ai
          </a>
        </span>
        <span className="footer-year">© {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}

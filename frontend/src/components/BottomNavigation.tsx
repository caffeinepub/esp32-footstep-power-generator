import { LayoutDashboard, BarChart2 } from 'lucide-react';
import type { ActiveTab } from '../App';

interface BottomNavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export default function BottomNavigation({ activeTab, setActiveTab }: BottomNavigationProps) {
  return (
    <nav className="bottom-nav">
      <button
        className={`bottom-nav-item ${activeTab === 'dashboard' ? 'bottom-nav-item--active' : ''}`}
        onClick={() => setActiveTab('dashboard')}
      >
        <LayoutDashboard size={22} />
        <span>Dashboard</span>
      </button>
      <button
        className={`bottom-nav-item ${activeTab === 'graphs' ? 'bottom-nav-item--active' : ''}`}
        onClick={() => setActiveTab('graphs')}
      >
        <BarChart2 size={22} />
        <span>Graphs</span>
      </button>
    </nav>
  );
}

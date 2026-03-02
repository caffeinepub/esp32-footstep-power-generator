import { useState, useEffect, useRef } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import GraphScreen from './components/GraphScreen';
import { useESP32Connection } from './hooks/useESP32Connection';
import { useChartData } from './hooks/useChartData';
import { useLifetimeStats } from './hooks/useLifetimeStats';

export type ActiveTab = 'dashboard' | 'graphs';

function AppContent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const { connectionStatus, sensorData, esp32Url, setEsp32Url } = useESP32Connection();
  const { chartData, addDataPoint } = useChartData();
  const { lifetimeStats } = useLifetimeStats(sensorData);

  const prevStepsRef = useRef<number>(0);
  const [stepAnimating, setStepAnimating] = useState(false);

  useEffect(() => {
    if (sensorData) {
      addDataPoint(sensorData);
      if (sensorData.steps > prevStepsRef.current) {
        setStepAnimating(true);
        setTimeout(() => setStepAnimating(false), 600);
      }
      prevStepsRef.current = sensorData.steps;
    }
  }, [sensorData, addDataPoint]);

  return (
    <Layout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      connectionStatus={connectionStatus}
      esp32Url={esp32Url}
      setEsp32Url={setEsp32Url}
    >
      {activeTab === 'dashboard' ? (
        <Dashboard
          sensorData={sensorData}
          connectionStatus={connectionStatus}
          lifetimeStats={lifetimeStats}
          stepAnimating={stepAnimating}
        />
      ) : (
        <GraphScreen chartData={chartData} connectionStatus={connectionStatus} />
      )}
    </Layout>
  );
}

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ChartData } from '../hooks/useChartData';
import type { ConnectionStatus } from '../hooks/useESP32Connection';

interface GraphScreenProps {
  chartData: ChartData;
  connectionStatus: ConnectionStatus;
}

interface ChartConfig {
  title: string;
  dataKey: keyof ChartData;
  unit: string;
  color: string;
  gradientId: string;
}

const charts: ChartConfig[] = [
  { title: 'Power', dataKey: 'power', unit: 'W', color: '#00BFFF', gradientId: 'powerGrad' },
  { title: 'Steps', dataKey: 'steps', unit: '', color: '#00FFFF', gradientId: 'stepsGrad' },
  { title: 'Battery', dataKey: 'battery', unit: '%', color: '#39FF14', gradientId: 'batteryGrad' },
  { title: 'Energy', dataKey: 'energy', unit: 'Wh', color: '#FFB800', gradientId: 'energyGrad' },
];

function MiniChart({ config, data }: { config: ChartConfig; data: { time: string; value: number }[] }) {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <span className="chart-title" style={{ color: config.color }}>{config.title}</span>
        <span className="chart-unit">{config.unit ? `(${config.unit})` : 'count'}</span>
      </div>
      <div className="chart-body">
        {data.length === 0 ? (
          <div className="chart-empty">Waiting for data…</div>
        ) : (
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={config.gradientId} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={config.color} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={config.color} stopOpacity={1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="time"
                tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 9 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 9 }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  background: '#0d1117',
                  border: `1px solid ${config.color}44`,
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                }}
                labelStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}
                formatter={(val: number) => [`${val}${config.unit}`, config.title]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={`url(#${config.gradientId})`}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: config.color, strokeWidth: 0 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default function GraphScreen({ chartData, connectionStatus }: GraphScreenProps) {
  return (
    <div className="graph-screen">
      <div className="graph-screen-header">
        <h2 className="graph-screen-title">Live Charts</h2>
        <span className={`graph-status graph-status--${connectionStatus.toLowerCase()}`}>
          {connectionStatus}
        </span>
      </div>
      <div className="charts-grid">
        {charts.map(cfg => (
          <MiniChart key={cfg.dataKey} config={cfg} data={chartData[cfg.dataKey]} />
        ))}
      </div>
    </div>
  );
}

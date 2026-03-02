interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: string;
  accentColor?: 'blue' | 'cyan' | 'green' | 'yellow' | 'orange';
  animating?: boolean;
  animationType?: 'step' | 'charge' | 'power';
  large?: boolean;
}

const accentMap = {
  blue: 'card--blue',
  cyan: 'card--cyan',
  green: 'card--green',
  yellow: 'card--yellow',
  orange: 'card--orange',
};

export default function MetricCard({
  label,
  value,
  unit,
  icon,
  accentColor = 'blue',
  animating = false,
  animationType,
  large = false,
}: MetricCardProps) {
  const cardClass = [
    'metric-card',
    accentMap[accentColor],
    animating && animationType === 'step' ? 'metric-card--step-anim' : '',
    animating && animationType === 'charge' ? 'metric-card--charge-anim' : '',
    animating && animationType === 'power' ? 'metric-card--power-anim' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClass}>
      {icon && (
        <div className={`metric-icon-wrap ${animating ? `anim-${animationType}` : ''}`}>
          <img src={icon} alt={label} className="metric-icon" />
        </div>
      )}
      <div className="metric-body">
        <div className={`metric-value ${large ? 'metric-value--large' : ''}`}>
          {value}
          {unit && <span className="metric-unit">{unit}</span>}
        </div>
        <div className="metric-label">{label}</div>
      </div>
    </div>
  );
}

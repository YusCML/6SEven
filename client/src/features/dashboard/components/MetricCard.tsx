type MetricCardProps = { value: string; label: string; tone: 'red' | 'amber' | 'green' };

export default function MetricCard({ value, label, tone }: MetricCardProps) {
  const styles = { red: 'bg-red-50 border-red-100 text-red-600', amber: 'bg-amber-50 border-amber-100 text-amber-600', green: 'bg-green-50 border-green-100 text-green-600' };
  return <div className={`${styles[tone]} p-4 rounded-lg border`}><span className="block text-2xl font-bold">{value}</span><span className="text-xs text-slate-500 font-medium">{label}</span></div>;
}

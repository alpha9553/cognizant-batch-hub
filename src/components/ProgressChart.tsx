import { PieChart, Pie, ResponsiveContainer, Tooltip, Legend, Cell } from "recharts";

interface ScheduleStatus {
  onSchedule: number;
  behind: number;
  advanced: number;
}

interface ProgressChartProps {
  data: ScheduleStatus;
}

const ProgressChart = ({ data }: ProgressChartProps) => {
  // Only show On Schedule and Behind Schedule (no Advanced)
  const chartData = [
    { name: "On Schedule", value: data.onSchedule, color: "hsl(var(--success))" },
    { name: "Behind Schedule", value: data.behind, color: "hsl(var(--warning))" },
  ].filter(item => item.value > 0); // Only show if value > 0

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ProgressChart;

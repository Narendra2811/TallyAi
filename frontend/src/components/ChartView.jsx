import {
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import { formatINR, chartAxisFormatter } from "../utils/formatters";

export function ChartView({ chartType, chartData, chartTitle }) {
  if (!chartType || chartType === "none" || !chartData?.length) return null;

  const data = chartData.map((p) => ({ ...p, value: parseFloat(p.value) }));
  const commonProps = { data, margin: { top: 4, right: 8, left: 8, bottom: 4 } };

  const xAxis = <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--text-secondary)" }} />;
  const yAxis = <YAxis tick={{ fontSize: 11, fill: "var(--text-secondary)" }} tickFormatter={chartAxisFormatter} />;
  const grid  = <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />;
  const tooltip = (
    <Tooltip
      formatter={(v) => [formatINR(v), "Value"]}
      contentStyle={{
        fontSize: 12,
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        color: "var(--text-primary)",
      }}
    />
  );

  return (
    <div className="chart-container">
      {chartTitle && <div className="chart-title">{chartTitle}</div>}
      <ResponsiveContainer width="100%" height={200}>
        {chartType === "bar" ? (
          <BarChart {...commonProps}>
            {grid}{xAxis}{yAxis}{tooltip}
            <Bar dataKey="value" fill="var(--accent)" radius={[5, 5, 0, 0]} />
          </BarChart>
        ) : (
          <LineChart {...commonProps}>
            {grid}{xAxis}{yAxis}{tooltip}
            <Line type="monotone" dataKey="value" stroke="var(--accent)" strokeWidth={2.5} dot={{ r: 4, fill: "var(--accent)" }} />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

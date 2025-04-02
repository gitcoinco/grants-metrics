import React from "react";
import { cn } from "@/lib/utils";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  type: "line" | "bar" | "area" | "pie";
  data: any[];
  xKey?: string;
  yKey?: string;
  dataKey?: string;
  colors?: string[];
  isLoading?: boolean;
  className?: string;
  height?: number;
  valueFormatter?: (value: number) => string;
}

export function ChartContainer({
  title,
  subtitle,
  type,
  data,
  xKey = "name",
  yKey = "value",
  dataKey,
  colors = ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"],
  isLoading = false,
  className,
  height = 300,
  valueFormatter = (value: number) => `${value}`,
}: ChartContainerProps) {
  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="h-full w-full flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      );
    }

    if (!data || data.length === 0) {
      return (
        <div className="h-full w-full flex items-center justify-center">
          <p className="text-muted-foreground text-sm">No data available</p>
        </div>
      );
    }

    switch (type) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey={xKey}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={valueFormatter}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  backgroundColor: "white",
                  border: "none",
                }}
                formatter={(value: number) => [valueFormatter(value), ""]}
                labelFormatter={(label) => `${label}`}
              />
              <Line
                type="monotone"
                dataKey={dataKey || yKey}
                stroke={colors[0]}
                strokeWidth={2}
                dot={{ fill: colors[0], strokeWidth: 0, r: 4 }}
                activeDot={{ fill: colors[0], strokeWidth: 0, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case "bar":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey={xKey}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={valueFormatter}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  backgroundColor: "white",
                  border: "none",
                }}
                formatter={(value: number) => [valueFormatter(value), ""]}
                labelFormatter={(label) => `${label}`}
              />
              <Bar
                dataKey={dataKey || yKey}
                fill={colors[0]}
                radius={[4, 4, 0, 0]}
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case "area":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors[0]} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={colors[0]} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey={xKey}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={valueFormatter}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  backgroundColor: "white",
                  border: "none",
                }}
                formatter={(value: number) => [valueFormatter(value), ""]}
                labelFormatter={(label) => `${label}`}
              />
              <Area
                type="monotone"
                dataKey={dataKey || yKey}
                stroke={colors[0]}
                fillOpacity={1}
                fill="url(#colorGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey={dataKey || yKey}
                nameKey={xKey}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  backgroundColor: "white",
                  border: "none",
                }}
                formatter={(value: number) => [valueFormatter(value), ""]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5 shadow-subtle overflow-hidden card-hover animate-fade-in",
        className
      )}
    >
      <div className="mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="h-[300px]">{renderChart()}</div>
    </div>
  );
}

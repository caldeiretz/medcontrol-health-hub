
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

interface DataPoint {
  date: string;
  value: number;
}

interface SingleLineChartProps {
  data: DataPoint[];
  dataKey: string;
  label: string;
  color: string;
  unit: string;
  normalRange?: { min: number; max: number };
  height?: number;
  referenceLines?: { value: number; label: string; color: string }[];
}

const SingleLineChart = ({ 
  data, 
  dataKey, 
  label, 
  color, 
  unit, 
  normalRange, 
  height = 320,
  referenceLines = []
}: SingleLineChartProps) => {
  const chartConfig = {
    [dataKey]: {
      label: label,
      color: color,
    },
  };

  const CustomTooltip = ({ active, payload, label: dateLabel }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      let status = "Normal";
      let statusColor = "text-green-600";
      
      if (normalRange) {
        if (value < normalRange.min) {
          status = "Baixo";
          statusColor = "text-blue-600";
        } else if (value > normalRange.max) {
          status = "Alto";
          statusColor = "text-red-600";
        }
      }

      return (
        <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">{`Data: ${dateLabel}`}</p>
          <div className="space-y-1">
            <p className="font-medium" style={{ color }}>
              <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color }}></span>
              {label}: {value} {unit}
            </p>
          </div>
          <div className={`mt-2 text-xs font-medium ${statusColor}`}>
            {status === "Normal" ? "✅" : "⚠️"} {status}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ChartContainer config={chartConfig} className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <defs>
            <linearGradient id={`${dataKey}Gradient`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis 
            dataKey="date" 
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          
          {/* Linhas de referência */}
          {normalRange && (
            <>
              <ReferenceLine y={normalRange.max} stroke="#ef4444" strokeDasharray="5 5" strokeOpacity={0.6} />
              <ReferenceLine y={normalRange.min} stroke="#3b82f6" strokeDasharray="5 5" strokeOpacity={0.6} />
            </>
          )}
          
          {referenceLines.map((refLine, index) => (
            <ReferenceLine 
              key={index}
              y={refLine.value} 
              stroke={refLine.color} 
              strokeDasharray="3 3" 
              strokeOpacity={0.6}
            />
          ))}
          
          <Tooltip content={<CustomTooltip />} />
          
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color}
            strokeWidth={3}
            dot={{ fill: color, strokeWidth: 2, r: 5 }}
            activeDot={{ r: 7, stroke: color, strokeWidth: 2, fill: '#fff' }}
            name={label}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default SingleLineChart;

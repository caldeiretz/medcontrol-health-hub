
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Area, AreaChart } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface PressureDataPoint {
  date: string;
  systolic: number;
  diastolic: number;
}

interface PressureChartProps {
  data: PressureDataPoint[];
  height?: number;
}

const chartConfig = {
  systolic: {
    label: "Sistólica",
    color: "hsl(var(--chart-1))",
  },
  diastolic: {
    label: "Diastólica", 
    color: "hsl(var(--chart-2))",
  },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-lg">
        <p className="font-semibold text-gray-800 mb-2">{`Data: ${label}`}</p>
        <div className="space-y-1">
          <p className="text-red-600 font-medium">
            <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
            Sistólica: {payload[0].value} mmHg
          </p>
          <p className="text-blue-600 font-medium">
            <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            Diastólica: {payload[1].value} mmHg
          </p>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          {payload[0].value > 140 || payload[1].value > 90 ? 
            "⚠️ Pressão elevada" : 
            payload[0].value < 90 || payload[1].value < 60 ?
            "⚠️ Pressão baixa" :
            "✅ Pressão normal"
          }
        </div>
      </div>
    );
  }
  return null;
};

const PressureChart = ({ data, height = 320 }: PressureChartProps) => {
  return (
    <ChartContainer config={chartConfig} className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <defs>
            <linearGradient id="systolicGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="diastolicGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
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
            domain={[40, 180]} 
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          
          {/* Zonas de referência */}
          <ReferenceLine y={140} stroke="#ef4444" strokeDasharray="5 5" strokeOpacity={0.5} />
          <ReferenceLine y={90} stroke="#ef4444" strokeDasharray="5 5" strokeOpacity={0.5} />
          <ReferenceLine y={120} stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity={0.5} />
          <ReferenceLine y={80} stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity={0.5} />
          
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />
          
          <Line 
            type="monotone" 
            dataKey="systolic" 
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ fill: '#ef4444', strokeWidth: 2, r: 5 }}
            activeDot={{ r: 7, stroke: '#ef4444', strokeWidth: 2, fill: '#fff' }}
            name="Sistólica"
          />
          <Line 
            type="monotone" 
            dataKey="diastolic" 
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
            activeDot={{ r: 7, stroke: '#3b82f6', strokeWidth: 2, fill: '#fff' }}
            name="Diastólica"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default PressureChart;


import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import ChartFilters from "./ChartFilters";
import PressureChart from "./PressureChart";
import SingleLineChart from "./SingleLineChart";

interface VitalChartProps {
  title: string;
  type: "pressure" | "glucose" | "heart-rate";
  data: any[];
  showFilters?: boolean;
  onExport?: () => void;
}

const VitalChart = ({ title, type, data, showFilters = true, onExport }: VitalChartProps) => {
  const [currentPeriod, setCurrentPeriod] = useState("7d");

  const getTrendData = () => {
    if (data.length < 2) return { trend: "stable", percentage: 0 };
    
    let currentValue, previousValue;
    
    if (type === "pressure") {
      currentValue = data[data.length - 1].systolic;
      previousValue = data[data.length - 2].systolic;
    } else if (type === "glucose") {
      currentValue = data[data.length - 1].glucose;
      previousValue = data[data.length - 2].glucose;
    } else {
      currentValue = data[data.length - 1].value;
      previousValue = data[data.length - 2].value;
    }

    const percentage = Math.abs(((currentValue - previousValue) / previousValue) * 100);
    const trend = currentValue > previousValue ? "up" : currentValue < previousValue ? "down" : "stable";
    
    return { trend, percentage: Math.round(percentage * 10) / 10 };
  };

  const { trend, percentage } = getTrendData();

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendText = () => {
    if (trend === "stable") return "Estável";
    return `${percentage}% ${trend === "up" ? "↑" : "↓"}`;
  };

  const renderChart = () => {
    switch (type) {
      case "pressure":
        return <PressureChart data={data} />;
      case "glucose":
        const glucoseData = data.map(item => ({ date: item.date, value: item.glucose }));
        return (
          <SingleLineChart
            data={glucoseData}
            dataKey="glucose"
            label="Glicemia"
            color="#10b981"
            unit="mg/dL"
            normalRange={{ min: 70, max: 126 }}
            referenceLines={[
              { value: 100, label: "Meta", color: "#166534" }
            ]}
          />
        );
      case "heart-rate":
        return (
          <SingleLineChart
            data={data}
            dataKey="heartRate"
            label="Batimentos"
            color="#8b5cf6"
            unit="bpm"
            normalRange={{ min: 60, max: 100 }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800">{title}</CardTitle>
          <div className="flex items-center gap-2 text-sm">
            {getTrendIcon()}
            <span className={`font-medium ${
              trend === "up" ? "text-red-600" : 
              trend === "down" ? "text-green-600" : 
              "text-gray-600"
            }`}>
              {getTrendText()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {showFilters && (
          <ChartFilters
            currentPeriod={currentPeriod}
            onPeriodChange={setCurrentPeriod}
            onExport={onExport}
          />
        )}
        <div className="mt-4">
          {renderChart()}
        </div>
      </CardContent>
    </Card>
  );
};

export default VitalChart;


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, TrendingUp } from "lucide-react";

interface ChartFiltersProps {
  onPeriodChange: (period: string) => void;
  onExport?: () => void;
  currentPeriod: string;
}

const ChartFilters = ({ onPeriodChange, onExport, currentPeriod }: ChartFiltersProps) => {
  const periods = [
    { value: "7d", label: "Últimos 7 dias" },
    { value: "1m", label: "Último mês" },
    { value: "3m", label: "Últimos 3 meses" },
    { value: "6m", label: "Últimos 6 meses" }
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl border border-gray-100">
      <div className="flex items-center gap-3">
        <Calendar className="h-5 w-5 text-blue-600" />
        <span className="text-sm font-medium text-gray-700">Período:</span>
        <Select value={currentPeriod} onValueChange={onPeriodChange}>
          <SelectTrigger className="w-40 bg-white border-gray-200 focus:border-blue-500">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg">
            {periods.map(period => (
              <SelectItem key={period.value} value={period.value} className="hover:bg-blue-50">
                {period.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {onExport && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onExport}
          className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
        >
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      )}
    </div>
  );
};

export default ChartFilters;

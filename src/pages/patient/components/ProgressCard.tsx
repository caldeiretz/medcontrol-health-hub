
import { HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProgressCardProps {
  onViewHistory: () => void;
}

const ProgressCard = ({ onViewHistory }: ProgressCardProps) => {
  return (
    <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 py-6">
        <CardTitle className="text-xl flex items-center gap-3 text-white">
          <div className="p-2 bg-white/20 rounded-lg">
            <HeartPulse className="h-6 w-6" />
          </div>
          <span className="font-bold">Seu progresso</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-3 font-medium">Adesão à medicação (últimos 7 dias)</p>
          <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
            <div 
              className="bg-gradient-to-r from-purple-500 to-purple-600 h-4 rounded-full shadow-lg transition-all duration-300" 
              style={{ width: '85%' }}
            ></div>
          </div>
          <div className="flex justify-between mt-3">
            <span className="text-xs text-gray-500">0%</span>
            <span className="text-sm font-bold text-purple-700 bg-purple-100 px-2 py-1 rounded-full">85%</span>
            <span className="text-xs text-gray-500">100%</span>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">Excelente! Continue assim!</p>
        </div>
        <Button 
          variant="outline" 
          className="w-full border-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300 font-semibold transition-all duration-200"
          onClick={onViewHistory}
        >
          Ver histórico completo
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProgressCard;

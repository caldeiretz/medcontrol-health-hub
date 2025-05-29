
import { Activity, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VitalsCardProps {
  onRegisterVitals: () => void;
}

const VitalsCard = ({ onRegisterVitals }: VitalsCardProps) => {
  return (
    <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 py-6">
        <CardTitle className="text-xl flex items-center gap-3 text-white">
          <div className="p-2 bg-white/20 rounded-lg">
            <Activity className="h-6 w-6" />
          </div>
          <span className="font-bold">Sinais vitais recentes</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
            <p className="text-sm text-green-700 font-medium mb-1">Pressão Arterial</p>
            <p className="text-2xl font-bold text-green-800">120/80 mmHg</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-600">Normal</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
            <p className="text-sm text-blue-700 font-medium mb-1">Glicemia</p>
            <p className="text-2xl font-bold text-blue-800">98 mg/dL</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-blue-600" />
              <span className="text-xs text-blue-600">Excelente</span>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full mt-4 border-2 border-green-200 hover:bg-green-50 hover:border-green-300 font-semibold transition-all duration-200"
            onClick={onRegisterVitals}
          >
            Registrar novo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VitalsCard;

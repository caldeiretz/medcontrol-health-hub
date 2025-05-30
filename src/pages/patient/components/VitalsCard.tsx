
import { Activity, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVitals } from "@/hooks/useVitals";

interface VitalsCardProps {
  onRegisterVitals: () => void;
}

const VitalsCard = ({ onRegisterVitals }: VitalsCardProps) => {
  const { vitals, isLoading } = useVitals();
  
  // Get today's vitals
  const today = new Date().toDateString();
  const todayVitals = vitals.filter(vital => 
    new Date(vital.recorded_at).toDateString() === today
  );

  const getLatestVital = (type: string) => {
    const vitalsOfType = todayVitals.filter(v => v.type === type);
    return vitalsOfType.length > 0 ? vitalsOfType[vitalsOfType.length - 1] : null;
  };

  const latestBP = getLatestVital('blood_pressure');
  const latestWeight = getLatestVital('weight');
  const latestHeartRate = getLatestVital('heart_rate');

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Sinais Vitais
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {isLoading ? (
            <p className="text-gray-500 text-sm">Carregando...</p>
          ) : todayVitals.length > 0 ? (
            <>
              {latestBP && (
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600 text-sm">Pressão Arterial</span>
                  <span className="font-medium">{latestBP.systolic}/{latestBP.diastolic} mmHg</span>
                </div>
              )}
              
              {latestWeight && (
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600 text-sm">Peso</span>
                  <span className="font-medium">{latestWeight.value} kg</span>
                </div>
              )}
              
              {latestHeartRate && (
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600 text-sm">Freq. Cardíaca</span>
                  <span className="font-medium">{latestHeartRate.value} bpm</span>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm mb-2">Nenhum sinal vital registrado hoje</p>
              <p className="text-gray-400 text-xs">Registre seus sinais vitais para acompanhar sua saúde</p>
            </div>
          )}
        </div>
        
        <Button onClick={onRegisterVitals} className="w-full mt-4">
          <Plus className="h-4 w-4 mr-2" />
          Registrar Sinais Vitais
        </Button>
      </CardContent>
    </Card>
  );
};

export default VitalsCard;

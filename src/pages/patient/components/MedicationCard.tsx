
import { Clock, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MedicationLog } from "@/services/medicationService";

interface MedicationCardProps {
  logs: MedicationLog[];
  onMedicationTaken: (logId: string) => void;
  onSkipMedication: (logId: string) => void;
  onViewAllMedications: () => void;
}

const MedicationCard = ({ 
  logs, 
  onMedicationTaken, 
  onSkipMedication, 
  onViewAllMedications 
}: MedicationCardProps) => {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeUntil = (dateString: string) => {
    const now = new Date();
    const scheduledTime = new Date(dateString);
    const diffMs = scheduledTime.getTime() - now.getTime();
    
    if (diffMs < 0) return "Agora";
    
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    
    if (hours === 0) return `${mins} min`;
    return `${hours}h ${mins}m`;
  };

  const nextLog = logs[0];

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          Próximas Medicações
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {logs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Nenhuma medicação pendente hoje!</p>
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-sm text-gray-400">Você está em dia com suas medicações</p>
          </div>
        ) : (
          <>
            {nextLog && (
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-l-blue-500">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">
                    {nextLog.medication?.name}
                  </h4>
                  <span className="text-sm text-blue-600 font-medium">
                    {getTimeUntil(nextLog.scheduled_time)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {nextLog.medication?.dosage} • {formatTime(nextLog.scheduled_time)}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => onMedicationTaken(nextLog.id)}
                    className="bg-green-500 hover:bg-green-600 text-white flex-1"
                  >
                    Tomei
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSkipMedication(nextLog.id)}
                    className="flex-1"
                  >
                    Pular
                  </Button>
                </div>
              </div>
            )}

            {logs.slice(1, 3).map((log) => (
              <div key={log.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium text-sm">{log.medication?.name}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTime(log.scheduled_time)} • {log.medication?.dosage}
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {getTimeUntil(log.scheduled_time)}
                </span>
              </div>
            ))}

            {logs.length > 3 && (
              <p className="text-xs text-gray-500 text-center">
                +{logs.length - 3} medicações hoje
              </p>
            )}
          </>
        )}

        <Button
          variant="ghost"
          onClick={onViewAllMedications}
          className="w-full justify-between text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          Ver todas as medicações
          <ChevronRight className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default MedicationCard;
